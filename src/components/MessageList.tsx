import { useEffect, useRef } from 'react';
import type { Message, Plugin } from '../types';

export default function MessageList({ messages, plugins }: { 
  messages: Message[], 
  plugins: Plugin[] 
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2">
      <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[92%] md:max-w-[80%] rounded-2xl px-4 py-3 md:px-5 md:py-3 ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : msg.id.startsWith('loading-')
                  ? 'bg-gray-100 text-gray-500 italic rounded-bl-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.type === 'plugin' 
                ? plugins.find(p => p.name === msg.pluginName)?.render(msg.pluginData)
                : msg.content === "I can help with:\n\n• Weather (e.g. 'What's the weather in ABC Place?')\n• Definitions (e.g. 'What is xyz?')\n• Calculations (e.g. 'Calculate x+y')"
                  ? getApologyMessage()
                  : <div className="whitespace-pre-wrap text-base md:text-[0.95rem] leading-relaxed">
                      {msg.content}
                    </div>
              }
            </div>
          </div>
        ))}
        <div ref={endRef} className="pt-2 md:pt-3" />
      </div>
    </div>
  );
}