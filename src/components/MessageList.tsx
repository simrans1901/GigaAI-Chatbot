
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

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto space-y-3"> 
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] rounded-xl px-4 py-2 ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none' 
                : msg.id.startsWith('loading-')
                  ? 'bg-gray-100 text-gray-500 italic rounded-bl-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}>
              {msg.type === 'plugin' 
                ? plugins.find(p => p.name === msg.pluginName)?.render(msg.pluginData)
                : <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
              }
              
              {!msg.id.startsWith('loading-') && (
                <div className={`text-xs mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}