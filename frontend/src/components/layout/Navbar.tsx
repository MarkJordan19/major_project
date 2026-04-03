import { Menu, LogOut } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/ui/Button";
import { sidebarConfig } from "./sidebarConfig";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { logout, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const activeNavItem =
    [...sidebarConfig]
      .sort((left, right) => right.path.length - left.path.length)
      .find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)) ?? sidebarConfig[0];
  const Icon = activeNavItem.icon;
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__panel">
        <div className="topbar__heading">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="button--icon topbar__menu"
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" />
          </Button>
          <div className="topbar__icon">
            <Icon size={20} strokeWidth={1.9} />
          </div>
          <div>
            <p className="topbar__eyebrow">Designova control center</p>
            <h1 className="topbar__title">{activeNavItem.label}</h1>
            <p className="topbar__description">{activeNavItem.description}</p>
          </div>
        </div>

        <div className="topbar__actions">
          <div className="topbar__meta">
            <span>{todayLabel}</span>
            <small>{user?.role === "admin" ? "Administrator access" : "Studio member"}</small>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
