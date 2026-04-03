import { Link, useLocation } from "react-router-dom";
import { PanelLeftClose } from "lucide-react";
import Button from "@/components/ui/Button";
import { sidebarConfig } from "./sidebarConfig";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const activePath =
    [...sidebarConfig]
      .sort((left, right) => right.path.length - left.path.length)
      .find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
      ?.path ?? "";

  return (
    <>
      <button
        type="button"
        className={["sidebar-backdrop", isOpen ? "is-visible" : ""].filter(Boolean).join(" ")}
        onClick={onClose}
        aria-label="Close sidebar"
      />
      <aside className={["app-sidebar", isOpen ? "is-open" : ""].filter(Boolean).join(" ")}>
        <div className="app-sidebar__panel">
          <div className="app-sidebar__brand">
            <div className="brand-mark" aria-hidden="true">
              D
            </div>
            <div className="brand-copy">
              <span>Designova</span>
              <p>Design management suite</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="button--icon sidebar-close"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <PanelLeftClose aria-hidden="true" />
            </Button>
          </div>

          <nav className="sidebar-nav" aria-label="Primary">
        {sidebarConfig.map((item) => {
          const isActive = activePath === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={["sidebar-link", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
              onClick={onClose}
            >
              <span className="sidebar-link__icon">
                <Icon size={18} strokeWidth={1.9} />
              </span>
              <span className="sidebar-link__copy">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </Link>
          );
        })}
          </nav>

          <div className="sidebar-footnote">
            Curate Designova projects, visuals, leads, and reviews from one calm workspace.
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
