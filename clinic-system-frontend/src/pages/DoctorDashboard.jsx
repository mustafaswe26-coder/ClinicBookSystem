import Navbar from "../components/Navbar";
import axios from "axios";
import {useEffect,useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {FiCalendar} from "react-icons/fi";
import {HiOutlineUsers} from "react-icons/hi";
import {MdOutlineDateRange} from "react-icons/md";

function DoctorDashboard(){

const [appointments,setAppointments]=useState([]);
const [date,setDate]=useState(new Date());

useEffect(()=>{

axios.get(
"http://localhost:5000/api/Appointments/doctor-appointments",
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then((response)=>{

setAppointments(response.data);

})
.catch((error)=>{

console.log(error);

});

},[]);

const todayAppointments=
appointments.length;

const weekAppointments=
appointments.length;

const monthAppointments=
appointments.length;

const filteredAppointments=
appointments.filter((appointment)=>{

const appointmentDate=
new Date();

return(
appointmentDate.getDate()===
date.getDate()
);

});

return(
<>
<Navbar />

<div className="doctor-dashboard">

<div className="doctor-dashboard-header">

<div>

<h1>
Dashboard
</h1>

<p>
Welcome Back Doctor 👨‍⚕️
</p>

</div>


</div>

<div className="dashboard-stats-grid">

<div className="dashboard-stat-card">

<div className="dashboard-stat-icon">

<FiCalendar />

</div>

<h2>
{todayAppointments}
</h2>

<p>
Today's Appointments
</p>

</div>

<div className="dashboard-stat-card">

<div className="dashboard-stat-icon">

<HiOutlineUsers />

</div>

<h2>
{weekAppointments}
</h2>

<p>
This Week
</p>

</div>

<div className="dashboard-stat-card">

<div className="dashboard-stat-icon">

<MdOutlineDateRange />

</div>

<h2>
{monthAppointments}
</h2>

<p>
This Month
</p>

</div>

</div>

<div className="dashboard-main-grid">

<div className="today-appointments-card">

<h2>
Appointments</h2>

<div className="today-appointments-list">

{
filteredAppointments.length===0 ? (

<div className="empty-appointments">

No Appointments On This Day

</div>

) : (

filteredAppointments.map(
(appointment,index)=>(

<div
className="appointment-row"
key={index}
>

<div className="appointment-time">

{appointment.time}

</div>

<div className="appointment-patient">

<h3>
{appointment.patient.fullName}
</h3>

<p>
Confirmed Appointment
</p>

</div>

<div className="appointment-status confirmed">

Confirmed

</div>

</div>

))
)
}

</div>

</div>

<div className="calendar-card">

<div className="calendar-top">

<h2>
Schedule Calendar
</h2>

</div>

<Calendar
onChange={setDate}
value={date}
/>

<div className="calendar-appointments">

<h3>
Upcoming Appointments
</h3>

{
appointments.slice(0,4).map(
(appointment,index)=>(

<div
className="calendar-appointment-item"
key={index}
>

<span>
{appointment.patient.fullName}
</span>

<small>
{appointment.time}
</small>

</div>

))
}

</div>

</div>

</div>

</div>
</>
);
}

export default DoctorDashboard;