import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  const location = useLocation();

  /*
   * Wait until authentication state
   * has been restored.
   */
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f8f7",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#171717",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              border: "3px solid #e5e5e5",
              borderTopColor: "#ff6b00",
              borderRadius: "50%",
              animation: "careerAuthSpin .8s linear infinite",
            }}
          />

          <span>Loading Career AI...</span>
        </div>

        <style>
          {`
            @keyframes careerAuthSpin {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    );
  }

  /*
   * User is not authenticated.
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  /*
   * User is authenticated.
   */
  return <Outlet />;
};

export default ProtectedRoute;
