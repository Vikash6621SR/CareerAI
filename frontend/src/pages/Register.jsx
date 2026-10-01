import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

function Register() {
  const { register } = useAuth();

  const navigate = useNavigate();

  /*
  =========================================================
  STATE
  =========================================================
  */

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /*
  =========================================================
  HANDLE INPUT CHANGE
  =========================================================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    /*
    Clear messages while user is typing.
    */

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  /*
  =========================================================
  HANDLE REGISTER
  =========================================================
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    Clear previous messages.
    */

    setError("");
    setSuccess("");

    /*
    Prevent duplicate requests.
    */

    if (loading) {
      return;
    }

    /*
    =======================================================
    VALIDATION
    =======================================================
    */

    const name = formData.name.trim();

    const email = formData.email.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /*
    =======================================================
    START LOADING
    =======================================================
    */

    setLoading(true);

    try {
      /*
      =====================================================
      SEND DATA TO BACKEND
      =====================================================
      */

      await register({
        name: name,

        email: email,

        password: formData.password,
      });

      /*
      =====================================================
      SUCCESS
      =====================================================
      */

      setSuccess("Account created successfully. Redirecting to login...");

      /*
      Clear form.
      */

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      /*
      =====================================================
      REDIRECT
      =====================================================
      */

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      /*
      =====================================================
      EXTRACT BACKEND ERROR
      =====================================================
      */

      let message = "Unable to create your account. Please try again.";

      if (error?.response?.data) {
        const data = error.response.data;

        if (typeof data === "string") {
          message = data;
        } else if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else if (data.details) {
          message = data.details;
        }
      } else if (error?.message) {
        message = error.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <div className="auth-page register-page">
      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <div className="auth-visual">
        {/* BRAND */}

        <Link to="/" className="auth-brand">
          <span className="brand-mark">C</span>

          <span>
            Career<span>AI</span>
          </span>
        </Link>

        {/* VISUAL CONTENT */}

        <div className="auth-visual-content">
          <div className="auth-eyebrow">
            <Sparkles size={14} />
            Start your career journey
          </div>

          <h1>
            Build a career
            <br />
            with <span>direction.</span>
          </h1>

          <p>
            Create your Career AI profile and turn your experience, skills and
            goals into a personalized career roadmap.
          </p>

          {/* BENEFITS */}

          <div className="register-benefits">
            <div className="register-benefit">
              <div>
                <Check size={15} />
              </div>

              <span>AI-powered resume analysis</span>
            </div>

            <div className="register-benefit">
              <div>
                <Check size={15} />
              </div>

              <span>Personalized career roadmap</span>
            </div>

            <div className="register-benefit">
              <div>
                <Check size={15} />
              </div>

              <span>Intelligent job matching</span>
            </div>

            <div className="register-benefit">
              <div>
                <Check size={15} />
              </div>

              <span>AI career assistant</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="auth-visual-footer">
          <span>Career AI</span>

          <span>Build with clarity.</span>
        </div>
      </div>

      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* =================================================
              MOBILE LOGO
          ================================================= */}

          <div className="mobile-auth-brand">
            <Link to="/" className="auth-brand">
              <span className="brand-mark">C</span>

              <span>
                Career<span>AI</span>
              </span>
            </Link>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="auth-heading">
            <span className="auth-small-label">CREATE YOUR PROFILE</span>

            <h2>
              Start your
              <br />
              career journey.
            </h2>

            <p>
              Create your account and let Career AI understand where you want to
              go.
            </p>
          </div>

          {/* =================================================
              ERROR MESSAGE
          ================================================= */}

          {error && <div className="auth-error">{error}</div>}

          {/* =================================================
              SUCCESS MESSAGE
          ================================================= */}

          {success && <div className="auth-success">{success}</div>}

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* =================================================
                NAME
            ================================================= */}

            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

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
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* =================================================
                CONFIRM PASSWORD
            ================================================= */}

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm password</label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* =================================================
              LOGIN
          ================================================= */}

          <p className="auth-register register-login">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>

          {/* =================================================
              TERMS
          ================================================= */}

          <p className="auth-terms">
            By creating an account, you agree to Career AI's
            <span> Terms of Service </span>
            and
            <span> Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
