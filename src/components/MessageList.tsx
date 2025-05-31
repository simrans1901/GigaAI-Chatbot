import { useEffect, useRef } from 'react';
import type { Message, Plugin } from '../types';

export default function MessageList({ messages, plugins }: { 
  messages: Message[], 
  plugins: Plugin[] 
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only scroll if not currently focused on input
    if (!document.activeElement?.matches('input, textarea')) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const getApologyMessage = () => {
    const apologies = [
      "I'm sorry, I don't have information about that.",
      "Apologies, but I can't help with that particular request.",
      "I'm afraid that's beyond my current capabilities.",
      "Sorry, I'm not able to assist with that topic.",
      "I wish I could help, but I don't have knowledge about that."
    ];
    return apologies[Math.floor(Math.random() * apologies.length)];
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-2"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="max-w-2xl mx-auto space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] rounded-xl px-4 py-3 ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-sm' 
                : msg.id.startsWith('loading-')
                  ? 'bg-gray-100 text-gray-500 italic rounded-bl-sm' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {msg.type === 'plugin' 
                ? plugins.find(p => p.name === msg.pluginName)?.render(msg.pluginData)
                : msg.content === "I can help with:\n\n• Weather (e.g. 'What's the weather in ABC Place?')\n• Definitions (e.g. 'What is xyz?')\n• Calculations (e.g. 'Calculate x+y')"
                  ? getApologyMessage()
                  : <div className="whitespace-pre-wrap text-base leading-normal">
                      {msg.content}
                    </div>
              }
            </div>
          </div>
        ))}
        <div ref={endRef} className="pt-2" />
      </div>
    </div>
  );
}