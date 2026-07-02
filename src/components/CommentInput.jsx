import { useState } from 'react';
import { SendHorizonal, Smile } from 'lucide-react';

// quick emoji list
const EMOJIS = ['❤️', '🔥', '😍', '👏', '😂', '💯', '✨', '🙌'];

const CommentInput = ({ onSubmit, submitting }) => {
  const [text, setText] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await onSubmit(text);
    setText('');
    setShowEmojis(false);
  };

  return (
    <div className="relative">
      {/* Emoji picker */}
      {showEmojis && (
        <div className="absolute bottom-14 left-0 bg-[#16161f] border border-[#2a2a3a] rounded-xl p-2 flex gap-2 flex-wrap w-52 shadow-xl z-10">
          {EMOJIS.map(emoji => (
            <button
              key={emoji}
              onClick={() => setText(prev => prev + emoji)}
              className="text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-[#2a2a3a] px-4 py-3"
      >
        {/* Emoji toggle */}
        <button
          type="button"
          onClick={() => setShowEmojis(!showEmojis)}
          className="text-gray-400 hover:text-white transition flex-shrink-0"
        >
          <Smile size={22} />
        </button>

        {/* Input */}
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="text-blue-500 hover:text-blue-400 disabled:opacity-30 transition flex-shrink-0"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
};

export default CommentInput;