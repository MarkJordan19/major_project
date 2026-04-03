import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#271d18",
            color: "#f8f2eb",
            borderRadius: "18px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 18px 40px rgba(39, 29, 24, 0.28)",
          },
        }}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-shell__content">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="app-main">
          <div className="app-main__inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
