const { Storage } = require('@google-cloud/storage');
const { logger } = require('../utils/logger');
const path = require('path');

class CloudStorageService {
  constructor() {
    this.useMockMode = !process.env.GOOGLE_CLOUD_PROJECT;
    
    if (this.useMockMode) {
      logger.warn('⚠️  Running Cloud Storage in MOCK MODE - No GCP project configured');
    } else {
      this.storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT
      });
      this.bucketName = process.env.GCS_BUCKET_NAME || `${process.env.GOOGLE_CLOUD_PROJECT}-uploads`;
    }
  }

  /**
   * Upload file to Google Cloud Storage
   */
  async uploadFile(file, folder = 'uploads') {
    try {
      if (this.useMockMode) {
        return this.getMockUploadResponse(file, folder);
      }

      const bucket = this.storage.bucket(this.bucketName);
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}-${file.originalname}`;
      const blob = bucket.file(fileName);

      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype,
          metadata: {
            uploadedAt: new Date().toISOString()
          }
        }
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
          logger.error('Upload error:', err);
          reject(new Error('Upload failed'));
        });

        blobStream.on('finish', async () => {
          const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
          
          // Make file publicly accessible
          await blob.makePublic();

          logger.info(`File uploaded successfully: ${fileName}`);
          resolve({
            success: true,
            fileName,
            publicUrl,
            size: file.size,
            contentType: file.mimetype
          });
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      logger.error('Error uploading file:', error);
      throw new Error('Failed to upload file to Cloud Storage');
    }
  }

  /**
   * Delete file from Google Cloud Storage
   */
  async deleteFile(fileName) {
    try {
      if (this.useMockMode) {
        return { success: true, message: 'Mock deletion successful' };
      }

      const bucket = this.storage.bucket(this.bucketName);
      await bucket.file(fileName).delete();

      logger.info(`File deleted successfully: ${fileName}`);
      return { success: true, message: 'File deleted successfully' };
    } catch (error) {
      logger.error('Error deleting file:', error);
      throw new Error('Failed to delete file from Cloud Storage');
    }
  }

  /**
   * Get signed URL for temporary access
   */
  async getSignedUrl(fileName, expiresIn = 3600) {
    try {
      if (this.useMockMode) {
        return { signedUrl: `https://mock-storage.example.com/${fileName}` };
      }

      const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresIn * 1000
      };

      const bucket = this.storage.bucket(this.bucketName);
      const [url] = await bucket.file(fileName).getSignedUrl(options);

      return { signedUrl: url };
    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * List files in bucket
   */
  async listFiles(prefix = '') {
    try {
      if (this.useMockMode) {
        return this.getMockFileList();
      }

      const bucket = this.storage.bucket(this.bucketName);
      const [files] = await bucket.getFiles({ prefix });

      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated
      }));
    } catch (error) {
      logger.error('Error listing files:', error);
      throw new Error('Failed to list files');
    }
  }

  /**
   * Mock response for development
   */
  getMockUploadResponse(file, folder) {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    return {
      success: true,
      fileName,
      publicUrl: `https://mock-storage.example.com/${fileName}`,
      size: file.size,
      contentType: file.mimetype
    };
  }

  /**
   * Mock file list
   */
  getMockFileList() {
    return [
      {
        name: 'uploads/sample-document.pdf',
        size: 1024000,
        contentType: 'application/pdf',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      },
      {
        name: 'uploads/sample-image.jpg',
        size: 512000,
        contentType: 'image/jpeg',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
    ];
  }
}

module.exports = new CloudStorageService();
