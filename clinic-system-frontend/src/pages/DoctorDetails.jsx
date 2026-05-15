import Navbar from "../components/Navbar";
import doctor1 from "../assets/doctor1.png";
import { useParams } from "react-router-dom";



import axios from "axios";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function DoctorDetails() {

  const { id } = useParams();

  const [selectedSlot, setSelectedSlot] =
  useState(null);
  const [successMessage, setSuccessMessage] =
  useState("");
  
  const [doctor, setDoctor] =
    useState(null);

    const [slots, setSlots] =
  useState([]);
  
  const [selectedDate,setSelectedDate]=
useState(new Date());


const filteredSlots =
slots.filter((slot)=>{

const slotDate =
new Date(slot.startTime);

return(

slotDate.getDate() ===
selectedDate.getDate()

&&

slotDate.getMonth() ===
selectedDate.getMonth()

&&

slotDate.getFullYear() ===
selectedDate.getFullYear()

);

});


  useEffect(() => {

    axios
      .get(
        `http://localhost:5000/api/doctors/${id}`
      )
      .then((response) => {

        setDoctor(response.data);
        axios
  .get(
    `http://localhost:5000/api/DoctorSlots/available/${id}`
  )
  .then((response) => {

    setSlots(response.data);
if(response.data.length > 0){

setSelectedDate(
new Date(
response.data[0].startTime
)
);

}

  });

      })
      .catch((error) => {

        console.log(error);

      });

  }, [id]);

  if (!doctor) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="doctor-details-page">

        <div className="breadcrumb">
          Home
          <span>›</span>
          Doctors
          <span>›</span>
          {doctor.user.fullName}
        </div>

        <div className="doctor-details-container">

          {/* LEFT SIDE */}

          <div className="doctor-left">

            <div className="doctor-profile-card">

              <div className="doctor-profile-top">

                <img
                  src={doctor1}
                  alt={doctor.user.fullName}
                  className="details-doctor-image"
                />

                <div>

                  <h2>
                    {doctor.user.fullName}
                  </h2>

                  <p className="doctor-speciality">
                    {doctor.specialization}
                  </p>

                  <span>
                    MBBS, MD - {doctor.specialization}
                  </span>

                  <h3>
                    EGP {doctor.fees}
                  </h3>

                  <small>
                    Consultation Fee
                  </small>

                </div>

              </div>

              <div className="doctor-stats">

                <div>
                  <h4>10+</h4>
                  <p>Years Experience</p>
                </div>

                <div>
                  <h4>1000+</h4>
                  <p>Patients</p>
                </div>

                <div>
                  <h4>
                    {doctor.specialization}
                  </h4>

                  <p>Specialist</p>
                </div>

              </div>

              <div className="about-doctor">

                <h3>
                  About Doctor
                </h3>

                <p>
                  {doctor.user.fullName} is a highly
                  experienced {doctor.specialization}
                  specialist with years of experience
                  helping patients and providing
                  professional medical care.
                </p>

              </div>

              <div className="specialization-tags">

                <span>Medical Care</span>

                <span>Consultation</span>

                <span>Treatment</span>

                <span>
                  {doctor.specialization}
                </span>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="doctor-right">

            <div className="booking-card">

              <h2>
                Select Date & Time
              </h2>

              
<div className="calendar-box">

<Calendar

onChange={(date)=>setSelectedDate(date)}

value={selectedDate}

/>

</div>
            

              <div className="available-times">

                <h3>
                  Available Times
                </h3>

                <div className="times-grid">

                  {
filteredSlots.length===0 ? (

<div className="empty-slots">

No Available Appointments

</div>

) : (

filteredSlots.map((slot,index)=>(

<button
key={slot.id}

onClick={()=>
setSelectedSlot(slot.id)
}

className={
selectedSlot===slot.id
? "active-time"
: ""
}
>

{
new Date(slot.startTime)
.toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
)
}

</button>

))

)
}

                </div>

              </div>

{
  successMessage && (

    <div className="success-message">

      {successMessage}

    </div>

  )
}

              <button
  className="book-btn"

  onClick={() => {

    axios.post(
      "http://localhost:5000/api/Appointments/book-slot",

      {
        slotId: selectedSlot,
        patientId: 2
      }
    )
    .then(() => {

      setSuccessMessage(
  "Appointment Booked Successfully"
);

    })
    .catch((error) => {

      console.log(error);

    });

  }}
>
  Book Appointment
</button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default DoctorDetails;