import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/Jobs.css";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedResume, setSelectedResume] = useState("");

  const [matchResult, setMatchResult] = useState(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [jobsResponse, resumesResponse] = await Promise.all([
        api.get("/jobs"),
        api.get("/resumes"),
      ]);

      setJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);

      setResumes(
        Array.isArray(resumesResponse.data) ? resumesResponse.data : [],
      );
    } catch (err) {
      console.error("Jobs loading error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load jobs.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    const locationText = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.description,
        job.skills,
        job.jobType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const jobLocation = job.location?.toLowerCase() || "";

      return (
        (!searchText || searchableText.includes(searchText)) &&
        (!locationText || jobLocation.includes(locationText))
      );
    });
  }, [jobs, search, location]);

  const getSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills;
    }

    if (!skills) {
      return [];
    }

    try {
      const parsed = JSON.parse(skills);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Treat normal comma-separated text below.
    }

    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  };

  const openMatch = (job) => {
    setSelectedJob(job);
    setSelectedResume("");
    setMatchResult(null);
    setError("");
  };

  const closeMatch = () => {
    if (matching) {
      return;
    }

    setSelectedJob(null);
    setSelectedResume("");
    setMatchResult(null);
    setError("");
  };

  const matchResume = async () => {
    if (!selectedJob) {
      return;
    }

    if (!selectedResume) {
      setError("Please select a resume.");
      return;
    }

    setMatching(true);
    setError("");

    try {
      const response = await api.post(`/jobs/${selectedJob.id}/match`, null, {
        params: {
          resumeId: selectedResume,
        },
      });

      setMatchResult(response.data);
    } catch (err) {
      console.error("Resume matching error:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to analyze the job match.",
      );
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="jobs-page">
      {/* HEADER */}

      <header className="jobs-header">
        <button
          className="jobs-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="jobs-brand">
          <div className="jobs-brand-icon">C</div>

          <span>
            Career<strong>AI</strong>
          </span>
        </div>

        <button
          className="jobs-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "jobs-refresh-spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="jobs-main">
        <div className="jobs-container">
          {/* INTRO */}

          <section className="jobs-intro">
            <div>
              <span className="jobs-eyebrow">OPPORTUNITIES</span>

              <h1>Find your next role.</h1>

              <p>
                Explore available jobs and compare them against your resume
                using Career AI.
              </p>
            </div>

            <div className="jobs-total">
              <strong>{filteredJobs.length}</strong>

              <span>matching jobs</span>
            </div>
          </section>

          {/* ERROR */}

          {error && !selectedJob && <div className="jobs-error">{error}</div>}

          {/* SEARCH */}

          <section className="jobs-search">
            <div className="jobs-search-input">
              <Search size={16} />

              <input
                type="text"
                placeholder="Search title, company or skill"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="jobs-location-input">
              <MapPin size={16} />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
          </section>

          {/* LOADING */}

          {loading && (
            <div className="jobs-state">
              <Loader2 size={28} className="jobs-spinner" />

              <h2>Loading jobs...</h2>

              <p>Getting the latest opportunities.</p>
            </div>
          )}

          {/* EMPTY */}

          {!loading && filteredJobs.length === 0 && (
            <div className="jobs-state">
              <div className="jobs-empty-icon">
                <BriefcaseBusiness size={23} />
              </div>

              <h2>No jobs found</h2>

              <p>Try changing your search or location.</p>

              {(search || location) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setLocation("");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* JOBS */}

          {!loading && filteredJobs.length > 0 && (
            <section className="jobs-list">
              {filteredJobs.map((job) => {
                const skills = getSkills(job.skills);

                return (
                  <article className="job-card" key={job.id}>
                    <div className="job-company-icon">
                      <Building2 size={19} />
                    </div>

                    <div className="job-card-content">
                      <div className="job-heading">
                        <div>
                          <h2>{job.title}</h2>

                          <div className="job-company">
                            <Building2 size={12} />
                            {job.company}
                          </div>
                        </div>
                      </div>

                      <div className="job-meta">
                        {job.location && (
                          <span>
                            <MapPin size={12} />
                            {job.location}
                          </span>
                        )}

                        {job.jobType && (
                          <span>
                            <BriefcaseBusiness size={12} />
                            {job.jobType}
                          </span>
                        )}
                      </div>

                      {job.description && (
                        <p className="job-description">{job.description}</p>
                      )}

                      {skills.length > 0 && (
                        <div className="job-skills">
                          {skills.slice(0, 6).map((skill, index) => (
                            <span key={index}>{skill}</span>
                          ))}
                        </div>
                      )}

                      <div className="job-actions">
                        <button
                          className="job-match-button"
                          onClick={() => openMatch(job)}
                        >
                          <Sparkles size={14} />
                          Match my resume
                        </button>

                        {job.sourceUrl && (
                          <a
                            className="job-view-button"
                            href={job.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View job
                            <ExternalLink size={12} />
                          </a>
                        )}

                        <button
                          className="job-track-button"
                          onClick={() => navigate("/applications")}
                        >
                          Track application
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>

      {/* MATCH MODAL */}

      {selectedJob && (
        <div className="job-modal-overlay" onMouseDown={closeMatch}>
          <div
            className="job-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="job-modal-header">
              <div>
                <span>AI JOB MATCH</span>

                <h2>{selectedJob.title}</h2>

                <p>{selectedJob.company}</p>
              </div>

              <button onClick={closeMatch} disabled={matching}>
                <X size={17} />
              </button>
            </div>

            {!matchResult && (
              <>
                <div className="resume-selector">
                  <label>Select your resume</label>

                  {resumes.length === 0 ? (
                    <div className="no-resume">
                      <p>
                        You need to upload a resume before running an AI job
                        match.
                      </p>

                      <button onClick={() => navigate("/resumes/upload")}>
                        Upload resume
                      </button>
                    </div>
                  ) : (
                    <select
                      value={selectedResume}
                      onChange={(event) =>
                        setSelectedResume(event.target.value)
                      }
                    >
                      <option value="">Choose a resume</option>

                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.fileName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {error && <div className="jobs-error">{error}</div>}

                <button
                  className="analyze-match-button"
                  onClick={matchResume}
                  disabled={!selectedResume || matching}
                >
                  {matching ? (
                    <>
                      <Loader2 size={15} className="jobs-spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} />
                      Analyze match
                    </>
                  )}
                </button>
              </>
            )}

            {matchResult && (
              <div className="match-result">
                <div className="match-score">
                  <span>MATCH SCORE</span>

                  <strong>
                    {matchResult.matchScore ?? 0}
                    <small>/100</small>
                  </strong>
                </div>

                {matchResult.analysis && (
                  <div className="match-analysis">
                    <span>AI ANALYSIS</span>

                    <p>{matchResult.analysis}</p>
                  </div>
                )}

                <div className="match-columns">
                  <div>
                    <h3>Matched skills</h3>

                    <p>
                      {matchResult.matchedSkills ||
                        "No matched skills returned."}
                    </p>
                  </div>

                  <div>
                    <h3>Missing skills</h3>

                    <p>
                      {matchResult.missingSkills ||
                        "No missing skills returned."}
                    </p>
                  </div>
                </div>

                <button className="analyze-match-button" onClick={closeMatch}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
