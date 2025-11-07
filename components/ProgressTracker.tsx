
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QuizResult } from '../types';

interface ProgressTrackerProps {
    quizResults: QuizResult[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ quizResults }) => {
    const data = quizResults.map((result, index) => ({
        name: `${result.topic.substring(0, 10)}... #${index + 1}`,
        score: result.score,
        date: result.date,
    }));

    return (
        <div className="w-full h-full">
            {quizResults.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 10,
                            left: -20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#A0AEC0', fontSize: 12 }} unit="%" domain={[0, 100]} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#2D3748',
                                border: '1px solid #4A5568',
                                color: '#E2E8F0'
                            }}
                            labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ color: '#A0AEC0', fontSize: 14 }} />
                        <Bar dataKey="score" fill="#4299E1" name="Quiz Score (%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                        <p className="text-lg font-semibold">No progress yet.</p>
                        <p>Complete a quiz to see your progress here!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressTracker;
