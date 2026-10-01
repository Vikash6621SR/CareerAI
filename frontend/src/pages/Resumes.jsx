import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  RefreshCw,
  LayoutDashboard,
  FileCheck2,
  AlertCircle,
  X,
} from "lucide-react";

import api from "../services/api";
import "../styles/Resumes.css";

function formatFileSize(bytes) {
  if (!bytes) return "Unknown size";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date) {
  if (!date) return "Unknown date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFileExtension(fileName = "") {
  const parts = fileName.split(".");

  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message || error?.response?.data?.error || fallback
  );
}

export default function Resumes() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
   * --------------------------------------------------
   * LOAD RESUMES
   * --------------------------------------------------
   */
  const loadResumes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resumes");

      setResumes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(
        getErrorMessage(err, "Unable to load your resumes. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * LOAD RESUMES WHEN PAGE OPENS
   * --------------------------------------------------
   */
  useEffect(() => {
    loadResumes();
  }, []);

  /*
   * --------------------------------------------------
   * VALIDATE AND SELECT FILE
   *
   * This function is used by:
   * - Normal file selection
   * - Drag and drop
   *
   * Allowed:
   * - PDF
   * - DOCX
   *
   * Maximum size:
   * - 10 MB
   * --------------------------------------------------
   */
  const chooseFile = (file) => {
    setError("");
    setSuccess("");

    if (!file) {
      return;
    }

    /*
     * -----------------------------------------------
     * 1. FILE EXTENSION VALIDATION
     * -----------------------------------------------
     */
    const extension = file.name.split(".").pop()?.toLowerCase();

    const allowedExtensions = ["pdf", "docx"];

    if (!allowedExtensions.includes(extension)) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setError("Only PDF and DOCX files are allowed.");

      return;
    }

    /*
     * -----------------------------------------------
     * 2. MIME TYPE VALIDATION
     * -----------------------------------------------
     */
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setError("Only PDF and DOCX files are allowed.");

      return;
    }

    /*
     * -----------------------------------------------
     * 3. FILE SIZE VALIDATION
     *
     * 10 MB = 10 * 1024 * 1024 bytes
     * -----------------------------------------------
     */
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setError("Resume must be smaller than 10 MB.");

      return;
    }

    /*
     * -----------------------------------------------
     * 4. FILE IS VALID
     * -----------------------------------------------
     */
    setSelectedFile(file);
  };

  /*
   * --------------------------------------------------
   * FILE INPUT CHANGE
   * --------------------------------------------------
   */
  const handleFileChange = (event) => {
    chooseFile(event.target.files?.[0]);
  };

  /*
   * --------------------------------------------------
   * DRAG AND DROP
   * --------------------------------------------------
   */
  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    chooseFile(event.dataTransfer.files?.[0]);
  };

  /*
   * --------------------------------------------------
   * DRAG OVER
   * --------------------------------------------------
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  /*
   * --------------------------------------------------
   * DRAG LEAVE
   * --------------------------------------------------
   */
  const handleDragLeave = () => {
    setDragActive(false);
  };

  /*
   * --------------------------------------------------
   * UPLOAD RESUME
   * --------------------------------------------------
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");

      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      /*
       * FormData is required for MultipartFile
       * in Spring Boot.
       */
      const formData = new FormData();

      formData.append("file", selectedFile);

      /*
       * Do not manually set Content-Type here.
       *
       * Axios/browser automatically sets:
       *
       * multipart/form-data;
       * boundary=...
       */
      const response = await api.post("/resumes/upload", formData);

      console.log("Resume uploaded successfully:", response.data);

      /*
       * Clear selected file after successful upload.
       */
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess("Resume uploaded successfully.");

      /*
       * Refresh resume list.
       */
      await loadResumes();
    } catch (err) {
      setError(getErrorMessage(err, "Resume upload failed. Please try again."));
    } finally {
      setUploading(false);
    }
  };

  /*
   * --------------------------------------------------
   * DELETE RESUME
   * --------------------------------------------------
   */
  const handleDelete = async (resume) => {
    const confirmed = window.confirm(
      `Delete "${resume.fileName}"?\n\nThis will permanently remove the resume and its analysis.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(resume.id);
      setError("");
      setSuccess("");

      await api.delete(`/resumes/${resume.id}`);

      setResumes((current) => current.filter((item) => item.id !== resume.id));

      setSuccess("Resume deleted successfully.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to delete the resume."));
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * --------------------------------------------------
   * OPEN AI ANALYSIS
   * --------------------------------------------------
   */
  const handleAnalyze = (resumeId) => {
    navigate(`/resumes/${resumeId}/analysis`);
  };

  /*
   * --------------------------------------------------
   * CLEAR SELECTED FILE
   * --------------------------------------------------
   */
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */
  return (
    <div className="resumes-page">
      <style>{`
        .resumes-topbar {
          width: 100%;
          min-height: 76px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 48px;
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-sizing: border-box;
        }

        .resumes-topbar-back,
        .resumes-topbar-brand,
        .resumes-topbar-refresh {
          border: 0;
          background: transparent;
          font-family: inherit;
          cursor: pointer;
        }

        .resumes-topbar-back {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          color: #4b5563;
          font-size: 14px;
          font-weight: 500;
        }

        .resumes-topbar-back:hover {
          color: #171717;
        }

        .resumes-topbar-arrow {
          font-size: 25px;
          line-height: 1;
          font-weight: 300;
          margin-top: -2px;
        }

        .resumes-topbar-brand {
          justify-self: center;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 0;
        }

        .resumes-brand-mark {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #ff6b00;
          color: #ffffff;
          font-size: 21px;
          font-weight: 800;
          line-height: 1;
        }

        .resumes-brand-text {
          color: #171717;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -0.4px;
        }

        .resumes-brand-text span {
          color: #ff6b00;
        }

        .resumes-topbar-refresh {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 18px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #ffffff;
          color: #171717;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .resumes-topbar-refresh:hover:not(:disabled) {
          background: #fff7ed;
          border-color: #ff7a00;
          color: #ff6b00;
        }

        .resumes-topbar-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .resumes-header {
          margin-top: 34px;
        }

        @media (max-width: 700px) {
          .resumes-topbar {
            min-height: 68px;
            padding: 0 18px;
          }

          .resumes-topbar-back span:last-child {
            display: none;
          }

          .resumes-topbar-refresh {
            width: 42px;
            padding: 0;
          }

          .resumes-topbar-refresh {
            font-size: 0;
          }

          .resumes-topbar-refresh svg {
            width: 18px;
            height: 18px;
          }

          .resumes-brand-mark {
            width: 32px;
            height: 32px;
            font-size: 18px;
          }

          .resumes-brand-text {
            font-size: 18px;
          }
        }
      `}</style>
      <div className="resumes-container">
        {/* -----------------------------------------
            TOP NAVIGATION
            Matches the Applications page header:
            Dashboard on the left,
            CareerAI centered,
            Refresh on the right.
        ----------------------------------------- */}
        <header className="resumes-topbar">
          <button
            type="button"
            className="resumes-topbar-back"
            onClick={() => navigate("/dashboard")}
          >
            <span className="resumes-topbar-arrow">←</span>
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className="resumes-topbar-brand"
            onClick={() => navigate("/dashboard")}
            aria-label="Go to Dashboard"
          >
            <span className="resumes-brand-mark">C</span>
            <span className="resumes-brand-text">
              Career<span>AI</span>
            </span>
          </button>

          <button
            type="button"
            className="resumes-topbar-refresh"
            onClick={loadResumes}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            Refresh
          </button>
        </header>

        {/* -----------------------------------------
            PAGE HEADER
        ----------------------------------------- */}
        <div className="resumes-header">
          <div>
            <div className="page-eyebrow">
              <FileCheck2 size={16} />
              Career AI
            </div>

            <h1>My Resumes</h1>

            <p>
              Upload your resume and analyze it with AI to identify strengths,
              missing skills, ATS issues, and improvements.
            </p>
          </div>
        </div>

        {/* -----------------------------------------
            ERROR ALERT
        ----------------------------------------- */}
        {error && (
          <div className="resume-alert error">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button onClick={() => setError("")} type="button">
              <X size={16} />
            </button>
          </div>
        )}

        {/* -----------------------------------------
            SUCCESS ALERT
        ----------------------------------------- */}
        {success && (
          <div className="resume-alert success">
            <FileCheck2 size={18} />

            <span>{success}</span>

            <button onClick={() => setSuccess("")} type="button">
              <X size={16} />
            </button>
          </div>
        )}

        {/* -----------------------------------------
            UPLOAD SECTION
        ----------------------------------------- */}
        <section className="upload-card">
          <div className="section-title">
            <div className="section-icon">
              <Upload size={19} />
            </div>

            <div>
              <h2>Upload Resume</h2>

              <p>Add a resume to start your AI-powered analysis.</p>
            </div>
          </div>

          {/* ---------------------------------------
              DROPZONE
          --------------------------------------- */}
          <div
            className={`upload-dropzone ${dragActive ? "drag-active" : ""} ${
              selectedFile ? "has-file" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* -------------------------------------
                FILE INPUT
            ------------------------------------- */}
            <input
              ref={fileInputRef}
              type="file"
              /*
               * Only PDF and DOCX are selectable.
               */
              accept=".pdf,.docx"
              onChange={handleFileChange}
              hidden
            />

            {!selectedFile ? (
              <>
                <div className="upload-icon">
                  <Upload size={25} />
                </div>

                <h3>Drop your resume here</h3>

                <p>or click to browse from your computer</p>

                <span className="upload-hint">PDF or DOCX • Maximum 10 MB</span>
              </>
            ) : (
              <div
                className="selected-file"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="selected-file-icon">
                  <FileText size={25} />
                </div>

                <div className="selected-file-info">
                  <strong>{selectedFile.name}</strong>

                  <span>{formatFileSize(selectedFile.size)}</span>
                </div>

                <button
                  className="remove-file-button"
                  onClick={clearSelectedFile}
                  type="button"
                  title="Remove selected file"
                >
                  <X size={17} />
                </button>
              </div>
            )}
          </div>

          {/* ---------------------------------------
              UPLOAD FOOTER
          --------------------------------------- */}
          <div className="upload-footer">
            <span>Your resume is securely associated with your account.</span>

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              type="button"
            >
              {uploading ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Upload Resume
                </>
              )}
            </button>
          </div>
        </section>

        {/* -----------------------------------------
            RESUME LIST
        ----------------------------------------- */}
        <section className="resume-list-section">
          <div className="list-header">
            <div>
              <h2>Your Resumes</h2>

              <p>
                {resumes.length} {resumes.length === 1 ? "resume" : "resumes"}{" "}
                uploaded
              </p>
            </div>
          </div>

          {/* ---------------------------------------
              LOADING
          --------------------------------------- */}
          {loading ? (
            <div className="resume-loading">
              <RefreshCw size={25} className="spin" />

              <p>Loading your resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            /* -------------------------------------
               EMPTY STATE
            ------------------------------------- */
            <div className="empty-resumes">
              <div className="empty-icon">
                <FileText size={28} />
              </div>

              <h3>No resumes yet</h3>

              <p>
                Upload your first resume above to start your AI career analysis.
              </p>
            </div>
          ) : (
            /* -------------------------------------
               RESUME GRID
            ------------------------------------- */
            <div className="resume-grid">
              {resumes.map((resume) => (
                <article className="resume-card" key={resume.id}>
                  <div className="resume-card-top">
                    <div className="resume-file-icon">
                      <FileText size={23} />
                    </div>

                    <span className="file-extension">
                      {getFileExtension(resume.fileName)}
                    </span>
                  </div>

                  <div className="resume-card-content">
                    <h3 title={resume.fileName}>{resume.fileName}</h3>

                    <div className="resume-meta">
                      <span>{formatFileSize(resume.fileSize)}</span>

                      <span className="meta-dot">•</span>

                      <span>Uploaded {formatDate(resume.uploadedAt)}</span>
                    </div>
                  </div>

                  <div className="resume-card-actions">
                    {/* AI ANALYSIS */}
                    <button
                      className="analyze-button"
                      onClick={() => handleAnalyze(resume.id)}
                      type="button"
                    >
                      <Sparkles size={16} />
                      AI Analysis
                    </button>

                    {/* DELETE */}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(resume)}
                      disabled={deletingId === resume.id}
                      title="Delete resume"
                      type="button"
                    >
                      {deletingId === resume.id ? (
                        <RefreshCw size={16} className="spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
