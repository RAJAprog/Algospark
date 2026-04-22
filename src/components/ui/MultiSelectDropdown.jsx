import React, { useState, useRef, useEffect } from 'react';

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder = "Select Colleges" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value) => {
        const newSelection = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        onChange(newSelection);
    };

    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDisplayLabel = () => {
        if (selectedValues.length === 0) return placeholder;
        if (selectedValues.length === 1) {
            return options.find(o => o.id === selectedValues[0])?.name || placeholder;
        }
        return `${selectedValues.length} Colleges Selected`;
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2.5 px-4 text-left text-sm text-white flex justify-between items-center hover:border-gray-500 transition-all focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <span className={selectedValues.length === 0 ? "text-gray-500" : "text-white font-medium"}>
                    {getDisplayLabel()}
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
                    {/* Search Bar */}
                    <div className="p-2 border-b border-gray-700">
                        <input
                            type="text"
                            placeholder="Search colleges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-md py-1.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => toggleOption(option.id)}
                                    className="flex items-center px-4 py-2.5 hover:bg-gray-700 cursor-pointer transition-colors group"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                        selectedValues.includes(option.id) 
                                        ? 'bg-blue-600 border-blue-600' 
                                        : 'border-gray-500 group-hover:border-blue-400'
                                    }`}>
                                        {selectedValues.includes(option.id) && (
                                            <span className="text-white text-[10px]">✓</span>
                                        )}
                                    </div>
                                    <span className={`ml-3 text-sm ${
                                        selectedValues.includes(option.id) ? 'text-white font-bold' : 'text-gray-300'
                                    }`}>
                                        {option.name}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-xs text-gray-500 italic">
                                No colleges found.
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    {selectedValues.length > 0 && (
                        <div className="p-2 bg-gray-900 border-t border-gray-700 flex justify-between items-center">
                            <button
                                type="button"
                                onClick={() => onChange([])}
                                className="text-[10px] text-red-400 hover:text-red-300 uppercase font-bold px-2 py-1"
                            >
                                Clear All
                            </button>
                            <span className="text-[10px] text-gray-500 font-mono">
                                {selectedValues.length} selected
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;