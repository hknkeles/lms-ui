"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { createPortal } from "react-dom";

interface Option {
  value: string;
  label: string;
}

interface ModernSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export default function ModernSelect({ options, value, onChange, placeholder, className = "" }: ModernSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find(opt => opt.value === value) || null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) || null);
  }, [value, options]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-white/30 dark:border-gray-600/30 rounded-2xl focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all duration-300 bg-white/20 dark:bg-gray-700/20 backdrop-blur-sm text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-white/30 dark:hover:bg-gray-700/30 flex items-center justify-between"
      >
        <span className={selectedOption ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {isOpen && createPortal(
        <div 
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-xl z-[99999] overflow-hidden"
          style={{
            top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
            width: dropdownRef.current ? dropdownRef.current.offsetWidth : 'auto',
            minWidth: dropdownRef.current ? dropdownRef.current.offsetWidth : 'auto'
          }}
        >
          <div className="py-2 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 flex items-center justify-between ${
                  option.value === value
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                )}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
