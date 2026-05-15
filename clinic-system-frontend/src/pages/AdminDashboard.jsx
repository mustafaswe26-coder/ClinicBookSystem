import Navbar from "../components/Navbar";

import axios from "axios";

import {useEffect,useState} from "react";

import {
FaUserMd
} from "react-icons/fa";

import {
MdOutlineDateRange
} from "react-icons/md";

import {
HiOutlineUsers
} from "react-icons/hi";

import {
Link
} from "react-router-dom";


function AdminDashboard(){

const [appointments,setAppointments]=
useState([]);

useEffect(()=>{

axios.get(
"http://localhost:5000/api/Appointments",
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

const upcomingAppointments=
appointments.filter(
(a)=>a.status==="Confirmed"
);

const completedAppointments=
appointments.filter(
(a)=>a.status==="Completed"
);

const cancelledAppointments=
appointments.filter(
(a)=>a.status==="Cancelled"
);

return(
<>
<Navbar />

<div className="admin-main-dashboard">

<div className="admin-dashboard-top">

<div>

<h1>
Admin Dashboard
</h1>

<p>
Manage Clinic Appointments
</p>

</div>

<Link to="/admin-management">

<button className="management-btn">

Management Dashboard

</button>

</Link>

</div>

<div className="admin-dashboard-stats">

<div className="admin-dashboard-card">

<div className="admin-dashboard-icon blue">

<MdOutlineDateRange />

</div>

<div>

<h2>
{upcomingAppointments.length}
</h2>

<p>
Upcoming Appointments
</p>

</div>

</div>

<div className="admin-dashboard-card">

<div className="admin-dashboard-icon green">

<FaUserMd />

</div>

<div>

<h2>
{completedAppointments.length}
</h2>

<p>
Completed Appointments
</p>

</div>

</div>

<div className="admin-dashboard-card">

<div className="admin-dashboard-icon purple">

<HiOutlineUsers />

</div>

<div>

<h2>
{
new Set(
appointments.map(
a=>a.doctor?.fullName
)
).size
}
</h2>

<p>
Doctors Consulted
</p>

</div>

</div>

<div className="admin-dashboard-card">

<div className="admin-dashboard-icon red">

<MdOutlineDateRange />

</div>

<div>

<h2>
{cancelledAppointments.length}
</h2>

<p>
Cancelled Appointments
</p>

</div>

</div>

</div>

<div className="admin-appointments-section">

<h2>
Upcoming Appointments
</h2>

{
upcomingAppointments.map(
(appointment,index)=>(

<div
className="admin-appointment-card"
key={index}
>

<div className="admin-appointment-left">

<div className="admin-appointment-avatar">

<FaUserMd />

</div>

<div>

<h3>
Dr. {appointment.doctor?.fullName}
</h3>

<p>
Patient:
{appointment.patient?.fullName}
</p>

</div>

</div>

<div className="admin-appointment-date">

<p>

{
new Date(
appointment.appointmentDate
).toLocaleDateString()
}

</p>

<small>

{
new Date(
appointment.appointmentDate
).toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
)
}

</small>

</div>

<div className="appointment-badge upcoming">

Upcoming

</div>

<div className="admin-appointment-actions">

<button
className="complete-btn"

onClick={()=>{

axios.patch(
`http://localhost:5000/api/Appointments/${appointment.id}/status`,
{
status:"Completed"
},
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then(()=>{

setAppointments(
prev=>

prev.map((a)=>

a.id===appointment.id

? {...a,status:"Completed"}

: a
)
);

});

}}
>

Complete

</button>

<button
className="cancel-btn"

onClick={()=>{

axios.patch(
`http://localhost:5000/api/Appointments/${appointment.id}/status`,
{
status:"Cancelled"
},
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then(()=>{

setAppointments(
prev=>

prev.map((a)=>

a.id===appointment.id

? {...a,status:"Cancelled"}

: a
)
);

});

}}
>

No Show

</button>

</div>

</div>

))
}

</div>

</div>

</>
);

}

export default AdminDashboard;