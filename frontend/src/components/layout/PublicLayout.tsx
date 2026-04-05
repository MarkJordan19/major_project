import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowRight, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/context/AuthContext";

const publicNavItems = [
  { label: "Projects", path: "/projects" },
  { label: "Rooms", path: "/rooms" },
  { label: "Images", path: "/images" },
  { label: "Enquiry", path: "/enquiry" },
];

const PublicLayout = () => {
  const { isAdmin, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="public-shell">
      <header className="public-header">
        <div className="public-header__inner">
          <Link to="/" className="public-brand">
            <span className="public-brand__mark">D</span>
            <span className="public-brand__copy">
              <strong>Designova</strong>
              <small>Refined interior experiences for modern spaces</small>
            </span>
          </Link>

          <nav className="public-nav" aria-label="Main navigation">
            {publicNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => ["public-nav__link", isActive ? "is-active" : ""].filter(Boolean).join(" ")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="public-header__actions">
            {isAdmin ? (
              <>
                <Link to="/dashboard" className="button button--primary button--md">
                  Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login" className="button button--primary button--md">
                Login
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer__inner">
          <div className="public-footer__column">
            <h3>Designova</h3>
            <p>Designova creates thoughtful residential, commercial, and office interiors with a calm, polished visual language.</p>
          </div>
          <div className="public-footer__column">
            <h4>Contact</h4>
            <p>Phone: +00 0000 000 000</p>
            <p>Email: hello@designova.com</p>
            <p>Address: Designova Studio, City, Country</p>
          </div>
          <div className="public-footer__column">
            <h4>Hours</h4>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: By appointment</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
