import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {hint ? <p className="form-hint">{hint}</p> : null}
        <input
          ref={ref}
          id={inputId}
          className={["form-control", "form-input", error ? "is-error" : "", className].filter(Boolean).join(" ")}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error ? <p className="form-error">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
