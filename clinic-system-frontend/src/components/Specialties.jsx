import {
  FaHeart,
  FaBrain,
  FaBone,
  FaChild,
  FaTeeth
} from "react-icons/fa";

import { MdSpa } from "react-icons/md";

function Specialties() {
  const specialties = [
    {
      icon: <FaHeart />,
      title: "Cardiology",
      subtitle: "Heart Care",
      color: "#ff4d4f",
      bg: "#fff1f0"
    },

    {
      icon: <FaBrain />,
      title: "Neurology",
      subtitle: "Brain & Nerves",
      color: "#7b61ff",
      bg: "#f3f0ff"
    },

    {
      icon: <FaBone />,
      title: "Orthopedics",
      subtitle: "Bone & Joints",
      color: "#00b4ff",
      bg: "#eefcff"
    },

    {
      icon: <FaChild />,
      title: "Pediatrics",
      subtitle: "Child Care",
      color: "#f59e0b",
      bg: "#fff7ed"
    },

    {
      icon: <MdSpa />,
      title: "Dermatology",
      subtitle: "Skin Care",
      color: "#f97316",
      bg: "#fff7ed"
    },

    {
      icon: <FaTeeth />,
      title: "Dentistry",
      subtitle: "Oral Care",
      color: "#0ea5e9",
      bg: "#ecfeff"
    }
  ];

  return (
    <div className="specialties">
      <h2>
        Our Specialties
      </h2>

      <div className="specialties-grid">
        {specialties.map((item, index) => (
          <div
            className="specialty-card"
            key={index}
          >
            <div
              className="specialty-icon"
              style={{
                color: item.color,
                background: item.bg
              }}
            >
              {item.icon}
            </div>

            <h3>{item.title}</h3>

            <p>{item.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Specialties;