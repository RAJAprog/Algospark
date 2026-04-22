import React from 'react';
import Editor from '@monaco-editor/react';
import { editorOptions } from './editorConfig'; // Using our centralized options

const CodeEditor = ({ language, fileContent, onCodeChange }) => {
  // This component is now a pure "controlled component".
  // It receives the content (value) and a function to call when the content changes (onChange).
  // This is the most stable way to integrate Monaco with React.

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        language={language || 'python'}
        value={fileContent}
        theme="vs-dark"
        options={editorOptions}
        onChange={onCodeChange}
        loading={<div className="text-white">Loading Editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;