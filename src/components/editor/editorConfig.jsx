// This file exports a centralized configuration object for the Monaco Editor.
// By keeping the options here, we can ensure a consistent editor experience
// across the entire application and easily update it from one place.

export const editorOptions = {
  automaticLayout: true, // Ensures the editor resizes automatically
  selectOnLineNumbers: true, // Allows selecting a whole line by clicking the line number
  wordWrap: 'on', // Automatically wraps lines that exceed the viewport width
  minimap: {
    enabled: true, // Shows a high-level overview of the code on the side
  },
  fontSize: 14, // Sets the default font size for code
  fontFamily: 'Fira Code, monospace', // Suggests a modern coding font (user must have it installed)
  bracketPairColorization: {
    enabled: true, // Automatically colorizes matching brackets
  },
  tabSize: 2, // Sets the number of spaces for a tab character
  scrollBeyondLastLine: false, // Disables scrolling beyond the last line of code
  roundedSelection: false, // Uses rectangular selection instead of rounded
  lineNumbers: 'on', // Ensures line numbers are always visible
  // You can add many more options here as needed.
};