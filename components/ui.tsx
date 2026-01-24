import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  isValid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, isValid, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const ariaDescribedBy = [error ? errorId : undefined, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 dark:text-red-400 animate-shake' : 'text-slate-700 dark:text-slate-300'}`}>
          {label} {props.required && <span className={error ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"} aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={`w-full px-4 py-3 rounded-lg border text-base outline-none transition-all dark:bg-slate-900 ${
              error 
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 animate-input-error pr-10 dark:border-red-500 dark:bg-red-900/10 dark:text-red-100 dark:placeholder-red-400' 
                : isValid
                  ? 'border-green-500 bg-green-50 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-10 dark:border-green-500 dark:bg-green-900/10 dark:text-green-100'
                  : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:border-slate-700 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500'
            } ${className}`}
            {...props}
          />
          {isValid && !error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none animate-fade-in">
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none animate-fade-in">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {helperText && !error && <p id={helperId} className={`mt-1.5 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>{helperText}</p>}
        {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  isValid?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, isValid, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const ariaDescribedBy = [error ? errorId : undefined, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 dark:text-red-400 animate-shake' : 'text-slate-700 dark:text-slate-300'}`}>
          {label} {props.required && <span className={error ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"} aria-hidden="true">*</span>}
        </label>
        <div className="relative">
            <textarea
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={`w-full px-4 py-3 rounded-lg border text-base outline-none transition-all dark:bg-slate-900 ${
                error 
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 animate-input-error dark:border-red-500 dark:bg-red-900/10 dark:text-red-100 dark:placeholder-red-400' 
                : isValid
                    ? 'border-green-500 bg-green-50 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-green-500 dark:bg-green-900/10 dark:text-green-100'
                    : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:border-slate-700 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500'
            } ${className}`}
            {...props}
            />
             {isValid && !error && (
                <div className="absolute top-3 right-3 pointer-events-none animate-fade-in">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                </div>
            )}
        </div>
        {helperText && !error && <p id={helperId} className={`mt-1.5 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>{helperText}</p>}
        {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
  isValid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, isValid, className = '', ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = inputId ? `${inputId}-error` : undefined;
    const helperId = inputId ? `${inputId}-helper` : undefined;
    const ariaDescribedBy = [error ? errorId : undefined, helperText ? helperId : undefined].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <label htmlFor={inputId} className={`block text-sm font-medium mb-2 transition-colors ${error ? 'text-red-600 dark:text-red-400 animate-shake' : 'text-slate-700 dark:text-slate-300'}`}>
          {label} {props.required && <span className={error ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"} aria-hidden="true">*</span>}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            className={`w-full px-4 py-3 rounded-lg border text-base appearance-none outline-none transition-all dark:bg-slate-900 ${
              error 
                ? 'border-red-500 bg-red-50 text-red-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 animate-input-error dark:border-red-500 dark:bg-red-900/10 dark:text-red-100' 
                : isValid
                    ? 'border-green-500 bg-green-50 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:border-green-500 dark:bg-green-900/10 dark:text-green-100'
                    : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:border-slate-700 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500'
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
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
             {isValid && !error && (
                <svg className="w-5 h-5 text-green-500 mr-2 animate-fade-in" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )}
            <svg className={`w-4 h-4 ${error ? 'text-red-500' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        {helperText && !error && <p id={helperId} className={`mt-1.5 text-xs ${isValid ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>{helperText}</p>}
        {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      </div>
    );
  }
);

interface RadioGroupProps {
  id?: string;
  label: string;
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
  error?: string;
  required?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ id, label, options, selected, onChange, error, required }) => {
  const groupId = id || `radio-group-${React.useId ? React.useId() : Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${groupId}-label`;
  const errorId = `${groupId}-error`;

  return (
    <div className="w-full" role="radiogroup" aria-labelledby={labelId} aria-describedby={error ? errorId : undefined}>
      <label id={labelId} className={`block text-sm font-medium mb-3 transition-colors ${error ? 'text-red-600 dark:text-red-400 animate-shake' : 'text-slate-700 dark:text-slate-300'}`}>
        {label} {required && <span className={error ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"} aria-hidden="true">*</span>}
        <span className="ml-2 text-xs font-normal text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100 dark:border-brand-800">Select one</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const hasErrorStyle = error && !isSelected;
          
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option)}
              className={`text-sm px-4 py-3 rounded-full border transition-all duration-200 text-left flex items-center justify-between ${
                isSelected
                  ? 'bg-brand-100 dark:bg-brand-900/50 border-2 border-brand-600 dark:border-brand-500 text-brand-900 dark:text-brand-100 shadow-md font-semibold'
                  : hasErrorStyle
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:border-red-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>{option}</span>
              {isSelected ? (
                <div className="bg-brand-600 dark:bg-brand-500 rounded-full p-0.5 shadow-sm">
                   <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-500"></div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
};

interface CheckboxGroupProps {
  id?: string;
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  error?: string;
  required?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ id, label, options, selected, onChange, error, required }) => {
  const groupId = id || `checkbox-group-${React.useId ? React.useId() : Math.random().toString(36).substr(2, 9)}`;
  const labelId = `${groupId}-label`;
  const errorId = `${groupId}-error`;

  const handleToggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="w-full" role="group" aria-labelledby={labelId} aria-describedby={error ? errorId : undefined}>
      <label id={labelId} className={`block text-sm font-medium mb-3 transition-colors ${error ? 'text-red-600 dark:text-red-400 animate-shake' : 'text-slate-700 dark:text-slate-300'}`}>
        {label} {required && <span className={error ? "text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-400"} aria-hidden="true">*</span>}
        <span className="ml-2 text-xs font-normal text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100 dark:border-brand-800">Select multiple</span>
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          const hasErrorStyle = error && !isSelected && selected.length === 0;
          
          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => handleToggle(option)}
              className={`text-sm px-4 py-3 rounded-full border transition-all duration-200 text-left flex items-center justify-between ${
                isSelected
                  ? 'bg-brand-50 dark:bg-brand-900/50 border-brand-500 text-brand-900 dark:text-brand-100 shadow-sm font-semibold'
                  : hasErrorStyle
                    ? 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:border-red-400'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <span>{option}</span>
              {isSelected ? (
                <div className="bg-brand-500 rounded-md p-0.5">
                   <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              ) : (
                <div className="w-4 h-4 rounded-md border border-slate-300 dark:border-slate-500"></div>
              )}
            </button>
          );
        })}
      </div>
      {error && <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
};