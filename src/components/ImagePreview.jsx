import { X, ZoomIn } from 'lucide-react';

const ImagePreview = ({ preview, onRemove }) => {
  if (!preview) return null;

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0a0a0f] group">
      <img
        src={preview}
        alt="preview"
        className="w-full h-full object-cover"
      />
      {/* Remove button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition"
      >
        <X size={16} className="text-white" />
      </button>
      {/* Preview label */}
      <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-lg">
        <p className="text-xs text-white font-medium flex items-center gap-1">
          <ZoomIn size={11} /> Preview
        </p>
      </div>
    </div>
  );
};

export default ImagePreview;