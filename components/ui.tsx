import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 animate-shake' : 'text-slate-700'}`}>
          {label} {props.required && <span className={error ? "text-red-600" : "text-red-500"}>*</span>}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${
            error ? 'border-red-500 bg-red-50 animate-input-error' : 'border-slate-300'
          } ${className}`}
          {...props}
        />
        {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 animate-shake' : 'text-slate-700'}`}>
          {label} {props.required && <span className={error ? "text-red-600" : "text-red-500"}>*</span>}
        </label>
        <textarea
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${
            error ? 'border-red-500 bg-red-50 animate-input-error' : 'border-slate-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 animate-shake' : 'text-slate-700'}`}>
          {label} {props.required && <span className={error ? "text-red-600" : "text-red-500"}>*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 rounded-lg border bg-white appearance-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all ${
              error ? 'border-red-500 bg-red-50 animate-input-error' : 'border-slate-300'
            } ${className}`}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        {helperText && !error && <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>}
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
      </div>
    );
  }
);

interface RadioGroupProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
  error?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, selected, onChange, error, required }) => {
  return (
    <div className="w-full">
      <label className={`block text-sm font-medium mb-3 transition-colors ${error ? 'text-red-600 animate-shake' : 'text-slate-700'}`}>
        {label} {required && <span className={error ? "text-red-600" : "text-red-500"}>*</span>}
        <span className="ml-2 text-xs font-normal text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">Select one</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const hasErrorStyle = error && !isSelected;
          
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`text-sm px-4 py-3 rounded-full border transition-all duration-200 text-left flex items-center justify-between ${
                isSelected
                  ? 'bg-brand-100 border-2 border-brand-600 text-brand-900 shadow-md font-semibold'
                  : hasErrorStyle
                    ? 'bg-red-50 border-red-300 text-red-700 hover:border-red-400'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-slate-50'
              }`}
            >
              <span>{option}</span>
              {isSelected ? (
                <div className="bg-brand-600 rounded-full p-0.5 shadow-sm">
                   <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300"></div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};