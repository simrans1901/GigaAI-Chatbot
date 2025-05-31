import { useState, useEffect, useRef } from 'react';

export default function InputArea({ onSend, disabled }: {
  onSend: (input: string) => void,
  disabled: boolean
}) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle mobile keyboard appearance
  useEffect(() => {
    const handleFocus = () => {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 300);
    };

    const currentInput = inputRef.current;
    currentInput?.addEventListener('focus', handleFocus);
    
    return () => {
      currentInput?.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center bg-gray-100 rounded-full px-4">
          <div className="text-gray-400 mr-2">
            🤷‍♀️
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 py-3 bg-transparent focus:outline-none text-base disabled:opacity-50"
            style={{
              height: '2.75rem',
              paddingRight: '1rem',
            }}
            placeholder="Ask anything..."
            disabled={disabled}
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50 transition-all duration-200 active:scale-95"
            style={{
              minWidth: '4.5rem',
              height: '2.5rem'
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