import Navbar from "../components/Navbar";
import { FaUserMd } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { MdDateRange } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

function AdminManagement() {

    const [doctors, setDoctors] =
        useState([]);

    const [patients, setPatients] =
        useState([]);

    const [appointments, setAppointments] =
        useState([]);

    const [doctorSearch,
        setDoctorSearch] =
        useState("");

    const [patientSearch,
        setPatientSearch] =
        useState("");

    const [appointmentSearch,
        setAppointmentSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [patientPage,
        setPatientPage] =
        useState(1);

    const [appointmentPage,
        setAppointmentPage] =
        useState(1);

    const pageSize = 6;

    const [totalPages,
        setTotalPages] =
        useState(1);

    const [showAddDoctor,
        setShowAddDoctor] =
        useState(false);

    const [doctorData,
        setDoctorData] =
        useState({
            fullName: "",
            email: "",
            password: "",
            phone: "",
            specialization: "",
            fees: ""
        });

    const [doctorMessage,
        setDoctorMessage] =
        useState("");

    const [doctorCount,
        setDoctorCount] =
        useState(0);

    const fetchDoctors = () => {

        axios.get(
            `http://localhost:5000/api/Doctors?page=${page}&pageSize=${pageSize}&specialization=${doctorSearch}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then((response) => {

                setDoctors(
                    response.data.data || []
                );

                setDoctorCount(
                    response.data.totalCount
                );

                setTotalPages(
                    Math.ceil(
                        response.data.totalCount /
                        pageSize
                    )
                );

            })
            .catch((error) => {

                console.log(error);

            });

    };

    useEffect(() => {

        fetchDoctors();

        axios.get(
            "http://localhost:5000/api/Auth/all-users",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then((response) => {

                const allUsers =
                    response.data;

                setPatients(

                    allUsers.filter(
                        (user) =>
                            user.role === "Patient"
                    )

                );

            })
            .catch((error) => {

                console.log(error);

            });

        axios.get(
            "http://localhost:5000/api/Appointments",
            {
                headers: {
                    Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then((response) => {

                setAppointments(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })
            .catch((error) => {

                console.log(error);

            });

    }, [page, doctorSearch]);

    const filteredPatients =
        patients.filter((patient) =>

            patient.fullName
                .toLowerCase()
                .includes(
                    patientSearch.toLowerCase()
                )

            ||

            patient.email
                .toLowerCase()
                .includes(
                    patientSearch.toLowerCase()
                )

        );

    const filteredAppointments =
        appointments.filter((appointment) =>

            appointment.doctor?.fullName
                .toLowerCase()
                .includes(
                    appointmentSearch.toLowerCase()
                )

            ||

            appointment.patient?.fullName
                .toLowerCase()
                .includes(
                    appointmentSearch.toLowerCase()
                )

        );

    const paginatedPatients =
        filteredPatients.slice(
            (patientPage - 1) * pageSize,
            patientPage * pageSize
        );

    const paginatedAppointments =
        filteredAppointments.slice(
            (appointmentPage - 1) * pageSize,
            appointmentPage * pageSize
        );

    return (
        <>
            <Navbar />

            <div className="admin-management-header">

                <h1>
                    Management Page
                </h1>

                <Link to="/admin-dashboard">

                    <button className="back-dashboard-btn">

                        Back To Dashboard

                    </button>

                </Link>

            </div>

            <div className="admin-dashboard">

                <div className="admin-stats-grid">

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">

                            <FaUserMd />

                        </div>

                        <h2>
                            {doctorCount}
                        </h2>

                        <p>
                            Doctors
                        </p>

                    </div>

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">

                            <HiUsers />

                        </div>

                        <h2>
                            {patients.length}
                        </h2>

                        <p>
                            Patients
                        </p>

                    </div>

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">

                            <MdDateRange />

                        </div>

                        <h2>
                            {appointments.length}
                        </h2>

                        <p>
                            Appointments
                        </p>

                    </div>

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">

                            <FiDollarSign />

                        </div>

                    </div>

                </div>

                <div className="admin-management-header">

                    <h2>
                        Doctors
                    </h2>

                    <button
                        className="management-btn"

                        onClick={() =>
                            setShowAddDoctor(true)
                        }
                    >

                        + Add Doctor

                    </button>

                </div>

                <div className="admin-table-box">

                    <div className="admin-search-box2">

                        <input
                            type="text"

                            placeholder=
                            "Search doctor by name or phone"

                            value={doctorSearch}

                            onChange={(e) => {

                                setDoctorSearch(
                                    e.target.value
                                );

                                setPage(1);

                            }}
                        />

                    </div>

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Specialization
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                doctors.map((doctor, index) => (

                                    <tr key={index}>

                                        <td>
                                            {doctor.user.fullName}
                                        </td>

                                        <td>
                                            {doctor.specialization}
                                        </td>

                                        <td>
                                            {doctor.phone || "No Phone"}
                                        </td>

                                        <td>

                                            <button
                                                className="admin-delete-btn"

                                                onClick={() => {

                                                    axios.delete(
                                                        `http://localhost:5000/api/Doctors/${doctor.id}`,
                                                        {
                                                            headers: {
                                                                Authorization:
                                                                    `Bearer ${localStorage.getItem("token")}`
                                                            }
                                                        }
                                                    )
                                                        .then(() => {

                                                            setDoctors(
                                                                prev => prev.filter(
                                                                    d => d.id !== doctor.id
                                                                )
                                                            );

                                                        })
                                                        .catch((error) => {

                                                            console.log(error);

                                                        });

                                                }}
                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                    <Pagination
                        page={page}
                        setPage={setPage}
                        totalPages={totalPages}
                    />

                </div>

                <div className="admin-table-box">

                    <h2>
                        Patients
                    </h2>

                    <div className="admin-search-box2">

                        <input
                            type="text"

                            placeholder=
                            "Search patient"

                            value={patientSearch}

                            onChange={(e) =>
                                setPatientSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                paginatedPatients.map((patient, index) => (

                                    <tr key={index}>

                                        <td>
                                            {patient.fullName}
                                        </td>

                                        <td>
                                            {patient.email}
                                        </td>

                                        <td>
                                            {patient.phone || "No Phone"}
                                        </td>

                                        <td>

                                            <button
                                                className="admin-delete-btn"

                                                onClick={() => {

                                                    axios.delete(
                                                        `http://localhost:5000/api/Auth/delete-user/${patient.id}`,
                                                        {
                                                            headers: {
                                                                Authorization:
                                                                    `Bearer ${localStorage.getItem("token")}`
                                                            }
                                                        }
                                                    )
                                                        .then(() => {

                                                            setPatients(
                                                                prev => prev.filter(
                                                                    p => p.id !== patient.id
                                                                )
                                                            );

                                                        })
                                                        .catch((error) => {

                                                            console.log(error);

                                                        });

                                                }}
                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                    <Pagination
                        page={patientPage}
                        setPage={setPatientPage}
                        totalPages={
                            Math.ceil(
                                filteredPatients.length /
                                pageSize
                            )
                        }
                    />

                </div>

                <div className="admin-table-box">

                    <h2>
                        Appointments
                    </h2>

                    <div className="admin-search-box2">

                        <input
                            type="text"

                            placeholder=
                            "Search appointment"

                            value={appointmentSearch}

                            onChange={(e) =>
                                setAppointmentSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Doctor
                                </th>

                                <th>
                                    Patient
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Time
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {
                                paginatedAppointments.map((appointment, index) => (

                                    <tr key={index}>

                                        <td>
                                            {appointment.doctor?.fullName}
                                        </td>

                                        <td>
                                            {appointment.patient?.fullName}
                                        </td>

                                        <td>
                                            {
                                                new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleDateString()
                                            }
                                        </td>

                                        <td>
                                            {
                                                new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )
                                            }
                                        </td>

                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                    <Pagination
                        page={appointmentPage}
                        setPage={setAppointmentPage}
                        totalPages={
                            Math.ceil(
                                filteredAppointments.length /
                                pageSize
                            )
                        }
                    />

                </div>

            </div>

            {
                showAddDoctor && (

                    <div className="doctor-modal-overlay">

                        <div className="doctor-modal">

                            <h2>
                                Add New Doctor
                            </h2>

                            {
                                doctorMessage && (

                                    <p className="doctor-success-message">

                                        {doctorMessage}

                                    </p>

                                )
                            }

                            <input
                                type="text"
                                placeholder="Full Name"

                                value={doctorData.fullName}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        fullName: e.target.value
                                    })
                                }
                            />

                            <input
                                type="email"
                                placeholder="Email"

                                value={doctorData.email}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        email: e.target.value
                                    })
                                }
                            />

                            <input
                                type="password"
                                placeholder="Password"

                                value={doctorData.password}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        password: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Phone"

                                value={doctorData.phone}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        phone: e.target.value
                                    })
                                }
                            />

                            <input
                                type="text"
                                placeholder="Specialization"

                                value={doctorData.specialization}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        specialization: e.target.value
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Fees"

                                value={doctorData.fees}

                                onChange={(e) =>
                                    setDoctorData({
                                        ...doctorData,
                                        fees: e.target.value
                                    })
                                }
                            />

                            <div className="doctor-modal-actions">

                                <button
                                    className="cancel-btn"

                                    onClick={() =>
                                        setShowAddDoctor(false)
                                    }
                                >

                                    Cancel

                                </button>

                                <button
                                    className="complete-btn"

                                    onClick={() => {

                                        axios.post(
                                            "http://localhost:5000/api/Auth/add-doctor",

                                            {
                                                ...doctorData,
                                                role: "Doctor"
                                            },

                                            {
                                                headers: {
                                                    Authorization:
                                                        `Bearer ${localStorage.getItem("token")}`
                                                }
                                            }
                                        )

                                            .then(() => {

                                                setDoctorMessage(
                                                    "Doctor added successfully"
                                                );

                                                setDoctorData({
                                                    fullName: "",
                                                    email: "",
                                                    password: "",
                                                    phone: "",
                                                    specialization: "",
                                                    fees: ""
                                                });

                                                fetchDoctors();

                                                setTimeout(() => {

                                                    setShowAddDoctor(false);

                                                    setDoctorMessage("");

                                                }, 1500);

                                            })

                                            .catch((error) => {

                                                console.log(error);

                                                alert(
                                                    error.response?.data ||
                                                    "Failed to add doctor"
                                                );

                                            });

                                    }}
                                >

                                    Add Doctor

                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </>
    );
}

export default AdminManagement;