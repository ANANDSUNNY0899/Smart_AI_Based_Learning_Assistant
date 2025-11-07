import React, { useState, useCallback, useEffect } from 'react';
import { ChatMessage, QuizQuestion, QuizResult } from './types';
import * as geminiService from './services/geminiService';
import ChatInterface from './components/ChatInterface';
import ProgressTracker from './components/ProgressTracker';
import QuizView from './components/QuizView';
import ImageEditor from './components/ImageEditor';
import { BookOpenIcon, BrainCircuitIcon, ImageIcon, LightbulbIcon, LoaderIcon, SendIcon, SparklesIcon, ZapIcon } from './components/icons';

type View = 'learn' | 'edit';

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('learn');

    // State for Learning Assistant
    const [topic, setTopic] = useState<string>('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentExplanation, setCurrentExplanation] = useState<string>('');
    const [isQuizzing, setIsQuizzing] = useState<boolean>(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
    const [progress, setProgress] = useState<QuizResult[]>([]);
    const [currentTopic, setCurrentTopic] = useState<string>('');

    useEffect(() => {
        const savedProgress = localStorage.getItem('learningAssistantProgress');
        if (savedProgress) {
            setProgress(JSON.parse(savedProgress));
        }
        setChatHistory([{
            role: 'model',
            content: "Hello! I'm your AI Learning Assistant. What concept would you like to learn about today?"
        }]);
    }, []);

    useEffect(() => {
        localStorage.setItem('learningAssistantProgress', JSON.stringify(progress));
    }, [progress]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (!message.trim() || isLoading) return;

        const newChatMessage: ChatMessage = { role: 'user', content: message };
        setChatHistory(prev => [...prev, newChatMessage]);
        setIsLoading(true);
        setCurrentTopic(message);
        setCurrentExplanation('');

        try {
            const explanation = await geminiService.explainConcept(message);
            setCurrentExplanation(explanation);
            setChatHistory(prev => [...prev, { role: 'model', content: explanation }]);
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
            setTopic('');
        }
    }, [isLoading]);
    
    const handleExplanationAction = useCallback(async (action: 'simplify' | 'elaborate') => {
        if (isLoading || !currentExplanation || !currentTopic) return;

        setIsLoading(true);
        const userMessage = action === 'simplify' ? `Can you explain "${currentTopic}" more simply?` : `Can you explain "${currentTopic}" in more detail?`;
        setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const newExplanation = action === 'simplify' 
                ? await geminiService.simplifyExplanation(currentTopic, currentExplanation)
                : await geminiService.elaborateExplanation(currentTopic, currentExplanation);
            setCurrentExplanation(newExplanation);
            setChatHistory(prev => [...prev, { role: 'model', content: newExplanation }]);
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I couldn't modify the explanation. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, currentExplanation, currentTopic]);

    const handleStartQuiz = useCallback(async () => {
        if (isLoading || !currentTopic) return;

        setIsLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: `Let's start a quiz on "${currentTopic}"!` }]);
        
        try {
            const questions = await geminiService.generateQuiz(currentTopic);
            if (questions && questions.length > 0) {
                setQuizQuestions(questions);
                setIsQuizzing(true);
                 setChatHistory(prev => [...prev, { role: 'model', content: "Great! Here is your quiz. Good luck!" }]);
            } else {
                throw new Error("No questions were generated.");
            }
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I couldn't create a quiz right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, currentTopic]);

    const handleQuizComplete = (score: number, total: number) => {
        const percentage = (score / total) * 100;
        const newResult: QuizResult = {
            topic: currentTopic,
            score: percentage,
            date: new Date().toLocaleDateString(),
        };
        setProgress(prev => [...prev, newResult]);
        setIsQuizzing(false);
        setQuizQuestions(null);
        setChatHistory(prev => [...prev, { role: 'model', content: `Quiz complete! You scored ${score}/${total} (${percentage.toFixed(0)}%). Keep up the great work!` }]);
    };
    
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100 p-4 gap-4">
            <header className="flex-shrink-0">
                <nav className="bg-gray-800/50 rounded-xl p-2 flex items-center justify-center border border-gray-700 max-w-md mx-auto">
                    <div className="flex gap-2 bg-gray-700 p-1 rounded-lg">
                        <button onClick={() => setActiveView('learn')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'learn' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                            <BookOpenIcon className="w-5 h-5"/>
                            Learning Assistant
                        </button>
                        <button onClick={() => setActiveView('edit')} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeView === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                            <ImageIcon className="w-5 h-5" />
                            Image Editor
                        </button>
                    </div>
                </nav>
            </header>
            
            {activeView === 'learn' ? (
                <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-4">
                    <main className="flex flex-col flex-1 h-full bg-gray-800/50 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                        {isQuizzing && quizQuestions ? (
                            <QuizView questions={quizQuestions} onQuizComplete={handleQuizComplete} />
                        ) : (
                            <>
                                <ChatInterface chatHistory={chatHistory} isLoading={isLoading} />
                                <div className="p-4 border-t border-gray-700">
                                    {currentExplanation && !isLoading && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <button onClick={() => handleExplanationAction('simplify')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                                                <ZapIcon className="w-4 h-4" /> Explain Simpler
                                            </button>
                                            <button onClick={() => handleExplanationAction('elaborate')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors">
                                                <BrainCircuitIcon className="w-4 h-4" /> Go Deeper
                                            </button>
                                            <button onClick={handleStartQuiz} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 rounded-full transition-colors">
                                                <SparklesIcon className="w-4 h-4" /> Start Quiz
                                            </button>
                                        </div>
                                    )}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(topic)}
                                            placeholder="Ask about a new concept..."
                                            className="w-full bg-gray-700 border border-gray-600 rounded-full py-3 pl-5 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={isLoading}
                                        />
                                        <button
                                            onClick={() => handleSendMessage(topic)}
                                            disabled={isLoading || !topic.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SendIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </main>
                    <aside className="w-full lg:w-1/3 xl:w-1/4 h-full flex flex-col bg-gray-800/50 rounded-2xl shadow-2xl p-6 border border-gray-700">
                        <div className="flex items-center gap-3 mb-6">
                            <LightbulbIcon className="w-8 h-8 text-yellow-400" />
                            <h2 className="text-2xl font-bold text-white">Your Progress</h2>
                        </div>
                        <div className="flex-1 min-h-0">
                          <ProgressTracker quizResults={progress} />
                        </div>
                    </aside>
                </div>
            ) : (
                 <main className="flex flex-col flex-1 min-h-0 bg-gray-800/50 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                    <ImageEditor />
                </main>
            )}
        </div>
    );
};

export default App;
