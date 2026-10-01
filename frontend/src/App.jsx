import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import Resumes from "./pages/Resumes";
import ResumeAnalysis from "./pages/ResumeAnalysis";
import CareerRoadmap from "./pages/CareerRoadmap";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/resumes" element={<Resumes />} />

          <Route path="/resumes/upload" element={<ResumeUpload />} />

          <Route path="/resumes/:id/analysis" element={<ResumeAnalysis />} />

          <Route path="/career" element={<CareerRoadmap />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route path="/applications" element={<Applications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
