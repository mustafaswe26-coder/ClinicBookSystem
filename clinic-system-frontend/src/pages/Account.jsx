import Navbar from "../components/Navbar";

import axios from "axios";

import {
  useEffect,
  useState
} from "react";

import { FaCamera } from "react-icons/fa";

function Account() {

  const [user, setUser] =
    useState(null);

  const [isEditing, setIsEditing] =
    useState(false);
    const [successMessage, setSuccessMessage] =
  useState("");

  const userId=
localStorage.getItem("userId");

const [profileImage,setProfileImage]=
useState(
localStorage.getItem(
`profileImage_${userId}`
) || ""
);

  useEffect(() => {

axios.get(
"http://localhost:5000/api/Auth/me",

{
headers:{
Authorization:
`Bearer ${localStorage.getItem("token")}`
}
}
)

.then((response) => {

setUser(response.data);

})

.catch((error)=>{

console.log(error);

window.location.href="/login";

});

}, []);

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("role");

    localStorage.removeItem("userId");

    window.location.href = "/login";
  };

  if (!user) {

    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Navbar />

      <div className="account-page">

        <div className="account-card">

         <div className="account-image-box">

<label htmlFor="profileUpload">

{
profileImage ? (

<img
src={profileImage}
alt="Profile"
className="account-image"
/>

) : (

<div className="account-default-avatar">

{
user.role === "Doctor"
? "👨‍⚕️"
: user.role === "Admin"
? "🛡️"
: "👤"
}

</div>

)
}

<div className="camera-icon">

<FaCamera />

</div>

</label>

<input
type="file"
id="profileUpload"
accept="image/*"

style={{display:"none"}}

onChange={(e)=>{

const file =
e.target.files[0];

if(file){

const reader =
new FileReader();

reader.onloadend=()=>{

setProfileImage(
reader.result
);

localStorage.setItem(
`profileImage_${userId}`,
reader.result
);

};

reader.readAsDataURL(file);

}

}}
/>

</div>

         <h2>
  {user.fullName}
</h2>

          <div className="account-info">

            <label>
              Full Name
            </label>

            <input
              type="text"

              value={user.fullName}

              disabled={!isEditing}

              onChange={(e) =>
                setUser({
                  ...user,
                  fullName: e.target.value
                })
              }
            />

            <label>
              Email
            </label>

            <input
              type="email"

              value={user.email}

              disabled
            />

            <label>
              Role
            </label>

            <input
              type="text"

              value={user.role}

              disabled
            />

            <label>
  Phone Number
</label>

<input
  type="text"

  value={user.phone || ""}

  disabled={!isEditing}

  onChange={(e) =>
    setUser({
      ...user,
      phone: e.target.value
    })
  }
/>

          </div>

{
  successMessage && (

    <div className="success-message">

      {successMessage}

    </div>

  )
}

          <button
            className="save-btn"

            onClick={() => {

  if (isEditing) {

    axios.put(
      "http://localhost:5000/api/Auth/update-profile",

      {
        fullName: user.fullName,
        phone: user.phone
      },

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
   .then(() => {

  setIsEditing(false);

  setSuccessMessage(
    "Profile Updated Successfully"
  );

})
.catch((error) => {

  console.log(error);

});

  } else {

  setSuccessMessage("");

  setIsEditing(true);
}

}}
          >
            {
              isEditing
                ? "Save Changes"
                : "Edit Profile"
            }
          </button>

          <button
            className="logout-account-btn"

            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </>
  );
}

export default Account;