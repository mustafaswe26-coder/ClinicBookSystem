import Navbar from "../components/Navbar";
import doctorImage from "../assets/doctor.png";
import Specialties from "../components/Specialties";
import HowItWorks from "../components/HowItWorks";
import { Link }
  from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <div className="hero">
        <div className="hero-left">
          <h1>
            Find The Best <br />
            Doctors & Book <br />
            Appointment
          </h1>

          <p>
            MediCare+ helps you find the best
            doctors, check their availability
            and book appointments with ease.
          </p>

          <Link
            to={
              localStorage.getItem("token")
                ? "/doctors"
                : "/login"
            }
          >

            <button className="book-now-btn">

              Book Now

            </button>

          </Link>

          <div className="hero-stats">
            <div>
              <h3>10k+</h3>
              <p>Happy Patients</p>
            </div>

            <div>
              <h3>500+</h3>
              <p>Expert Doctors</p>
            </div>

            <div>
              <h3>24/7</h3>
              <p>Support</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <img
            src={doctorImage}
            alt="Doctor"
            className="hero-image"
          />
        </div>
      </div>

      <Specialties />

      <HowItWorks />

      <Footer />

    </>
  );
}

export default Home;