import type { ReactNode } from "react";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  description?: string;
  tone?: "accent" | "forest" | "gold" | "slate";
  loading?: boolean;
}

const StatCard = ({ title, value, icon, description, tone = "accent", loading }: StatCardProps) => {
  return (
    <Card padding="md" className={["stat-card", `stat-card--${tone}`].join(" ")}>
      <div className="stat-card__header">
        <div>
          <p className="stat-card__label">{title}</p>
          <div className="stat-card__value">{loading ? <span className="stat-card__skeleton" /> : value}</div>
        </div>
        {icon ? (
          <div className="stat-card__icon">
          {icon}
          </div>
        ) : null}
      </div>
      {description ? <p className="stat-card__description">{description}</p> : null}
    </Card>
  );
};

export default StatCard;
