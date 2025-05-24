import { useState } from 'react';

export default function InputArea({ onSend, disabled }: {
  onSend: (input: string) => void,
  disabled: boolean
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border border-gray-300 rounded-full py-5 px-6 pr-24 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        style={{ 
          height: '4rem',
          paddingLeft: '4rem',
          maxWidth: '100%',
          fontSize: '1.3rem', // Increased from text-xl (1.25rem) to 1.5rem
          lineHeight: '2rem' // Added for better text alignment
        }}
        placeholder="🤷‍♀️ enter your query...."
        disabled={disabled}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out disabled:opacity-50"
        style={{
          height: '3rem',
          background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
          boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.boxShadow = '0 10px 25px rgba(30, 64, 175, 0.6)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)')
        }
        disabled={disabled || !input.trim()}
      >
        send
      </button>
    </form>
  );
}