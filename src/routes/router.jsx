import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";

import Home from "../pages/home/Home";
import Services from "../pages/services/Services";
import ServiceDetails from "../pages/services/ServiceDetails";
import CoverageMapPage from "../pages/map/CoverageMapPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ErrorPage from "../pages/error/ErrorPage";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Booking from "../pages/booking/Booking";
import Payment from "../pages/payment/Payment";

import UserDashboard from "../dashboards/user/UserDashboard";
import AdminDashboard from "../dashboards/admin/AdminDashboard";
import DecoratorDashboard from "../dashboards/decorator/DecoratorDashboard";

import RequireAuth from "../auth/RequireAuth";
import RequireRole from "../auth/RequireRole";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "services/:id", Component: ServiceDetails },
      { path: "coverage", Component: CoverageMapPage },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "booking", Component: Booking },
      { path: "payment", Component: Payment },

      {
        Component: AuthLayout, 
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    Component: () => (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "user",
        Component: () => (
          <RequireRole allow={["user"]}>
            <UserDashboard />
          </RequireRole>
        ),
      },
      {
        path: "admin",
        Component: () => (
          <RequireRole allow={["admin"]}>
            <AdminDashboard />
          </RequireRole>
        ),
      },
      {
        path: "decorator",
        Component: () => (
          <RequireRole allow={["decorator"]}>
            <DecoratorDashboard />
          </RequireRole>
        ),
      },
    ],
  },
]);
