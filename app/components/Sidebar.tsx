'use client';
import  { useState } from "react";
import { 
  Code, FileCode, PenTool, Terminal, Layers, Codepen, Box, Globe, Menu 
} from "lucide-react";

const languages = [
  { id: "python", name: "Python", icon: <Code size={13} /> },
  { id: "javascript", name: "JavaScript", icon: <FileCode size={13} /> },
  { id: "typescript", name: "TypeScript", icon: <PenTool size={13} /> },
  { id: "go", name: "Go", icon: <Terminal size={13} /> },
  { id: "php", name: "PHP", icon: <Layers size={13} /> },
  { id: "rust", name: "Rust", icon: <Codepen size={13} /> },
  { id: "cpp", name: "C++", icon: <Box size={13} /> },
  { id: "java", name: "Java", icon: <Globe size={13} /> },
];

const Sidebar = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderLanguageButton = (lang) => {
    const isSelected = selectedLanguage === lang.id;
    return (
      <button
        key={lang.id}
        onClick={() => onLanguageChange(lang.id)}
        className={`p-3 rounded-lg transition-all duration-300 ease-in-out flex flex-col items-center justify-center 
          ${isSelected ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        title={lang.name}
      >
        {lang.icon}
        <span className={`mt-2 text-xs font-medium ${isOpen ? "block" : "hidden"} md:block`}>
          {lang.name}
        </span>
      </button>
    );
  };

  return (
    <div
      className={`fixed md:top-0 md:left-0 bottom-0 md:h-full transition-all duration-300 z-50
        ${isOpen ? "w-48 md:w-24" : "w-16"} 
        bg-gray-100 dark:bg-gray-900 shadow-lg flex flex-col items-center py-4 overflow-y-auto`}
    >
      {/* Toggle Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 md:hidden p-2 bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none"
        title="Toggle Sidebar"
      >
        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Sidebar Content */}
      <div className="flex flex-col w-full items-center md:space-y-6 space-y-4">
        {languages.map(renderLanguageButton)}
      </div>
    </div>
  );
};

export default Sidebar;
