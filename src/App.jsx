import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitForm from "./pages/SubmitForm";
import RequestsTable from "./pages/RequestsTable";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
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
    </BrowserRouter>
  );
}
