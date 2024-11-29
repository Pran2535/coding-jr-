'use client';

import { useState, useRef, useEffect } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { php } from '@codemirror/lang-php';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { autocompletion } from '@codemirror/autocomplete';

const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: '#f5f5f5',
    color: '#000',
  },
  '.cm-content': {
    caretColor: '#000',
  },
  '.cm-line': {
    padding: '2px 0',
  },
});

const languageExtensions: Record<string, any> = {
  python: python(),
  javascript: javascript(),
  cpp: cpp(),
  rust: rust(),
  go: go(),
  php: php(),
};

interface CodeMirrorEditorProps {
  language: string;
  onOutputChange?: (output: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  language,
  onOutputChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [code, setCode] = useState('');
  const [view, setView] = useState<EditorView | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Initialize the client-side effect
  useEffect(() => {
    setIsClient(true);
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  // Effect to set up the CodeMirror editor
  useEffect(() => {
    if (!isClient || !editorRef.current) return;

    const selectedLanguage = languageExtensions[language] || javascript();
    const selectedTheme = isDarkMode ? oneDark : lightTheme;

    const newView = new EditorView({
      parent: editorRef.current,
      state: EditorState.create({
        extensions: [
          selectedLanguage,
          selectedTheme,
          autocompletion(),
          keymap.of([]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newCode = update.state.doc.toString();
              setCode(newCode);
            }
          }),
        ],
      }),
    });

    setView(newView);

    return () => {
      newView.destroy();
    };
  }, [language, isDarkMode, isClient]);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (view && editorRef.current) {
      const selectedTheme = newMode ? oneDark : lightTheme;
      const selectedLanguage = languageExtensions[language] || javascript();

      const newState = EditorState.create({
        extensions: [
          selectedLanguage,
          selectedTheme,
          autocompletion(),
          keymap.of([]),
        ],
      });

      view.setState(newState);
    }
  };

  // Run the code
  const runCode = () => {
    try {
      console.clear();
      switch (language) {
        case 'javascript':
          const result = new Function(`return (${code})`)();
          const resultString = String(result);
          console.log(result);
          onOutputChange?.(resultString);
          break;
        case 'python':
          onOutputChange?.('Python execution requires a backend service');
          break;
        default:
          onOutputChange?.(`Execution for ${language} not supported`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error during code execution:', error);
      onOutputChange?.(errorMessage);
    }
  };

  // Clear the code in the editor
  const clearCode = () => {
    if (view) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: '' },
      });
      setCode('');
      onOutputChange?.('');
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Button Bar */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleTheme}
          style={{
            backgroundColor: isDarkMode ? 'white' : 'black',
            color: isDarkMode ? 'black' : 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Toggle Theme
        </button>

        <button
          onClick={runCode}
          style={{
            backgroundColor: 'green',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Run
        </button>

        <button
          onClick={clearCode}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            border: 'none',
          }}
        >
          Clear
        </button>
      </div>

      {/* Editor View */}
      <div
        ref={editorRef}
        style={{
          height: 'calc(100vh - 50px)',
          width: '100%',
          border: '1px solid #ccc',
          marginTop: '50px',
          backgroundColor: isDarkMode ? '#181818' : '#f5f5f5',
          color: isDarkMode ? '#fff' : '#000',
          overflowY: 'auto',
          padding: '10px',
          borderRadius: '5px',
        }}
      />
    </div>
  );
};

export default CodeMirrorEditor;
