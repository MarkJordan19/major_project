import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const EmptyState = ({ title, description, children }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <Inbox aria-hidden="true" />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {children ? <div className="empty-state__actions">{children}</div> : null}
    </div>
  );
};

export default EmptyState;
