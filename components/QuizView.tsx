
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
    questions: QuizQuestion[];
    onQuizComplete: (score: number, total: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onQuizComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedAnswer(option);
        setIsAnswered(true);
        if (option === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            onQuizComplete(score, questions.length);
        }
    };

    const getButtonClass = (option: string) => {
        if (!isAnswered) {
            return "bg-gray-700 hover:bg-gray-600";
        }
        if (option === currentQuestion.correctAnswer) {
            return "bg-green-600";
        }
        if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
            return "bg-red-600";
        }
        return "bg-gray-700 opacity-50";
    };

    return (
        <div className="flex flex-col h-full p-6 text-white bg-gray-800">
            <div className="mb-4">
                <p className="text-sm text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-8 text-center">{currentQuestion.question}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={isAnswered}
                            className={`p-4 rounded-lg text-left transition-all duration-300 ${getButtonClass(option)}`}
                        >
                            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                    ))}
                </div>
            </div>
            {isAnswered && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleNextQuestion}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors"
                    >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizView;
