function DoctorsSection() {
  const doctors = [
    {
      name: "Dr. Ahmed Ali",
      specialty: "Cardiology",
      fees: 300
    },

    {
      name: "Dr. Sarah Mohamed",
      specialty: "Neurology",
      fees: 450
    },

    {
      name: "Dr. Omar Khaled",
      specialty: "Dental",
      fees: 250
    }
  ];

  return (
    <div className="doctors-section">
      <h2>
        Top Doctors
      </h2>

      <div className="doctors-grid">
        {doctors.map((doctor, index) => (
          <div
            className="doctor-card"
            key={index}
          >
            <div className="doctor-image">
              👨‍⚕️
            </div>

            <h3>{doctor.name}</h3>

            <p>{doctor.specialty}</p>

            <span>
              {doctor.fees} EGP
            </span>

            <button>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsSection;