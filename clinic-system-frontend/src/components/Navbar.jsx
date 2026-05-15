import { Link }
  from "react-router-dom";

import {
  HashLink
} from "react-router-hash-link";

import {
  IoNotificationsOutline
} from "react-icons/io5";

import {
  FaUser
} from "react-icons/fa";

function Navbar() {

  const token =
    localStorage.getItem("token");

  const role =
    localStorage.getItem("role");

  return (

    <nav className="navbar">

      <div className="logo">
        MediCare+
      </div>

      <ul className="nav-links">

        {/* HOME / DASHBOARD */}

        <li>

          <Link
            to={
              role === "Admin"
                ? "/admin-dashboard"
                : "/"
            }
          >

            {
              role === "Admin"
                ? "Dashboard"
                : "Home"
            }

          </Link>

        </li>

        {/* SECOND LINK */}

        <li>

          <Link
            to={
              token

                ? role === "Doctor"

                  ? "/doctor-dashboard"

                  : role === "Admin"

                    ? "/admin-slots"

                    : "/doctors"

                : "/login"
            }
          >

            {
              role === "Doctor"

                ? "Dashboard"

                : role === "Admin"

                  ? "Admin Slots"

                  : "Doctors"
            }

          </Link>

        </li>

        {
          role !== "Admin" &&
          role !== "Doctor" && (

            <>

              <li>

                <HashLink smooth to="/#services">
                  Services
                </HashLink>

              </li>

              <li>

                <HashLink smooth to="/#about">
                  About Us
                </HashLink>

              </li>

              <li>

                <HashLink smooth to="/#contact">
                  Contact
                </HashLink>

              </li>

            </>

          )
        }

      </ul>

      {

        token ? (

          <div className="user-section">

            <div className="notification-icon">

              <IoNotificationsOutline />

            </div>

            <Link to="/account">

              <div className="user-profile">

                {
                  localStorage.getItem(
                    `profileImage_${localStorage.getItem("userId")}`
                  ) ? (

                    <img
                      src={
                        localStorage.getItem(
                          `profileImage_${localStorage.getItem("userId")}`
                        )
                      }
                      alt="Profile"
                      className="navbar-doctor-avatar"
                    />

                  ) : (

                    <div className="default-avatar">

                      <FaUser />

                    </div>

                  )
                }

              </div>

            </Link>

          </div>

        ) : (

          <div className="nav-buttons">

            <Link to="/login">

              <button className="login-btn">

                Login

              </button>

            </Link>

            <Link to="/register">

              <button className="signup-btn">

                Sign Up

              </button>

            </Link>

          </div>

        )

      }

    </nav>
  );
}

export default Navbar;