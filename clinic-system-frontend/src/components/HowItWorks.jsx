import {
  FaUserDoctor,
  FaCalendarCheck,
  FaClipboardCheck
} from "react-icons/fa6";

function HowItWorks() {
  const steps = [
  {
    icon: <FaUserDoctor />,
    title: "Search Doctor",
    text: "Find the best doctor for your concern"
  },

  {
    icon: <FaCalendarCheck />,
    title: "Choose Time",
    text: "Select a convenient time slot"
  },

  {
    icon: <FaClipboardCheck />,
    title: "Book Appointment",
    text: "Confirm and you're done!"
  }
];

  return (
    <div className="works-section">
      <h2>
        How It Works
      </h2>

      <div className="works-grid">
        {steps.map((step, index) => (
          <div
            className="work-card"
            key={index}
          >
           <div className="work-icon">
  {step.icon}
</div>

            <div>
              <h3>{step.title}</h3>

              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowItWorks;