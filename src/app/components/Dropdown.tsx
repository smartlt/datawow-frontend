"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  id: string;
  name: string;
  // Add optional icon or additional properties for more flexibility
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedOption: string | null;
  placeholder?: string;
  onChange: (option: DropdownOption | null) => void;
  disabled?: boolean;
  allowDeselect?: boolean;
  className?: string;
  showAllOption?: boolean;
  allOptionText?: string;
  maxHeight?: string;
  labelKey?: string;
  valueKey?: string;
}

export default function Dropdown({
  options,
  selectedOption,
  placeholder = "Select an option",
  onChange,
  disabled = false,
  allowDeselect = false,
  className = "",
  showAllOption = false,
  allOptionText = "All",
  maxHeight = "max-h-60",
  labelKey = "name",
  valueKey = "id",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find selected option name
  const selectedOptionObj = options.find((opt) => opt.id === selectedOption);
  const displayText = selectedOptionObj ? selectedOptionObj.name : placeholder;

  // Handle option selection
  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) {
      return;
    }

    if (allowDeselect && selectedOption === option.id) {
      onChange(null);
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  // Handle "All" option or reset selection
  const handleReset = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between p-2 pl-4 rounded-md border border-none w-full ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">{displayText}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ml-2 text-black transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden ${maxHeight} overflow-y-scroll scrollbar-hide`}
        >
          <div className="py-1" role="listbox">
            {(showAllOption || allowDeselect) && (
              <button
                type="button"
                onClick={handleReset}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                role="option"
                aria-selected={selectedOption === null}
              >
                {allOptionText}
              </button>
            )}

            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-2 text-left flex justify-between items-center ${
                  option.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : selectedOption === option.id
                    ? "bg-main-green-100"
                    : "hover:bg-gray-100"
                }`}
                role="option"
                aria-selected={selectedOption === option.id}
                disabled={option.disabled}
              >
                <div className="flex items-center">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.name}</span>
                </div>
                {selectedOption === option.id && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
