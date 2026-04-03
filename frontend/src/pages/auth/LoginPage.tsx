import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, FolderKanban, Image as ImageIcon, MessageSquareText, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Loader from "@/components/ui/Loader";
import { useAuthContext } from "@/context/AuthContext";
import { AUTH_QUERY_KEY, useLogin } from "@/features/auth/hooks";
import type { User } from "@/features/auth/types";

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuthContext();
  const loginMutation = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      await loginMutation.mutateAsync({ email, password });
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      await queryClient.refetchQueries({ queryKey: ["auth"] });
      const user = queryClient.getQueryData<User | null>(AUTH_QUERY_KEY);
      navigate(user?.role === "admin" ? "/dashboard" : "/");
    } catch (error: any) {
      console.error("Login failed", error);
      setErrorMessage(error?.response?.data?.message || "Unable to sign in. Check your credentials and try again.");
    }
  };

  if (authLoading) {
    return (
      <div className="login-page login-page--loading">
        <Loader label="Restoring your studio workspace..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/dashboard" : "/"} replace />;
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-showcase">
          <div className="login-showcase__badge">
            <Sparkles size={16} />
            Designova Admin
          </div>
          <h1 className="login-showcase__title">Run Designova from one composed, client-ready workspace.</h1>
          <p className="login-showcase__description">
            Manage projects, rooms, imagery, testimonials, and fresh enquiries without jumping between disconnected tools.
          </p>

          <div className="login-showcase__metrics">
            <div className="showcase-metric">
              <span>Projects</span>
              <strong>Portfolio-ready</strong>
            </div>
            <div className="showcase-metric">
              <span>Rooms & imagery</span>
              <strong>Visually organized</strong>
            </div>
            <div className="showcase-metric">
              <span>Leads</span>
              <strong>Easy follow-up</strong>
            </div>
          </div>

          <div className="login-showcase__cards">
            <div className="showcase-card">
              <FolderKanban size={18} />
              <div>
                <strong>Project pipeline</strong>
                <p>Shape a clean, searchable portfolio that your team can trust.</p>
              </div>
            </div>
            <div className="showcase-card">
              <ImageIcon size={18} />
              <div>
                <strong>Visual library</strong>
                <p>Keep reference imagery tied to the right projects and rooms.</p>
              </div>
            </div>
            <div className="showcase-card">
              <MessageSquareText size={18} />
              <div>
                <strong>Lead inbox</strong>
                <p>Respond faster to new enquiries and keep momentum high.</p>
              </div>
            </div>
          </div>
        </section>

        <Card padding="lg" className="login-card">
          <div className="login-card__intro">
            <p className="login-card__eyebrow">Welcome back</p>
            <h2 className="login-card__title">Sign in to the Designova dashboard</h2>
            <p className="login-card__description">
              Use your admin email and password to continue managing the Designova portfolio.
            </p>
          </div>

          {errorMessage ? <div className="form-banner form-banner--error">{errorMessage}</div> : null}

          <form onSubmit={handleLogin} className="form-stack">
            <Input
              label="Email address"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Button type="submit" isLoading={loginMutation.isPending} className="button--block">
              Sign in
              <ArrowRight size={16} />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
