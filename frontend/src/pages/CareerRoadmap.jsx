import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  BookOpen,
  Code2,
  Cloud,
  Network,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/CareerRoadmap.css";

const CareerRoadmap = () => {
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);

  const [targetRole, setTargetRole] = useState("");
  const [level, setLevel] = useState("BEGINNER");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRoadmap = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/career/roadmap");

      setRoadmap(response.data);

      if (response.data?.targetRole) {
        setTargetRole(response.data.targetRole);
      }

      if (response.data?.currentLevel) {
        setLevel(response.data.currentLevel);
      }
    } catch (err) {
      /*
       * 404 simply means the user hasn't created
       * a roadmap yet.
       */
      if (err?.response?.status === 404) {
        setRoadmap(null);
      } else {
        console.error("Failed to load roadmap:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load your career roadmap.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const generateRoadmap = async (event) => {
    event.preventDefault();

    const role = targetRole.trim();

    if (!role) {
      setError("Please enter your target career role.");
      return;
    }

    setGenerating(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/career/roadmap", null, {
        params: {
          targetRole: role,
          level,
        },
      });

      setRoadmap(response.data);

      setSuccess("Your personalized career roadmap has been generated.");

      setTimeout(() => {
        setSuccess("");
      }, 3500);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to generate your roadmap.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const getStepIcon = (title = "") => {
    const value = title.toLowerCase();

    if (value.includes("java") || value.includes("programming")) {
      return <Code2 size={18} />;
    }

    if (value.includes("cloud") || value.includes("devops")) {
      return <Cloud size={18} />;
    }

    if (value.includes("system") || value.includes("design")) {
      return <Network size={18} />;
    }

    if (
      value.includes("spring") ||
      value.includes("backend") ||
      value.includes("web")
    ) {
      return <BriefcaseBusiness size={18} />;
    }

    return <BookOpen size={18} />;
  };

  const getStepStatus = (status = "") => {
    const value = status.toLowerCase();

    if (value === "complete" || value === "completed" || value === "done") {
      return "complete";
    }

    if (value === "build" || value === "current" || value === "active") {
      return "current";
    }

    if (value === "review") {
      return "review";
    }

    return "upcoming";
  };

  const getStatusLabel = (status = "") => {
    const normalized = getStepStatus(status);

    if (normalized === "complete") {
      return "Completed";
    }

    if (normalized === "current") {
      return "Current";
    }

    if (normalized === "review") {
      return "Review";
    }

    return "Upcoming";
  };

  const calculateProgress = () => {
    const steps = roadmap?.steps || [];

    if (!steps.length) {
      return 0;
    }

    const completed = steps.filter(
      (step) => getStepStatus(step.status) === "complete",
    ).length;

    return Math.round((completed / steps.length) * 100);
  };

  const progress = calculateProgress();

  if (loading) {
    return (
      <div className="roadmap-page">
        <div className="roadmap-loading">
          <Loader2 size={31} className="roadmap-spinner" />

          <h2>Loading your career roadmap...</h2>

          <p>Preparing your personalized career workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roadmap-page">
      {/* HEADER */}

      <header className="roadmap-header">
        <button
          className="roadmap-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="roadmap-brand">
          <div className="roadmap-brand-icon">C</div>

          <div>
            <span>Career</span>
            <strong>AI</strong>
          </div>
        </div>

        <button
          className="roadmap-refresh-button"
          onClick={fetchRoadmap}
          disabled={generating}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </header>

      <main className="roadmap-main">
        <div className="roadmap-container">
          {/* INTRO */}

          <section className="roadmap-intro">
            <div>
              <span className="roadmap-eyebrow">CAREER ROADMAP</span>

              <h1>Build your career path.</h1>

              <p>
                Create a personalized roadmap based on your target role,
                experience level and resume.
              </p>
            </div>
          </section>

          {/* ERROR */}

          {error && (
            <div className="roadmap-message error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="roadmap-message success">
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          {/* NO ROADMAP */}

          {!roadmap && (
            <section className="roadmap-create-card">
              <div className="create-icon">
                <Target size={25} />
              </div>

              <div className="create-content">
                <span className="roadmap-card-label">START YOUR JOURNEY</span>

                <h2>What role are you targeting?</h2>

                <p>
                  Tell Career AI where you want to go and we'll generate a
                  practical roadmap for you.
                </p>

                <form className="roadmap-form" onSubmit={generateRoadmap}>
                  <div className="roadmap-input-group">
                    <label>Target career role</label>

                    <div className="roadmap-input-wrapper">
                      <BriefcaseBusiness size={17} />

                      <input
                        type="text"
                        value={targetRole}
                        onChange={(event) => setTargetRole(event.target.value)}
                        placeholder="e.g. Full Stack Developer"
                        disabled={generating}
                      />
                    </div>
                  </div>

                  <div className="roadmap-input-group">
                    <label>Current level</label>

                    <select
                      value={level}
                      onChange={(event) => setLevel(event.target.value)}
                      disabled={generating}
                    >
                      <option value="BEGINNER">Beginner</option>

                      <option value="INTERMEDIATE">Intermediate</option>

                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <button
                    className="generate-roadmap-button"
                    type="submit"
                    disabled={generating}
                  >
                    {generating ? (
                      <>
                        <Loader2 size={17} className="roadmap-spinner" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        Generate roadmap
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ROADMAP */}

          {roadmap && (
            <>
              {/* HERO */}

              <section className="roadmap-hero">
                <div className="roadmap-hero-left">
                  <div className="target-role-icon">
                    <Target size={25} />
                  </div>

                  <div>
                    <span>YOUR TARGET ROLE</span>

                    <h2>{roadmap.targetRole}</h2>

                    <p>{roadmap.currentLevel || "BEGINNER"} level</p>
                  </div>
                </div>

                <div className="roadmap-progress">
                  <div className="progress-header">
                    <span>ROADMAP PROGRESS</span>

                    <strong>{progress}%</strong>
                  </div>

                  <div className="progress-track">
                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <small>{roadmap.steps?.length || 0} learning stages</small>
                </div>
              </section>

              {/* STATS */}

              <section className="roadmap-stats">
                <div className="roadmap-stat">
                  <div className="roadmap-stat-icon orange">
                    <Target size={18} />
                  </div>

                  <div>
                    <span>TARGET</span>

                    <strong>{roadmap.targetRole}</strong>
                  </div>
                </div>

                <div className="roadmap-stat">
                  <div className="roadmap-stat-icon purple">
                    <BookOpen size={18} />
                  </div>

                  <div>
                    <span>STAGES</span>

                    <strong>{roadmap.steps?.length || 0}</strong>
                  </div>
                </div>

                <div className="roadmap-stat">
                  <div className="roadmap-stat-icon green">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <span>COMPLETED</span>

                    <strong>
                      {
                        (roadmap.steps || []).filter(
                          (step) => getStepStatus(step.status) === "complete",
                        ).length
                      }
                    </strong>
                  </div>
                </div>

                <div className="roadmap-stat">
                  <div className="roadmap-stat-icon blue">
                    <Clock3 size={18} />
                  </div>

                  <div>
                    <span>LEVEL</span>

                    <strong>{roadmap.currentLevel}</strong>
                  </div>
                </div>
              </section>

              {/* LEARNING PATH */}

              <section className="roadmap-path-section">
                <div className="section-heading">
                  <div>
                    <span>YOUR LEARNING PATH</span>

                    <h2>Follow the roadmap</h2>

                    <p>
                      Work through each stage and build the skills required for
                      your target role.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setRoadmap(null);
                      setError("");
                    }}
                  >
                    <RefreshCw size={14} />
                    New roadmap
                  </button>
                </div>

                <div className="roadmap-timeline">
                  {(roadmap.steps || []).map((step, index) => {
                    const status = getStepStatus(step.status);

                    return (
                      <article
                        className={`roadmap-step ${status}`}
                        key={`${step.title}-${index}`}
                      >
                        <div className="timeline-line" />

                        <div className="step-number">
                          {status === "complete" ? (
                            <CheckCircle2 size={18} />
                          ) : (
                            <span>{String(index + 1).padStart(2, "0")}</span>
                          )}
                        </div>

                        <div className="step-card">
                          <div className="step-card-header">
                            <div className="step-title-area">
                              <div className="step-icon">
                                {getStepIcon(step.title)}
                              </div>

                              <div>
                                <span className="step-stage">
                                  STAGE {String(index + 1).padStart(2, "0")}
                                </span>

                                <h3>{step.title}</h3>
                              </div>
                            </div>

                            <span className={`step-status ${status}`}>
                              {getStatusLabel(step.status)}
                            </span>
                          </div>

                          {step.skills?.length > 0 && (
                            <div className="step-skills">
                              <span>Skills to develop</span>

                              <div>
                                {step.skills.map((skill, skillIndex) => (
                                  <span
                                    className="skill-chip"
                                    key={`${skill}-${skillIndex}`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* CTA */}

              <section className="roadmap-bottom-cta">
                <div className="cta-icon">
                  <Sparkles size={22} />
                </div>

                <div>
                  <span>CAREER AI</span>

                  <h3>Your roadmap is only the beginning.</h3>

                  <p>
                    Continue by exploring job matches and preparing applications
                    for your target role.
                  </p>
                </div>

                <button onClick={() => navigate("/jobs")}>
                  Explore jobs
                  <ArrowRight size={16} />
                </button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerRoadmap;
