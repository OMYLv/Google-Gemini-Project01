const NodeCache = require('node-cache');
const { logger } = require('../utils/logger');

class CacheService {
  constructor() {
    // TTL in seconds (default: 1 hour)
    this.cache = new NodeCache({
      stdTTL: 3600,
      checkperiod: 600,
      useClones: false
    });

    this.cache.on('set', (key, value) => {
      logger.debug(`Cache set: ${key}`);
    });

    this.cache.on('expired', (key, value) => {
      logger.debug(`Cache expired: ${key}`);
    });
  }

  /**
   * Get value from cache
   */
  get(key) {
    const value = this.cache.get(key);
    if (value) {
      logger.debug(`Cache hit: ${key}`);
      return value;
    }
    logger.debug(`Cache miss: ${key}`);
    return null;
  }

  /**
   * Set value in cache
   */
  set(key, value, ttl = null) {
    const success = ttl ? this.cache.set(key, value, ttl) : this.cache.set(key, value);
    return success;
  }

  /**
   * Delete from cache
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  flush() {
    this.cache.flushAll();
    logger.info('Cache flushed');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }
}

module.exports = new CacheService();
