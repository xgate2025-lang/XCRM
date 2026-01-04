import React from 'react';

interface SentenceInputProps {
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
  className?: string;
  width?: string;
  suffix?: string;
  prefix?: string;
  disabled?: boolean;
}

const SentenceInput: React.FC<SentenceInputProps> = ({
  value,
  onChange,
  placeholder = "...",
  type = 'text',
  className = "",
  width = "w-16",
  suffix,
  prefix,
  disabled = false
}) => {
  return (
    <div className={`inline-flex items-baseline border-b-2 transition-colors mx-1 relative ${disabled ? 'border-slate-100 opacity-60 cursor-not-allowed' : 'border-slate-200 focus-within:border-primary-500'} ${className}`}>
      {prefix && <span className={`font-bold mr-1 ${disabled ? 'text-slate-300' : 'text-slate-400'}`}>{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => !disabled && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-transparent text-center font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none py-0.5 ${width} ${disabled ? 'cursor-not-allowed text-slate-500' : ''}`}
      />
      {suffix && <span className={`font-medium ml-1 text-sm ${disabled ? 'text-slate-300' : 'text-slate-500'}`}>{suffix}</span>}
    </div>
  );
};

export default SentenceInput;