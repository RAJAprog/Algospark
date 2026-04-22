// src/components/exam/student/QuestionViewer.jsx

import React from 'react';
import DOMPurify from 'dompurify';

// This component is now much simpler. It only displays question content.
const QuestionViewer = ({ question, currentAnswer, onAnswerChange }) => {
    if (!question) {
        return <div>Loading question...</div>;
    }

    // Sanitize the HTML content from the question description
    const sanitizedDescription = DOMPurify.sanitize(question.description);

    return (
        <div className="p-6 overflow-y-auto bg-gray-800 text-white h-full">
            <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
            
            {/* Render the problem description from sanitized HTML */}
            <div 
                className="prose prose-invert max-w-none mb-8" // TailwindCSS prose styles the HTML
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }} 
            />

            {/* If it's an MCQ, render the options right here */}
            {question.type === 'MCQ' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-300">Select an option:</h3>
                    {question.options.map((option, index) => (
                        <label 
                            key={index} 
                            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                currentAnswer === option 
                                ? 'bg-blue-600 border-blue-500' 
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }`}
                        >
                            <input
                                type="radio"
                                name={question.id}
                                value={option}
                                checked={currentAnswer === option}
                                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                                className="hidden" // Hide the default radio button for custom styling
                            />
                            <span className="ml-3 text-white">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuestionViewer;