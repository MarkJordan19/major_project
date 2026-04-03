import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EnquiriesPage from "@/pages/enquiries/EnquiriesPage";
import ImagesPage from "@/pages/images/ImagesPage";
import LandingPage from "@/pages/public/LandingPageDesignova";
import PublicEnquiryPage from "@/pages/public/PublicEnquiryPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import RoomsPage from "@/pages/rooms/RoomsPage";
import TestimonialsPage from "@/pages/testimonials/TestimonialsPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/images" element={<ImagesPage />} />
          <Route path="/enquiry" element={<PublicEnquiryPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/enquiries" element={<EnquiriesPage />} />
            <Route path="/dashboard/testimonials" element={<TestimonialsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
