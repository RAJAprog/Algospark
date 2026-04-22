// import React from 'react';

// const TerminalPanel = ({ output, isError, isLoading }) => {
//     if (isLoading) {
//         return (
//             <div className="h-full w-full p-4 bg-gray-900 text-gray-400 font-mono text-sm flex items-center justify-center">
//                 <span className="animate-pulse">Executing code on Judge0...</span>
//             </div>
//         );
//     }

//     return (
//         <div className={`h-full w-full p-4 font-mono text-sm overflow-y-auto ${isError ? 'bg-red-900/10 text-red-400' : 'bg-gray-900 text-gray-300'}`}>
//             <pre className="whitespace-pre-wrap">{output || 'Ready. Click "Run Code" to see output here.'}</pre>
//         </div>
//     );
// };

// export default TerminalPanel;  




import React from 'react';

const TerminalPanel = ({ output, isError, isLoading }) => {
    if (isLoading) {
        return (
            <div className="h-full w-full p-4 bg-gray-900 text-gray-400 font-mono text-sm flex items-center justify-center">
                <span className="animate-pulse">Executing code on Judge0...</span>
            </div>
        );
    }

    return (
        <div className={`h-full w-full p-4 font-mono text-sm overflow-y-auto ${isError ? 'bg-red-900/10 text-red-400' : 'bg-gray-900 text-gray-300'}`}>
            {/* ✅ Show welcome message when there's no output yet, same as EditorPage terminal */}
            {!output ? (
                <div className="text-gray-400">
                    <p>Welcome to V-CodeX Terminal!</p>
                    <p className="mt-1">{`>> `}<span className="animate-pulse">|</span></p>
                </div>
            ) : (
                <pre className="whitespace-pre-wrap">{output}</pre>
            )}
        </div>
    );
};

export default TerminalPanel;