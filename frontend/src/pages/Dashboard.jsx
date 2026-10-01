import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  LogOut,
  Map,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        api.get("/applications"),
        api.get("/jobs"),
      ]);

      if (results[0].status === "fulfilled") {
        setApplications(results[0].value.data || []);
      }

      if (results[1].status === "fulfilled") {
        setJobs(results[1].value.data || []);
      }

      if (
        results[0].status === "rejected" &&
        results[1].status === "rejected"
      ) {
        setError("Some dashboard data could not be loaded.");
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Some dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =========================
     USER NAME
  ========================= */

  const firstName = useMemo(() => {
    const name = user?.name || user?.fullName || user?.username || "there";

    return name.trim().split(" ")[0];
  }, [user]);

  /* =========================
     DASHBOARD STATS
  ========================= */

  const stats = useMemo(() => {
    return {
      totalApplications: applications.length,

      interviews: applications.filter((item) => item.status === "INTERVIEW")
        .length,

      offers: applications.filter((item) => item.status === "OFFER").length,

      jobs: jobs.length,
    };
  }, [applications, jobs]);

  /* =========================
     CAREER PROGRESS
  ========================= */

  const completedSteps = [Boolean(user?.name)].filter(Boolean).length;

  const careerProgress = Math.min(25 + completedSteps * 15, 100);

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="dashboard-page">
      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">C</div>

          <span>
            Career<strong>AI</strong>
          </span>
        </div>

        <div className="dashboard-header-right">
          <div className="dashboard-user">
            <div className="dashboard-avatar">
              <UserRound size={15} />
            </div>

            <span>{firstName}</span>
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* =========================
              HERO
          ========================= */}

          <section className="dashboard-welcome">
            <div>
              <span className="dashboard-eyebrow">
                YOUR CAREER COMMAND CENTER
              </span>

              <h1>
                Good to see you, <span>{firstName}.</span>
              </h1>

              <p>
                Build your career with a clear roadmap, smarter job matching,
                and AI-powered guidance.
              </p>
            </div>

            <div className="dashboard-hero-icon">
              <Sparkles size={28} />
            </div>
          </section>

          {/* =========================
              QUICK ACTIONS
          ========================= */}

          <section className="dashboard-actions">
            {/* CAREER ROADMAP */}

            <button
              className="dashboard-action-card orange"
              onClick={() => navigate("/career")}
            >
              <div className="dashboard-action-icon">
                <Map size={20} />
              </div>

              <div className="dashboard-action-content">
                <strong>Career Roadmap</strong>

                <span>Build your career path</span>
              </div>

              <ArrowRight size={16} />
            </button>

            {/* FIND JOBS */}

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/jobs")}
            >
              <div className="dashboard-action-icon">
                <BriefcaseBusiness size={20} />
              </div>

              <div className="dashboard-action-content">
                <strong>Find Jobs</strong>

                <span>Discover matching roles</span>
              </div>

              <ArrowRight size={16} />
            </button>

            {/* MANAGE RESUME */}

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/resumes")}
            >
              <div className="dashboard-action-icon">
                <FileText size={20} />
              </div>

              <div className="dashboard-action-content">
                <strong>Manage Resume</strong>

                <span>Upload and analyze your resume</span>
              </div>

              <ArrowRight size={16} />
            </button>

            {/* APPLICATIONS */}

            <button
              className="dashboard-action-card"
              onClick={() => navigate("/applications")}
            >
              <div className="dashboard-action-icon">
                <Target size={20} />
              </div>

              <div className="dashboard-action-content">
                <strong>Applications</strong>

                <span>Track your applications</span>
              </div>

              <ArrowRight size={16} />
            </button>
          </section>

          {/* =========================
              ERROR
          ========================= */}

          {error && (
            <div className="dashboard-error">
              <span>{error}</span>

              <button onClick={loadDashboard}>
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          {/* =========================
              DASHBOARD GRID
          ========================= */}

          <section className="dashboard-grid">
            {/* CAREER PROGRESS */}

            <div className="dashboard-panel progress-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-label">CAREER PROGRESS</span>

                  <h2>Your journey</h2>
                </div>

                <TrendingUp size={19} />
              </div>

              <div className="progress-content">
                <div
                  className="progress-circle"
                  style={{
                    "--progress": `${careerProgress * 3.6}deg`,
                  }}
                >
                  <div>
                    <strong>{careerProgress}%</strong>

                    <span>Complete</span>
                  </div>
                </div>

                <div className="progress-info">
                  <p>
                    Keep completing your profile and career activities to move
                    forward.
                  </p>

                  <div className="progress-bar">
                    <span
                      style={{
                        width: `${careerProgress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* APPLICATIONS */}

            <div className="dashboard-panel">
              <div className="panel-header">
                <div>
                  <span className="panel-label">APPLICATION TRACKER</span>

                  <h2>Your applications</h2>
                </div>

                <button
                  className="panel-link"
                  onClick={() => navigate("/applications")}
                >
                  View all
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="application-summary">
                <div>
                  <strong>{stats.totalApplications}</strong>

                  <span>Applied</span>
                </div>

                <div>
                  <strong>{stats.interviews}</strong>

                  <span>Interviews</span>
                </div>

                <div>
                  <strong>{stats.offers}</strong>

                  <span>Offers</span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              NEXT STEPS
          ========================= */}

          <section className="dashboard-next">
            <div className="dashboard-section-heading">
              <div>
                <span className="panel-label">RECOMMENDED</span>

                <h2>Your next steps</h2>
              </div>
            </div>

            <div className="next-step-grid">
              {/* STEP 1 */}

              <button
                className="next-step-card"
                onClick={() => navigate("/career")}
              >
                <div className="next-step-number">01</div>

                <div className="next-step-icon">
                  <Map size={18} />
                </div>

                <div className="next-step-content">
                  <h3>Build your roadmap</h3>

                  <p>
                    Tell Career AI your target role and generate a practical
                    learning path.
                  </p>
                </div>

                <ArrowRight size={15} />
              </button>

              {/* STEP 2 */}

              <button
                className="next-step-card"
                onClick={() => navigate("/jobs")}
              >
                <div className="next-step-number">02</div>

                <div className="next-step-icon">
                  <BriefcaseBusiness size={18} />
                </div>

                <div className="next-step-content">
                  <h3>Explore matching jobs</h3>

                  <p>
                    Find opportunities that align with your skills and career
                    goals.
                  </p>
                </div>

                <ArrowRight size={15} />
              </button>

              {/* STEP 3 */}

              <button
                className="next-step-card"
                onClick={() => navigate("/resumes")}
              >
                <div className="next-step-number">03</div>

                <div className="next-step-icon">
                  <FileText size={18} />
                </div>

                <div className="next-step-content">
                  <h3>Improve your resume</h3>

                  <p>
                    Upload your resume and use AI to identify areas for
                    improvement.
                  </p>
                </div>

                <ArrowRight size={15} />
              </button>
            </div>
          </section>

          {/* =========================
              FOOTER STATUS
          ========================= */}

          <div className="dashboard-footer-status">
            {loading ? (
              <>
                <Clock3 size={13} />
                Updating your career data...
              </>
            ) : (
              <>
                <CheckCircle2 size={13} />
                Career AI is ready to help.
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
