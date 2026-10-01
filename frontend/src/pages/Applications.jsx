import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/Applications.css";

const STATUS_OPTIONS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

const STATUS_LABELS = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const Applications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [filter, setFilter] = useState("ALL");

  const [form, setForm] = useState({
    jobId: "",
    status: "APPLIED",
    appliedDate: "",
    interviewDate: "",
    notes: "",
  });

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const [applicationsResponse, jobsResponse] = await Promise.all([
        api.get("/applications"),
        api.get("/jobs"),
      ]);

      setApplications(applicationsResponse.data || []);

      setJobs(jobsResponse.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to load applications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const statistics = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter((item) => item.status === "APPLIED").length,
      interviews: applications.filter((item) => item.status === "INTERVIEW")
        .length,
      offers: applications.filter((item) => item.status === "OFFER").length,
      rejected: applications.filter((item) => item.status === "REJECTED")
        .length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (filter === "ALL") {
      return applications;
    }

    return applications.filter((application) => application.status === filter);
  }, [applications, filter]);

  const resetForm = () => {
    setForm({
      jobId: "",
      status: "APPLIED",
      appliedDate: "",
      interviewDate: "",
      notes: "",
    });

    setEditingApplication(null);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const openEditModal = (application) => {
    setEditingApplication(application);

    setForm({
      jobId: String(application.jobId),
      status: application.status || "APPLIED",
      appliedDate: application.appliedDate || "",
      interviewDate: application.interviewDate || "",
      notes: application.notes || "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingApplication && !form.jobId) {
      setError("Please select a job.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        status: form.status,
        appliedDate: form.appliedDate || null,
        interviewDate: form.interviewDate || null,
        notes: form.notes.trim(),
      };

      let response;

      if (editingApplication) {
        response = await api.put(
          `/applications/${editingApplication.id}`,
          payload,
        );

        setApplications((previous) =>
          previous.map((item) =>
            item.id === editingApplication.id ? response.data : item,
          ),
        );

        setSuccess("Application updated successfully.");
      } else {
        response = await api.post("/applications", {
          jobId: Number(form.jobId),
          ...payload,
        });

        setApplications((previous) => [response.data, ...previous]);

        setSuccess("Application added successfully.");
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save application:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to save application.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      await api.delete(`/applications/${id}`);

      setApplications((previous) =>
        previous.filter((application) => application.id !== id),
      );

      setSuccess("Application deleted successfully.");
    } catch (err) {
      console.error("Failed to delete application:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to delete application.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `application-status status-${status?.toLowerCase()}` || "";
  };

  return (
    <div className="applications-page">
      {/* HEADER */}

      <header className="applications-header">
        <button
          className="applications-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>

        <div className="applications-brand">
          <div className="applications-brand-icon">C</div>

          <span>
            Career<strong>AI</strong>
          </span>
        </div>

        <button className="add-application-button" onClick={openCreateModal}>
          <Plus size={16} />
          Add application
        </button>
      </header>

      <main className="applications-main">
        <div className="applications-container">
          {/* INTRO */}

          <section className="applications-intro">
            <div>
              <span className="applications-eyebrow">APPLICATION TRACKER</span>

              <h1>Keep every opportunity organized.</h1>

              <p>
                Track your applications, interviews, offers and outcomes in one
                place.
              </p>
            </div>
          </section>

          {/* MESSAGES */}

          {error && !showModal && (
            <div className="application-message error">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          {success && !showModal && (
            <div className="application-message success">
              <CheckCircle2 size={15} />
              {success}
            </div>
          )}

          {/* STATISTICS */}

          <section className="application-stats">
            <div className="application-stat">
              <div className="stat-icon">
                <BriefcaseBusiness size={17} />
              </div>

              <div>
                <strong>{statistics.total}</strong>

                <span>Total applications</span>
              </div>
            </div>

            <div className="application-stat">
              <div className="stat-icon">
                <Clock3 size={17} />
              </div>

              <div>
                <strong>{statistics.applied}</strong>

                <span>Applied</span>
              </div>
            </div>

            <div className="application-stat">
              <div className="stat-icon">
                <CalendarDays size={17} />
              </div>

              <div>
                <strong>{statistics.interviews}</strong>

                <span>Interviews</span>
              </div>
            </div>

            <div className="application-stat">
              <div className="stat-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>{statistics.offers}</strong>

                <span>Offers</span>
              </div>
            </div>
          </section>

          {/* FILTER */}

          <section className="applications-toolbar">
            <div className="application-filters">
              {[
                ["ALL", "All"],
                ["APPLIED", "Applied"],
                ["INTERVIEW", "Interview"],
                ["OFFER", "Offers"],
                ["REJECTED", "Rejected"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* LOADING */}

          {loading && (
            <div className="applications-loading">
              <Loader2 size={28} className="application-spinner" />

              <h2>Loading applications...</h2>
            </div>
          )}

          {/* EMPTY */}

          {!loading && filteredApplications.length === 0 && (
            <div className="applications-empty">
              <div className="applications-empty-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <h2>No applications yet</h2>

              <p>Start tracking the jobs you're applying for.</p>

              <button onClick={openCreateModal}>
                <Plus size={15} />
                Add your first application
              </button>
            </div>
          )}

          {/* APPLICATIONS */}

          {!loading && filteredApplications.length > 0 && (
            <section className="applications-list">
              {filteredApplications.map((application) => (
                <article className="application-card" key={application.id}>
                  <div className="application-company-icon">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div className="application-content">
                    <div className="application-title-row">
                      <div>
                        <h2>{application.jobTitle}</h2>

                        <p>{application.company}</p>
                      </div>

                      <span className={getStatusClass(application.status)}>
                        {STATUS_LABELS[application.status] ||
                          application.status}
                      </span>
                    </div>

                    <div className="application-details">
                      {application.appliedDate && (
                        <span>
                          <CalendarDays size={13} />
                          Applied: {application.appliedDate}
                        </span>
                      )}

                      {application.interviewDate && (
                        <span>
                          <CalendarDays size={13} />
                          Interview: {application.interviewDate}
                        </span>
                      )}
                    </div>

                    {application.notes && (
                      <p className="application-notes">{application.notes}</p>
                    )}

                    <div className="application-actions">
                      <button onClick={() => openEditModal(application)}>
                        <Edit3 size={13} />
                        Edit
                      </button>

                      <button
                        className="delete"
                        onClick={() => deleteApplication(application.id)}
                        disabled={deletingId === application.id}
                      >
                        {deletingId === application.id ? (
                          <Loader2 size={13} className="application-spinner" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}

      {showModal && (
        <div className="application-modal-overlay">
          <div className="application-modal">
            <div className="application-modal-header">
              <div>
                <span>
                  {editingApplication
                    ? "UPDATE APPLICATION"
                    : "NEW APPLICATION"}
                </span>

                <h2>
                  {editingApplication
                    ? "Update application"
                    : "Track a new opportunity"}
                </h2>
              </div>

              <button onClick={closeModal} disabled={saving}>
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="application-form">
              {!editingApplication && (
                <div className="application-form-group">
                  <label>Job</label>

                  <select
                    name="jobId"
                    value={form.jobId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a job</option>

                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} — {job.company}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="application-form-row">
                <div className="application-form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="application-form-group">
                  <label>Applied date</label>

                  <input
                    type="date"
                    name="appliedDate"
                    value={form.appliedDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="application-form-group">
                <label>Interview date</label>

                <input
                  type="date"
                  name="interviewDate"
                  value={form.interviewDate}
                  onChange={handleChange}
                />
              </div>

              <div className="application-form-group">
                <label>Notes</label>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Add interview details, recruiter notes, preparation points..."
                  rows={5}
                />
              </div>

              {error && (
                <div className="application-message error">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <div className="application-form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-application-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="application-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      {editingApplication ? "Save changes" : "Add application"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
