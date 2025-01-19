import React, { useState } from 'react';

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <div className="custom-dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
        {options.find(option => option.value === value)?.label}
      </div>
      {isOpen && (
        <div className="custom-dropdown-options">
          {options.map(option => (
            <div
              key={option.value}
              className="custom-dropdown-option"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;