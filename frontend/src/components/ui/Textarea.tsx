import React, { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="form-field">
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
        {hint ? <p className="form-hint">{hint}</p> : null}
        <textarea
          ref={ref}
          id={inputId}
          className={["form-control", "form-textarea", error ? "is-error" : "", className].filter(Boolean).join(" ")}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error ? <p className="form-error">{error}</p> : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
