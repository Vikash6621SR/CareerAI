import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Lightbulb,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import "../styles/ResumeAnalysis.css";

const parseList = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  return [String(value)];
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Improvement";
  return "Needs Attention";
};

function ResumeAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [resumesResponse, analysisResponse] = await Promise.allSettled([
        api.get("/resumes"),
        api.get(`/resumes/${id}/analysis`),
      ]);

      if (resumesResponse.status === "fulfilled") {
        const resumes = Array.isArray(resumesResponse.value.data)
          ? resumesResponse.value.data
          : [];

        const selectedResume = resumes.find(
          (item) => String(item.id) === String(id),
        );

        setResume(selectedResume || null);
      }

      if (analysisResponse.status === "fulfilled") {
        setAnalysis(analysisResponse.value.data);
      } else {
        setAnalysis(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to load resume analysis.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError("");

      const response = await api.post(`/resumes/${id}/analyze`);

      setAnalysis(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Resume analysis failed. Please try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  if (loading) {
    return (
      <div className="resume-analysis-page analysis-loading-page">
        <Loader2 className="spin" size={32} />
        <p>Loading resume analysis...</p>
      </div>
    );
  }

  const score = Number(analysis?.atsScore || 0);

  const strengths = parseList(analysis?.strengths);
  const weaknesses = parseList(analysis?.weaknesses);
  const missingSkills = parseList(analysis?.missingSkills);
  const recommendations = parseList(analysis?.recommendations);
  const keywords = parseList(analysis?.keywords);

  return (
    <div className="resume-analysis-page">
      <header className="analysis-header">
        <div className="analysis-header-left">
          <button className="back-button" onClick={() => navigate("/resumes")}>
            <ArrowLeft size={18} />
            Back
          </button>

          <div>
            <div className="analysis-title-row">
              <Sparkles size={22} />
              <h1>Resume Analysis</h1>
            </div>

            <p>AI-powered ATS analysis of your uploaded resume.</p>
          </div>
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </header>

      {error && (
        <div className="analysis-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <XCircle size={18} />
          </button>
        </div>
      )}

      {resume && (
        <section className="resume-file-card">
          <div className="resume-file-icon">
            <FileText size={26} />
          </div>

          <div className="resume-file-info">
            <h2>{resume.fileName || "Resume"}</h2>

            <p>
              {resume.fileType || "Document"}
              {resume.fileSize
                ? ` • ${Math.round(resume.fileSize / 1024)} KB`
                : ""}
            </p>
          </div>

          <div className="resume-file-actions">
            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 size={17} className="spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  {analysis ? "Analyze Again" : "Analyze Resume"}
                </>
              )}
            </button>
          </div>
        </section>
      )}

      {!analysis ? (
        <section className="empty-analysis-card">
          <div className="empty-analysis-icon">
            <Target size={36} />
          </div>

          <h2>Analyze your resume</h2>

          <p>
            Let Career AI review your resume and generate an ATS score,
            strengths, weaknesses, missing skills, keywords and personalized
            recommendations.
          </p>

          <button
            className="primary-analysis-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <Loader2 size={18} className="spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Start AI Analysis
              </>
            )}
          </button>
        </section>
      ) : (
        <>
          <section className="analysis-overview">
            <div className="score-card">
              <div className="score-heading">
                <Target size={19} />
                <span>ATS Score</span>
              </div>

              <div
                className="score-circle"
                style={{
                  "--score": `${score * 3.6}deg`,
                }}
              >
                <div className="score-circle-inner">
                  <strong>{score}</strong>
                  <span>/ 100</span>
                </div>
              </div>

              <h3>{getScoreLabel(score)}</h3>

              <p>
                Your resume was evaluated against common ATS compatibility
                factors.
              </p>
            </div>

            <div className="summary-card">
              <div className="section-heading">
                <TrendingUp size={19} />
                <h2>AI Summary</h2>
              </div>

              <p className="analysis-summary">
                {analysis.summary || "No summary available."}
              </p>

              {analysis.analyzedAt && (
                <div className="analyzed-time">
                  Analyzed: {new Date(analysis.analyzedAt).toLocaleString()}
                </div>
              )}
            </div>
          </section>

          <section className="analysis-grid">
            <div className="analysis-card strengths-card">
              <div className="section-heading">
                <CheckCircle2 size={20} />
                <h2>Strengths</h2>
              </div>

              {strengths.length > 0 ? (
                <ul className="analysis-list">
                  {strengths.map((item, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No strengths identified.</p>
              )}
            </div>

            <div className="analysis-card weaknesses-card">
              <div className="section-heading">
                <AlertTriangle size={20} />
                <h2>Weaknesses</h2>
              </div>

              {weaknesses.length > 0 ? (
                <ul className="analysis-list">
                  {weaknesses.map((item, index) => (
                    <li key={index}>
                      <AlertTriangle size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data">No major weaknesses identified.</p>
              )}
            </div>

            <div className="analysis-card missing-card">
              <div className="section-heading">
                <XCircle size={20} />
                <h2>Missing Skills</h2>
              </div>

              {missingSkills.length > 0 ? (
                <div className="tag-list">
                  {missingSkills.map((skill, index) => (
                    <span key={index} className="skill-tag missing">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-data">No missing skills identified.</p>
              )}
            </div>

            <div className="analysis-card keywords-card">
              <div className="section-heading">
                <Target size={20} />
                <h2>Detected Keywords</h2>
              </div>

              {keywords.length > 0 ? (
                <div className="tag-list">
                  {keywords.map((keyword, index) => (
                    <span key={index} className="skill-tag">
                      {keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-data">No keywords detected.</p>
              )}
            </div>
          </section>

          <section className="recommendations-card">
            <div className="section-heading">
              <Lightbulb size={21} />
              <h2>AI Recommendations</h2>
            </div>

            {recommendations.length > 0 ? (
              <div className="recommendation-list">
                {recommendations.map((item, index) => (
                  <div className="recommendation-item" key={index}>
                    <div className="recommendation-number">{index + 1}</div>

                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No recommendations available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default ResumeAnalysis;
