import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// 🔁 Lazy imports
const SubmitForm = lazy(() => import("./pages/SubmitForm"));
const RequestsTable = lazy(() => import("./pages/RequestsTable"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<div className="text-center mt-10">Загрузка...</div>}>
        <Routes>
          <Route path="/submit" element={<SubmitForm />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <RequestsTable />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
