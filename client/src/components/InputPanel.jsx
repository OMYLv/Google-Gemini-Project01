import { useState, useRef } from 'react';
import { Send, Image, Mic, FileText, Loader2 } from 'lucide-react';

export default function InputPanel({ useCase, onProcess, isProcessing }) {
  const [inputType, setInputType] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [context, setContext] = useState('');
  const [priority, setPriority] = useState('medium');
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
        setImagePreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!textInput.trim() && !imageData) {
      alert('Please provide some input');
      return;
    }

    const data = {
      type: imageData ? 'multimodal' : 'text',
      text: textInput,
      context,
      priority,
      imageData,
    };

    onProcess(data);
  };

  const handleClear = () => {
    setTextInput('');
    setContext('');
    setImageData(null);
    setImagePreview(null);
    setPriority('medium');
  };

  return (
    <div className="card border-2 border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 w-1.5 h-8 rounded-full animate-pulse"></span>
          Input
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setInputType('text')}
            className={`p-3 rounded-xl transition-all duration-300 group ${
              inputType === 'text' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/10 backdrop-blur-lg text-purple-300 hover:bg-white/20 hover:text-white'
            }`}
            title="Text Input"
          >
            <FileText className="w-5 h-5 group-hover:animate-pulse" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => {
              setInputType('image');
              fileInputRef.current?.click();
            }}
            className={`p-3 rounded-xl transition-all duration-300 group ${
              inputType === 'image' 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/10 backdrop-blur-lg text-purple-300 hover:bg-white/20 hover:text-white'
            }`}
            title="Image Upload"
          >
            <Image className="w-5 h-5 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setInputType('voice')}
            className="p-3 rounded-xl bg-white/5 text-purple-300/50 cursor-not-allowed"
            title="Voice Input (Coming Soon)"
            disabled
          >
            <Mic className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-bold text-purple-200 mb-3 uppercase tracking-wider">
            Your Input
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={`Describe ${useCase} situation, paste text, or upload an image...`}
            className="input-field resize-none"
            rows="6"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative group">
            <img 
              src={imagePreview} 
              alt="Upload preview" 
              className="w-full h-48 object-cover rounded-2xl border-2 border-purple-500/50 shadow-xl"
            />
            <button
              type="button"
              onClick={() => {
                setImageData(null);
                setImagePreview(null);
              }}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              ×
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Context */}
        <div>
          <label className="block text-sm font-bold text-purple-200 mb-3 uppercase tracking-wider">
            Additional Context (Optional)
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Provide additional context..."
            className="input-field"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-bold text-purple-200 mb-3 uppercase tracking-wider">
            Priority Level
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="critical">Critical Priority</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-2">
          <button
            type="submit"
            disabled={isProcessing}
            className="btn-primary flex-1 flex items-center justify-center space-x-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                <span className="font-black text-lg">Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-6 h-6 animate-pulse" strokeWidth={2.5} />
                <span className="font-black text-lg">Process Input</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary px-8"
            disabled={isProcessing}
          >
            <span className="font-bold">Clear</span>
          </button>
        </div>
      </form>
    </div>
  );
}
