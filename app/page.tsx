'use client'
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import CodeMirrorEditor from "./components/codeeditor";

const Home = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("Run your code here...");

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      {/* Sidebar */}
      <Sidebar 
        selectedLanguage={selectedLanguage} 
        onLanguageChange={handleLanguageChange} 
      />
      
      {/* Main Content Area */}
      <div className="ml-20 flex-1 flex flex-col lg:flex-row h-screen">
        {/* Code Editor */}
        <div className="flex-1 p-4 pt-4">
          <CodeMirrorEditor 
            language={selectedLanguage} 
            onOutputChange={(newOutput) => setOutput(newOutput)}
          />
        </div>
        
        {/* Output Terminal */}
        <div className="w-full lg:w-1/3 bg-gray-800 text-white p-4">
          <h2 className="text-xl mb-4">Output Terminal</h2>
          <div className="bg-gray-900 h-full p-2 rounded-md overflow-auto">
            <pre>{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;