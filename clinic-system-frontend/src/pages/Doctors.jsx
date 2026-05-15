import Navbar from "../components/Navbar";



import { Link } from "react-router-dom";

import axios from "axios";

import Select from "react-select";

import {
  useEffect,
  useState
} from "react";

import doctor1 from "../assets/doctor1.png";
import doctor2 from "../assets/doctor2.png";
import doctor3 from "../assets/doctor3.png";
import doctor4 from "../assets/doctor4.png";
import doctor5 from "../assets/doctor5.png";
const doctorImages = [
  doctor1,
  doctor2,
  doctor3,
  doctor4,
  doctor5
];
function Doctors() {



  const [currentPage, setCurrentPage] =
    useState(1);

  const [doctors, setDoctors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [specialization,
    setSpecialization] =
    useState("");

  const specialtyOptions = [

    {
      value: "",
      label: "All Specialties"
    },

    {
      value: "Cardiology",
      label: "Cardiology"
    },

    {
      value: "Dermatology",
      label: "Dermatology"
    },

    {
      value: "Neurology",
      label: "Neurology"
    },

    {
      value: "Orthopedics",
      label: "Orthopedics"
    },

    {
      value: "Dentistry",
      label: "Dentistry"
    }
  ];

  useEffect(() => {

    axios
      .get(
        "http://localhost:5000/api/doctors?pageSize=100"
      )
      .then((response) => {

        setDoctors(response.data.data);

      })
      .catch((error) => {

        console.log(error);

      });

  }, []);

  const filteredDoctors =
    doctors.filter((doctor) => {

      const matchesSearch =
        doctor.user.fullName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesSpecialization =
        specialization === "" ||

        doctor.specialization ===
        specialization;

      return (
        matchesSearch &&
        matchesSpecialization
      );
    });

  const displayedDoctors =
    currentPage === 1
      ? filteredDoctors.slice(0, 6)
      : filteredDoctors.slice(6, 12);

  return (
    <>
      <Navbar />

      <div className="doctors-page">

        <div className="page-top">

          <h1>
            Find Doctors
          </h1>

          <div className="breadcrumb">

            Home

            <span>›</span>

            Doctors

          </div>

        </div>

        <div className="doctors-search">

          <input
            type="text"

            placeholder="Search doctors..."

            value={search}

            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <Select

            options={specialtyOptions}

            placeholder="All Specialties"

            onChange={(selectedOption) =>
              setSpecialization(
                selectedOption.value
              )
            }

            styles={{

              control: (
                base,
                state
              ) => ({

                ...base,

                padding: "8px",

                borderRadius: "14px",

                borderColor:
                  state.isFocused
                    ? "#2563eb"
                    : "#dbeafe",

                boxShadow:
                  state.isFocused
                    ? "0 0 0 4px rgba(37,99,235,0.15)"
                    : "none",

                transition: "0.3s",

                cursor: "pointer",

                "&:hover": {

                  borderColor:
                    "#2563eb"
                }
              }),

              option: (
                base,
                state
              ) => ({

                ...base,

                background:
                  state.isFocused
                    ? "#eff6ff"
                    : "white",

                color: "#0f172a",

                padding: "14px",

                cursor: "pointer"
              }),

              menu: (base) => ({

                ...base,

                borderRadius: "14px",

                overflow: "hidden",

                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)"
              })
            }}
          />

        </div>

        <div className="doctors-grid">

          {displayedDoctors.map(
            (doctor, index) => (

              <div
                className="doctor-card"

                key={index}
              >

                <div className="doctor-top">

                  <img
                    src={
                      doctorImages[
                      index % doctorImages.length
                      ]
                    }
                    alt={doctor.user.fullName}
                    className="doctor-image"
                  />

                  <div className="doctor-info">

                    <h3>
                      {doctor.user.fullName}
                    </h3>

                    <p>
                      {doctor.specialization}
                    </p>

                    <span>
                      MBBS, MD -
                      {" "}
                      {doctor.specialization}
                    </span>

                  </div>

                </div>

                <h4>
                  EGP {doctor.fees}
                </h4>

                <Link
                  to={`/doctors/${doctor.id}`}
                >

                  <button>
                    View Profile
                  </button>

                </Link>

              </div>

            ))}

        </div>

        <div className="pagination">

          <button
            className={
              currentPage === 1
                ? "active-page"
                : ""
            }

            onClick={() =>
              setCurrentPage(1)
            }
          >
            1
          </button>

          <button
            className={
              currentPage === 2
                ? "active-page"
                : ""
            }

            onClick={() =>
              setCurrentPage(2)
            }
          >
            2
          </button>

        </div>

      </div>
    </>
  );
}

export default Doctors;