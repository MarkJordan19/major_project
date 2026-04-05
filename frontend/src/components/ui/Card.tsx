import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const Card: React.FC<CardProps> = ({ children, className = "", padding = "md" }) => {
  return (
    <section className={["card", padding !== "none" ? `card--${padding}` : "", className].filter(Boolean).join(" ")}>
      {children}
    </section>
  );
};

export default Card;
