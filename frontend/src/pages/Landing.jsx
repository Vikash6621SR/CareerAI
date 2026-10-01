import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Landing() {
  return (
    <div className="landing-page">
      <Navbar />

      {/* HERO */}

      <main>
        <section className="hero">
          <div className="hero-background">
            <div className="hero-orb hero-orb-one"></div>
            <div className="hero-orb hero-orb-two"></div>
          </div>

          <div className="hero-content">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              AI-powered career intelligence
            </div>

            <h1>
              Your career,
              <br />
              <span>decoded by AI.</span>
            </h1>

            <p className="hero-description">
              Career AI helps you understand your resume, discover the right
              opportunities, identify missing skills, and build a clear path
              toward your next role.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-button">
                Build your career path
                <ArrowRight size={18} />
              </Link>

              <a href="#how-it-works" className="secondary-button">
                See how it works
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>V</span>
                <span>A</span>
                <span>R</span>
                <span>+</span>
              </div>

              <div>
                <strong>One workspace for your career</strong>
                <small>Resume analysis · Job matching · Skill roadmap</small>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="hero-dashboard">
            <div className="dashboard-window">
              <div className="window-top">
                <div className="window-dots">
                  <i></i>
                  <i></i>
                  <i></i>
                </div>

                <span>Career overview</span>

                <div className="window-profile">VS</div>
              </div>

              <div className="dashboard-body">
                <div className="dashboard-heading">
                  <div>
                    <span className="small-label">YOUR CAREER SNAPSHOT</span>

                    <h3>Good morning, Vikash</h3>
                  </div>

                  <div className="ai-status">
                    <Sparkles size={14} />
                    AI Active
                  </div>
                </div>

                <div className="dashboard-grid">
                  <div className="score-card">
                    <div className="score-top">
                      <span>Resume strength</span>
                      <FileText size={18} />
                    </div>

                    <div className="score">
                      84<span>/100</span>
                    </div>

                    <div className="progress">
                      <div style={{ width: "84%" }}></div>
                    </div>

                    <small>Strong profile with room to improve</small>
                  </div>

                  <div className="match-card">
                    <div className="match-icon">
                      <Target size={18} />
                    </div>

                    <span>Career match</span>

                    <strong>92%</strong>

                    <small>Full Stack Developer</small>
                  </div>

                  <div className="skills-card">
                    <div className="skills-heading">
                      <span>Skill readiness</span>
                      <TrendingUp size={17} />
                    </div>

                    <div className="skill-row">
                      <span>React</span>
                      <div className="mini-progress">
                        <div style={{ width: "92%" }}></div>
                      </div>
                      <b>92</b>
                    </div>

                    <div className="skill-row">
                      <span>Java</span>
                      <div className="mini-progress">
                        <div style={{ width: "81%" }}></div>
                      </div>
                      <b>81</b>
                    </div>

                    <div className="skill-row">
                      <span>Spring Boot</span>
                      <div className="mini-progress">
                        <div style={{ width: "74%" }}></div>
                      </div>
                      <b>74</b>
                    </div>
                  </div>
                </div>

                <div className="recommendation">
                  <div className="recommendation-icon">
                    <Sparkles size={18} />
                  </div>

                  <div className="recommendation-content">
                    <span>AI recommendation</span>
                    <strong>Strengthen your cloud skills next.</strong>
                    <p>
                      AWS fundamentals could improve your match with 18
                      additional roles.
                    </p>
                  </div>

                  <button>
                    <ArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}

        <section className="intro-section" id="features">
          <div className="section-label">
            <span>01</span>
            Everything in one place
          </div>

          <div className="intro-grid">
            <h2>
              Stop guessing
              <br />
              <span>what comes next.</span>
            </h2>

            <p>
              Your resume tells your story. Your skills shape your future.
              Career AI connects the two and turns them into actionable career
              decisions.
            </p>
          </div>
        </section>

        {/* FEATURES */}

        <section className="features-section">
          <div className="feature-card feature-large">
            <div className="feature-number">01</div>

            <div className="feature-icon">
              <FileText size={22} />
            </div>

            <div className="feature-content">
              <h3>Understand your resume</h3>

              <p>
                Upload your resume and let AI analyze your experience, skills,
                strengths, gaps and career positioning.
              </p>

              <div className="feature-list">
                <span>
                  <Check size={15} />
                  Resume analysis
                </span>

                <span>
                  <Check size={15} />
                  Skill extraction
                </span>

                <span>
                  <Check size={15} />
                  Improvement suggestions
                </span>
              </div>
            </div>
          </div>

          <div className="feature-card orange-card">
            <div className="feature-number">02</div>

            <div className="feature-icon light-icon">
              <Target size={22} />
            </div>

            <div className="feature-content">
              <h3>Find where you fit</h3>

              <p>
                Compare your profile against opportunities and understand where
                your current skills can take you.
              </p>
            </div>

            <div className="floating-match">
              <span>Match</span>
              <strong>92%</strong>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-number">03</div>

            <div className="feature-icon">
              <TrendingUp size={22} />
            </div>

            <div className="feature-content">
              <h3>Build your roadmap</h3>

              <p>
                Turn skill gaps into a personalized learning path with clear
                milestones and practical next steps.
              </p>
            </div>

            <div className="roadmap-preview">
              <span className="roadmap-active"></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section className="process-section" id="how-it-works">
          <div className="section-label">
            <span>02</span>
            How Career AI works
          </div>

          <h2>
            From profile
            <br />
            <span>to direction.</span>
          </h2>

          <div className="process-grid">
            <div className="process-step">
              <span>01</span>
              <h3>Upload</h3>
              <p>
                Add your resume and tell Career AI what kind of role you want to
                pursue.
              </p>
            </div>

            <div className="process-line"></div>

            <div className="process-step">
              <span>02</span>
              <h3>Analyze</h3>
              <p>
                AI understands your experience, skills and career opportunities.
              </p>
            </div>

            <div className="process-line"></div>

            <div className="process-step">
              <span>03</span>
              <h3>Act</h3>
              <p>
                Follow your personalized roadmap and make your next career move
                with clarity.
              </p>
            </div>
          </div>
        </section>

        {/* AI SECTION */}

        <section className="ai-section" id="ai">
          <div className="ai-content">
            <div className="section-label light-label">
              <span>03</span>
              Your AI career analyst
            </div>

            <h2>
              Ask better
              <br />
              career questions.
            </h2>

            <p>
              Instead of searching through endless advice, talk directly to an
              AI assistant that understands your career profile.
            </p>

            <Link to="/register" className="ai-button">
              Meet your AI assistant
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="ai-chat">
            <div className="chat-header">
              <div className="chat-avatar">
                <Sparkles size={17} />
              </div>

              <div>
                <strong>Career AI</strong>
                <span>Career Analyst</span>
              </div>

              <div className="online-dot"></div>
            </div>

            <div className="chat-message user-message">
              What should I learn next to become a stronger full stack
              developer?
            </div>

            <div className="chat-message ai-message">
              Based on your current profile, I would focus on cloud deployment
              and advanced Spring Boot next.
              <br />
              <br />
              That combination can strengthen your backend profile while
              complementing your existing React skills.
            </div>

            <div className="chat-input">
              <span>Ask Career AI anything...</span>
              <button>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="final-cta">
          <div className="cta-orb"></div>

          <div className="section-label">
            <span>04</span>
            Start building
          </div>

          <h2>
            Your next move
            <br />
            starts here.
          </h2>

          <p>Build a clearer picture of where you are and where you can go.</p>

          <Link to="/register" className="primary-button cta-button">
            Create your Career AI profile
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="footer">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">C</span>
            <span>
              Career<span>AI</span>
            </span>
          </Link>

          <p>AI-powered clarity for your career.</p>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#ai">AI Assistant</a>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-copy">© 2026 Career AI</div>
      </footer>
    </div>
  );
}

export default Landing;
