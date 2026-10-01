import { useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/ResumeUpload.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ResumeUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const validateFile = (file) => {
    if (!file) {
      return "Please select a resume file.";
    }

    const fileName = file.name.toLowerCase();

    const isPdf = fileName.endsWith(".pdf");
    const isDocx = fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      return "Only PDF and DOCX files are supported.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10 MB.";
    }

    if (file.size === 0) {
      return "The selected file is empty.";
    }

    return "";
  };

  const selectFile = (file) => {
    setError("");
    setSuccess("");

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      selectFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      selectFile(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    const mb = bytes / (1024 * 1024);

    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    }

    return `${Math.ceil(bytes / 1024)} KB`;
  };

  const extractErrorMessage = (err) => {
    const responseData = err?.response?.data;

    if (typeof responseData === "string") {
      return responseData;
    }

    return (
      responseData?.message ||
      responseData?.error ||
      err?.message ||
      "Unable to upload your resume. Please try again."
    );
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume before uploading.");
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await api.post("/resumes/upload", formData);

      console.log("Resume uploaded:", response.data);

      setSuccess("Resume uploaded successfully.");

      setTimeout(() => {
        navigate("/resumes");
      }, 1000);
    } catch (err) {
      console.error("Resume upload failed:", err);

      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-page">
      {/* Header */}
      <header className="resume-upload-header">
        <button
          className="resume-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="resume-upload-brand">
          <div className="resume-brand-icon">C</div>

          <div>
            <span>Career</span>
            <strong>AI</strong>
          </div>
        </div>

        <div className="resume-header-spacer" />
      </header>

      {/* Main */}
      <main className="resume-upload-main">
        <div className="resume-upload-container">
          {/* Intro */}
          <section className="resume-upload-intro">
            <span className="resume-eyebrow">RESUME ANALYSIS</span>

            <h1>Upload your resume.</h1>

            <p>
              Let Career AI understand your experience, skills and career
              profile. Your resume will be analyzed to power personalized career
              recommendations.
            </p>
          </section>

          {/* Upload Card */}
          <section className="resume-upload-card">
            <div
              className={`resume-dropzone ${
                isDragging ? "dragging" : ""
              } ${selectedFile ? "has-file" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={!selectedFile ? openFilePicker : undefined}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                hidden
              />

              {!selectedFile ? (
                <>
                  <div className="upload-icon-wrapper">
                    <Upload size={26} />
                  </div>

                  <h3>Drop your resume here</h3>

                  <p>or click to browse from your computer</p>

                  <div className="supported-files">
                    <span>PDF</span>
                    <span>DOCX</span>
                    <small>Maximum 10 MB</small>
                  </div>

                  <button
                    type="button"
                    className="browse-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openFilePicker();
                    }}
                  >
                    Choose file
                  </button>
                </>
              ) : (
                <div className="selected-file">
                  <div className="selected-file-icon">
                    <FileText size={25} />
                  </div>

                  <div className="selected-file-info">
                    <strong>{selectedFile.name}</strong>

                    <span>{formatFileSize(selectedFile.size)}</span>
                  </div>

                  <button
                    type="button"
                    className="remove-file-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFile();
                    }}
                    aria-label="Remove file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="resume-message error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="resume-message success">
                <CheckCircle2 size={17} />
                <span>{success}</span>
              </div>
            )}

            {/* Upload Button */}
            <button
              className="resume-upload-submit"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="upload-spinner" />
                  Uploading resume...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload Resume
                </>
              )}
            </button>

            <p className="upload-security-note">
              Your resume is securely associated with your Career AI account.
            </p>
          </section>

          {/* What happens next */}
          <section className="resume-next-section">
            <div className="next-section-header">
              <span>WHAT HAPPENS NEXT</span>
              <h2>Turn your resume into a career plan.</h2>
            </div>

            <div className="next-steps">
              <div className="next-step">
                <div className="next-step-number">01</div>

                <div>
                  <h3>Resume analysis</h3>

                  <p>
                    Career AI extracts your experience, skills and professional
                    information.
                  </p>
                </div>
              </div>

              <div className="next-step">
                <div className="next-step-number">02</div>

                <div>
                  <h3>Skill insights</h3>

                  <p>
                    Identify your existing strengths and potential skill gaps.
                  </p>
                </div>
              </div>

              <div className="next-step">
                <div className="next-step-number">03</div>

                <div>
                  <h3>Career recommendations</h3>

                  <p>Generate personalized job matches and a career roadmap.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ResumeUpload;
