
import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { BotIcon, LoaderIcon, UserIcon } from './icons';

interface ChatInterfaceProps {
    chatHistory: ChatMessage[];
    isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatHistory, isLoading }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const formatContent = (content: string) => {
        // Simple markdown-like formatting for bold text and lists
        const bolded = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        const listItems = bolded.replace(/^\s*[-*]\s+(.*)/gm, '<li class="ml-4 list-disc">$1</li>');
        return { __html: listItems.replace(/\n/g, '<br />') };
    };

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                             <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <BotIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={formatContent(msg.content)} />
                        </div>
                         {msg.role === 'user' && (
                             <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <UserIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 justify-start">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <BotIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-xl p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <div className="flex items-center gap-2">
                                <LoaderIcon className="w-5 h-5 animate-spin"/>
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
        </div>
    );
};

export default ChatInterface;
