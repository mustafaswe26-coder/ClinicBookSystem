import Navbar from "../components/Navbar";

import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword,
    setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleRegister = () => {

    if (
  !fullName ||
  !email ||
  !phone ||
  !password ||
  !confirmPassword
) {

  setError(
    "All Fields Are Required"
  );

  return;
}

const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com$/;

if (!emailRegex.test(email)) {

  setError(
    "Invalid Email Address"
  );

  return;
}

if (phone.length !== 11) {

  setError(
    "Phone Number Must Be 11 Digits"
  );

  return;
}

if (password.length < 8) {

  setError(
    "Password Must Be At Least 8 Characters"
  );

  return;
}

    if (password !== confirmPassword) {

      setError(
        "Passwords Do Not Match"
      );

      return;
    }

    axios.post(
      "http://localhost:5000/api/Auth/register",

      {
  fullName,
  email,
  phone,
  password,
  role: "Patient"
}
    )
    .then(() => {

      navigate("/login");

    })
    .catch(() => {

      setError(
        "Registration Failed"
      );

    });

  };

  return (
    <>
      <Navbar />

      <div className="login-page">

        <div className="login-card">

          <h1>
            Sign Up
          </h1>

          <p>
            Create Your Account
          </p>

          <input
            type="text"
            placeholder="Full Name"

            value={fullName}

            onChange={(e) =>
              setFullName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="text"
            placeholder="Phone Number"

            value={phone}

            onChange={(e) =>
              setPhone(e.target.value)
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

          <input
            type="password"
            placeholder="Confirm Password"

            value={confirmPassword}

            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          {
            error && (
              <div className="login-error">
                {error}
              </div>
            )
          }

          <button onClick={handleRegister}>
            Create Account
          </button>

        </div>

      </div>
    </>
  );
}

export default Register;