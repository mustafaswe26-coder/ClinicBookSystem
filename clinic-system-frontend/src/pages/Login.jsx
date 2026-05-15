import Navbar from "../components/Navbar";

import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = () => {

    axios.post(
      "http://localhost:5000/api/Auth/login",

      {
        email,
        password
      }
    )
    .then((response) => {

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "userId",
        response.data.userId
      );

      localStorage.setItem(
  "userName",
  response.data.fullName
);

      if (
  response.data.role ===
  "Doctor"
) {

  navigate(
    "/doctor-dashboard"
  );

} else if (
  response.data.role ===
  "Admin"
) {

  navigate(
    "/admin-dashboard"
  );

} else {

  navigate("/");

}

    })
    .catch(() => {

      setError(
        "Invalid Email Or Password"
      );

    });

  };

  return (
    <>
      <Navbar />

      <div className="login-page">

        <div className="login-card">

          <h1>
            Login
          </h1>

          <p>
            Welcome Back
          </p>

          <input
            type="email"
            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {
            error && (
              <div className="login-error">
                {error}
              </div>
            )
          }

          <button onClick={handleLogin}>
            Login
          </button>

        </div>

      </div>
    </>
  );
}

export default Login;