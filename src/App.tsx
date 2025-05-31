import ChatContainer from './components/ChatContainer';
import { calcPlugin } from './plugins/calcPlugin';
import { weatherPlugin } from './plugins/weatherPlugin';
import { dictPlugin } from './plugins/dictPlugin';

export default function App() {
  const plugins = [calcPlugin, weatherPlugin, dictPlugin];
  
  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50"> {/* Changed h-screen to h-[100dvh] for better mobile support */}
      <ChatContainer plugins={plugins} />
    </div>
  );
}