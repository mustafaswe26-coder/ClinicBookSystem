import Navbar from "../components/Navbar";

import axios from "axios";

import {
useEffect,
useState
} from "react";

function AdminSlots(){

const [doctors,setDoctors]=
useState([]);

const [search,setSearch]=
useState("");

const [page,setPage] =
useState(1);

const pageSize = 6;

const [totalPages,
setTotalPages] =
useState(1);

useEffect(()=>{

axios.get(
`http://localhost:5000/api/Doctors?page=${page}&pageSize=${pageSize}`,
{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)
.then((response)=>{

setDoctors(
response.data.data || []
);

setTotalPages(
Math.ceil(
response.data.totalCount /
pageSize
)
);

})
.catch((error)=>{

console.log(error);

});

},[page]);

const filteredDoctors=
doctors.filter((doctor)=>

doctor.user.fullName
.toLowerCase()
.includes(search.toLowerCase())

||

doctor.user.email
.toLowerCase()
.includes(search.toLowerCase())

);

return(
<>
<Navbar />

<div className="admin-dashboard">

<h1>
Manage Doctor Slots
</h1>

<div className="admin-search-box">

<input
type="text"
placeholder="Search by doctor name or email"

value={search}

onChange={(e)=>
setSearch(e.target.value)
}
/>

</div>

<div className="admin-table-box">

<table>

<thead>

<tr>

<th>
Doctor
</th>

<th>
Email
</th>

<th>
Specialization
</th>

<th>
Action
</th>

</tr>

</thead>

<tbody>

{
filteredDoctors.map(
(doctor,index)=>(

<tr key={index}>

<td>
{doctor.user.fullName}
</td>

<td>
{doctor.user.email}
</td>

<td>
{doctor.specialization}
</td>

<td>

<button
className="management-btn"

onClick={()=>{

window.location.href=
`/admin-slots/${doctor.id}`;

}}
>

Manage Slots

</button>

</td>

</tr>

))
}

</tbody>

</table>

<div className="pagination">

<button
disabled={page===1}

onClick={()=>
setPage(page-1)
}
>

Prev

</button>

{
[...Array(totalPages)]
.map((_,index)=>(

<button
key={index}

className={
page===index+1
? "active-page"
: ""
}

onClick={()=>
setPage(index+1)
}
>

{index+1}

</button>

))
}

<button
disabled={
page===totalPages
}

onClick={()=>
setPage(page+1)
}
>

Next

</button>

</div>

</div>

</div>

</>
);

}

export default AdminSlots;