import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT SIDE */}

      <div className="auth-visual">
        <Link to="/" className="auth-brand">
          <span className="brand-mark">C</span>
          <span>
            Career<span>AI</span>
          </span>
        </Link>

        <div className="auth-visual-content">
          <div className="auth-eyebrow">
            <Sparkles size={14} />
            AI-powered career intelligence
          </div>

          <h1>
            Your next
            <br />
            career move
            <span> starts here.</span>
          </h1>

          <p>
            Pick up where you left off. Your resume insights, career roadmap and
            opportunities are waiting for you.
          </p>

          <div className="auth-mini-dashboard">
            <div className="mini-dashboard-top">
              <span>Career progress</span>

              <span className="mini-status">
                <i></i>
                AI Active
              </span>
            </div>

            <div className="mini-dashboard-score">
              <strong>84%</strong>

              <span>Profile strength</span>
            </div>

            <div className="mini-progress">
              <div></div>
            </div>

            <div className="mini-dashboard-bottom">
              <div>
                <span>Career match</span>
                <strong>92%</strong>
              </div>

              <div>
                <span>Skills ready</span>
                <strong>18</strong>
              </div>

              <div>
                <span>Roadmap</span>
                <strong>67%</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-visual-footer">
          <span>Career AI</span>
          <span>Build with clarity.</span>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="mobile-auth-brand">
            <Link to="/" className="auth-brand">
              <span className="brand-mark">C</span>
              <span>
                Career<span>AI</span>
              </span>
            </Link>
          </div>

          <div className="auth-heading">
            <span className="auth-small-label">WELCOME BACK</span>

            <h2>
              Sign in to
              <br />
              Career AI.
            </h2>

            <p>Continue building your career with AI-powered insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* EMAIL */}

            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <div className="input-wrapper">
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* SUBMIT */}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span></span>
            <small>OR</small>
            <span></span>
          </div>

          <p className="auth-register">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </p>

          <p className="auth-terms">
            By continuing, you agree to Career AI's
            <span> Terms of Service </span>
            and
            <span> Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
