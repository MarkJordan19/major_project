import React, { useId } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = "", id, children, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {hint ? <p className="form-hint">{hint}</p> : null}
        <select
          ref={ref}
          id={inputId}
          className={["form-control", "form-select", error ? "is-error" : "", className].filter(Boolean).join(" ")}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {children}
        </select>
        {error ? <p className="form-error">{error}</p> : null}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
