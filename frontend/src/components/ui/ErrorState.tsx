import Button from "./Button";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="error-state">
      <div className="error-state__icon">
        <AlertCircle aria-hidden="true" />
      </div>
      <h3 className="error-state__title">Something went wrong</h3>
      <p className="error-state__description">{message}</p>
      {onRetry ? (
        <Button
          variant="secondary"
          onClick={onRetry}
          className="error-state__action"
        >
          Try Again
        </Button>
      ) : null}
    </div>
  );
};

export default ErrorState;
