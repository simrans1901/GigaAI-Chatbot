import { useState, useEffect } from 'react';

export default function InputArea({ onSend, disabled }: {
  onSend: (input: string) => void,
  disabled: boolean
}) {
  const [input, setInput] = useState('');

  // Handle mobile keyboard appearance
  useEffect(() => {
    const handleResize = () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    };

    // Add visual viewport listener for better mobile support
    const vp = window.visualViewport;
    if (vp) {
      vp.addEventListener('resize', handleResize);
    }
    
    // Regular resize listener as fallback
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (vp) vp.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      // Scroll after sending message
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container relative w-full px-4">
      <div className="relative mx-auto" style={{ maxWidth: 'min(100%, 800px)' }}>
        <div className="flex items-center border border-gray-300 rounded-full bg-white focus-within:ring-2 focus-within:ring-blue-500">
          <div className="pl-4 text-gray-400">
            🤷‍♀️
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 py-3 px-3 focus:outline-none bg-transparent disabled:opacity-50"
            style={{
              height: '3.25rem',
              fontSize: '1.5rem',
              boxSizing: 'border-box',
              paddingRight: '5rem',
            }}
            placeholder="Ask anything..."
            disabled={disabled}
          />
          <button
            type="submit"
            className="h-10 mr-2 my-1 text-white font-medium px-4 rounded-full shadow transition-all duration-200 ease-in-out disabled:opacity-50 active:scale-95"
            style={{
              minWidth: '4.5rem',
              background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)',
              fontSize: '0.9rem'
            }}
            disabled={disabled || !input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </form>
  );
}