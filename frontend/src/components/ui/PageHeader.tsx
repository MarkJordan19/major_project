import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  meta?: React.ReactNode;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, eyebrow, meta, children }) => {
  return (
    <div className="page-header">
      <div className="page-header__copy">
        {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
        <div className="page-header__title-row">
          <div>
            <h2 className="page-header__title">{title}</h2>
            {description ? <p className="page-header__description">{description}</p> : null}
          </div>
          {meta ? <div className="page-header__meta">{meta}</div> : null}
        </div>
      </div>
      {children ? (
        <div className="page-header__actions">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default PageHeader;
