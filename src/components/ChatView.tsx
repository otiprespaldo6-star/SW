import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/geminiService';
import { Send, Sparkles, Loader2, RefreshCw, MessageSquare } from 'lucide-react';

interface ChatViewProps {
  profile: UserProfile;
}

export const ChatView: React.FC<ChatViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => StorageService.getChatHistory());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickSuggestions = [
    '¿Qué me pongo hoy para una reunión importante?',
    '¿Cómo combino un pantalón ancho con mi silueta?',
    '¿Qué prenda básica le falta a mi paleta de colores?',
    '¿Cómo elevar un look informal con zapatillas?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    StorageService.saveChatHistory(updated);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const replyText = await GeminiService.generateResponse(text, profile);
      const wilmaMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'wilma',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const finalMessages = [...updated, wilmaMessage];
      setMessages(finalMessages);
      StorageService.saveChatHistory(finalMessages);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const defaultWelcome: ChatMessage[] = [
      {
        id: 'msg-welcome',
        sender: 'wilma',
        text: `¡Hola de nuevo, ${profile.name}! Estoy lista para ayudarte. Conozco tu paleta de ${profile.colorDna.season} y tu estilo ${profile.styleDna.primary}. ¿Qué look o decisión de vestuario tienes entre manos hoy?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(defaultWelcome);
    StorageService.saveChatHistory(defaultWelcome);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] pb-20">
      {/* Chat Sub-Header */}
      <div className="px-4 py-2.5 bg-white border-b border-[#EBE3D5] flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C5A059] flex items-center justify-center font-serif text-sm">
            W
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-stone-900">Wilma</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-stone-500">
              Contexto Style DNA activo ({profile.colorDna.season})
            </span>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          title="Reiniciar conversación"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs whitespace-pre-line ${
                  isUser
                    ? 'bg-[#1C1917] text-[#FAF6F0] rounded-br-xs'
                    : 'bg-white border border-[#E8DEC9] text-stone-800 rounded-bl-xs'
                }`}
              >
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#C5A059] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Wilma</span>
                  </div>
                )}
                {msg.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1 font-mono">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-[#E8DEC9] rounded-2xl px-4 py-3 text-xs text-stone-600 rounded-bl-xs flex items-center gap-2 shadow-2xs">
              <Loader2 className="w-4 h-4 text-[#C86D51] animate-spin" />
              <span>Wilma está consultando tu Style DNA...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions Chips */}
      <div className="px-4 py-1.5 bg-[#FBF9F5] overflow-x-auto no-scrollbar flex gap-2">
        {quickSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(suggestion)}
            className="px-3 py-1.5 rounded-full border border-stone-200 bg-white text-[11px] text-stone-700 whitespace-nowrap hover:border-[#C5A059] hover:bg-[#F4EFE6] transition-all shadow-2xs"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-[#EBE3D5]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 max-w-md mx-auto"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregúntale a Wilma qué ponerte o combinar..."
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 bg-[#FBF9F5] text-xs focus:outline-none focus:border-[#C5A059] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-[#1C1917] text-[#FAF6F0] hover:bg-black disabled:opacity-40 transition-all flex items-center justify-center shadow-xs"
          >
            <Send className="w-4 h-4 text-[#C5A059]" />
          </button>
        </form>
      </div>
    </div>
  );
};
