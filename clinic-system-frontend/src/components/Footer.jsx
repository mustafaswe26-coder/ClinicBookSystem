import {
FaFacebookF,
FaTwitter,
FaLinkedinIn,
FaInstagram
} from "react-icons/fa";

import {
MdEmail
} from "react-icons/md";

import {
FaPhoneAlt
} from "react-icons/fa";

import {
IoLocationSharp
} from "react-icons/io5";

function Footer(){

return(

<footer className="footer">

<div className="footer-container">

<div className="footer-about">

<h2>
MediCare+
</h2>

<p>

MediCare+ is a smart clinic management
system designed to simplify doctor
appointments, patient management,
and medical services using modern
technology and AI-powered solutions.

</p>

<div className="footer-socials">

<div>
<FaFacebookF />
</div>

<div>
<FaTwitter />
</div>

<div>
<FaLinkedinIn />
</div>

<div>
<FaInstagram />
</div>

</div>

</div>

<div
className="footer-links"
id="services"
>

<h3>
Services
</h3>

<ul>

<li>
Appointments
</li>

<li>
Patient Management
</li>

<li>
Medical Services
</li>

<li>
Reports & Analytics
</li>

</ul>

</div>

<div
className="footer-links"
id="about"
>

<h3>
About Us
</h3>

<ul>

<li>
Our Mission
</li>

<li>
How It Works
</li>

<li>
Why Choose Us
</li>

<li>
Our Team
</li>

<li>
FAQs
</li>

</ul>

</div>

<div
className="footer-contact"
id="contact"
>

<h3>
Contact Us
</h3>

<div className="footer-contact-item">

<span>
<MdEmail />
</span>

<p>
support@medicareplus.com
</p>

</div>

<div className="footer-contact-item">

<span>
<FaPhoneAlt />
</span>

<p>
+20 100 000 0000
</p>

</div>

<div className="footer-contact-item">

<span>
<IoLocationSharp />
</span>

<p>
Cairo, Egypt
</p>

</div>

</div>

</div>

<div className="footer-bottom">

<p>
© 2024 MediCare+. All rights reserved.
</p>

</div>

</footer>

);

}

export default Footer;