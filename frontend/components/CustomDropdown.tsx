import React, { useState } from 'react';

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ options, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`custom-dropdown ${disabled ? 'disabled' : ''}`}>
      <div
        className="custom-dropdown-selected"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {options.find(option => option.value === value)?.label}
      </div>
      {isOpen && (
        <div className="custom-dropdown-options">
          {options.map(option => (
            <div
              key={option.value}
              className="custom-dropdown-option"
              onClick={() => !disabled && handleOptionClick(option.value)}
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