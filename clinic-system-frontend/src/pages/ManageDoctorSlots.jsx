import Navbar from "../components/Navbar";

import axios from "axios";

import {
useEffect,
useState
} from "react";

import {
useParams
} from "react-router-dom";

function ManageDoctorSlots(){

const {doctorId}=
useParams();

const [slots,setSlots]=
useState([]);



useEffect(()=>{

axios.get(
`http://localhost:5000/api/DoctorSlots/doctor/${doctorId}`,
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then((response)=>{

setSlots(response.data);

})
.catch((error)=>{

console.log(error);

});

},[]);

return(
<>
<Navbar />

<div className="admin-dashboard">

<div className="manage-slots-top">

<button
className="back-slots-btn"

onClick={()=>{
window.location.href=
"/admin-slots";
}}
>

 Back To Doctors

</button>

</div>

<h1>
Manage Doctor Schedule
</h1>

<div className="admin-table-box">

<table>

<thead>

<tr>

<th>
Date
</th>

<th>
Time
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>

</thead>

<tbody>

{
slots.map((slot,index)=>(

<tr key={index}>

<td>

{
new Date(
slot.startTime
).toLocaleDateString()
}

</td>

<td>

{
new Date(
slot.startTime
).toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
)
}

</td>

<td>

{
slot.isAvailable
? "Available"
: "Disabled"
}

</td>

<td>

{
slot.isAvailable ? (

<button
className="cancel-btn"

onClick={()=>{

axios.patch(
`http://localhost:5000/api/DoctorSlots/${slot.id}/disable`,
{},
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then(()=>{

setSlots(
prev=>

prev.map((s)=>

s.id===slot.id

? {...s,isAvailable:false}

: s
)
);

});

}}
>

Disable

</button>

) : (

<button
className="complete-btn"

onClick={()=>{

axios.patch(
`http://localhost:5000/api/DoctorSlots/${slot.id}/enable`,
{},
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then(()=>{

setSlots(
prev=>

prev.map((s)=>

s.id===slot.id

? {...s,isAvailable:true}

: s
)
);

});

}}
>

Enable

</button>

)
}
</td>

</tr>

))
}

</tbody>

</table>

</div>

</div>

</>
);

}

export default ManageDoctorSlots;
