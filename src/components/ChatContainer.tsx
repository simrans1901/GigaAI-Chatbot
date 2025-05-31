import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import type { Message, Plugin } from '../types';
import image from './imagee.gif';

const parseNaturalLanguage = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  if (/(weather|forecast).*(in|for|at)/.test(lowerInput) || 
      /(how's|what's).*(weather|forecast)/.test(lowerInput)) {
    const cityMatch = input.match(/(?:in|for|at|is|the)\s+([^\?.,!]+)/i);
    if (cityMatch) return `/weather ${cityMatch[1].trim()}`;
  }
  
  if (/what('s| is) (an|a|the)?\s+([^\?.,!]+)/i.test(lowerInput) || 
      /define\s+([^\?.,!]+)/i.test(lowerInput)) {
    const wordMatch = input.match(/(?:what's|what is|define)\s+(an?|the)?\s*([^\?.,!]+)/i);
    if (wordMatch) return `/define ${wordMatch[2].trim()}`;
  }
  
  if (/calculate|what('s| is) (the )?(result|answer|value) (of|for)/.test(lowerInput) ||
      /(?:solve|compute|evaluate)\s+([^\?.,!]+)/i.test(lowerInput)) {
    const exprMatch = input.match(/(?:calculate|what's|what is|solve|compute|evaluate)\s+(?:the )?(?:result|answer|value)?\s*(?:of|for)?\s*([^\?.,!]+)/i);
    if (exprMatch) return `/calc ${exprMatch[1].trim()}`;
  }
  
  return input;
};

export default function ChatContainer({ plugins }: { plugins: Plugin[] }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMessages = () => {
      try {
        const saved = localStorage.getItem('trupulse_chat_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const validMessages = parsed.filter(msg => 
              msg.id && msg.sender && msg.content && msg.timestamp
            );
            setMessages(validMessages);
            return;
          }
        }
        
        setMessages([{
          id: 'welcome',
          sender: 'assistant',
          content: "Hi! I'm GigaAI Chatbot. You can ask naturally:\n\n• 'What's the weather in XYZ Place?'\n• 'Define XYZ'\n• 'Calculate X+Y'\n\nOr use commands: /weather, /define, /calc",
          type: 'text',
          timestamp: new Date().toISOString()
        }]);
      } catch (e) {
        console.error('Failed to load messages', e);
      }
    };
    loadMessages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('trupulse_chat_v2', JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save messages', e);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = async (input: string) => {
    const processedInput = parseNaturalLanguage(input);
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    const loadingMsg: Message = {
      id: `loading-${Date.now()}`,
      sender: 'assistant',
      content: '...',
      type: 'text',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      let response: Message | null = null;
      
      for (const plugin of plugins) {
        if (plugin.match(processedInput)) {
          const result = await plugin.execute(processedInput);
          response = {
            id: Date.now().toString(),
            sender: 'assistant',
            content: '',
            type: 'plugin',
            pluginName: plugin.name,
            pluginData: result,
            timestamp: new Date().toISOString()
          };
          break;
        }
      }

      if (!response) {
        response = {
          id: Date.now().toString(),
          sender: 'assistant',
          content: "I can help with:\n\n• Weather (e.g. 'What's the weather in ABC Place?')\n" +
                  "• Definitions (e.g. 'What is xyz?')\n" +
                  "• Calculations (e.g. 'Calculate x+y')",
          type: 'text',
          timestamp: new Date().toISOString()
        };
      }

      setMessages(prev => [...prev.filter(m => m.id !== loadingMsg.id), response!]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        sender: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
        type: 'text',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev.filter(m => m.id !== loadingMsg.id), errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-screen"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Removed the blur overlay div completely */}
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header - removed backdrop-blur-sm */}
        <div className="border-b border-gray-200/50 bg-white p-3 md:p-4">
          <h1 className="text-xl md:text-2xl font-bold text-center text-blue-800">
            <i>GigaAI Chatbot</i>
          </h1>
        </div>

        {/* Message List - removed backdropFilter */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 bg-gray-50">
          <MessageList messages={messages} plugins={plugins} />
        </div>

        {/* Input Area - simplified styling */}
        <div className="border-t border-gray-200 bg-white px-3 md:px-4 py-3 md:py-4">
          <InputArea onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}