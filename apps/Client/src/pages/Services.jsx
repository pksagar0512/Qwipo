import React from "react";
import Why1 from "../assets/why1.png";
import Why2 from "../assets/why2.png";
import Why3 from "../assets/why3.png";
import Why4 from "../assets/why4.png";
import phoneImage1 from "../assets/phone1.png";
import phoneImage2 from "../assets/phone2.png";
import phoneImage3 from "../assets/phone3.png";
import phoneImage4 from "../assets/phone4.png";
import solution1 from "../assets/solution1.png";
import solution2 from "../assets/solution2.png";
import solution3 from "../assets/solution3.png";
import solution4 from "../assets/solution4.png";
import solution5 from "../assets/solution5.png";
import solution6 from "../assets/solution6.png";
import {
  FaPhoneAlt,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaPinterest,
  FaApple
} from "react-icons/fa";

import { SiGoogleplay as FaGooglePlay } from "react-icons/si";

import logo from "../assets/logo.png";


import "../styles/services.css";

const services = [
  {
    icon: <img src={Why1} alt="Service 1" />,
    title: "Fully Managed Platform",
    description:
      "Qwipo simplifies business operations with a fully managed backend and a user-friendly mobile and web interface.",
  },
  {
    icon: <img src={Why2} alt="Service 2" />,
    title: "Vendor Tools",
    description:
      "Efficiently manage your entire business with intuitive access & real-time data insights through Qwipo's powerful web and mobile apps.",
  },
  {
    icon: <img src={Why3} alt="Service 3" />,
    title: "Ops and Delivery Tools",
    description:
      "Empower your sales and delivery teams with dedicated mobile apps for seamless, efficient field operations.",
  },
  {
    icon: <img src={Why4} alt="Service 4" />,
    title: "Customer Tools",
    description:
      "Keep your customers always connected with Qwipo's marketplace app for easy ordering, secure payments, and real-time tracking.",
  },
];

const benefits = [
  {
    icon: solution3,
    title: "Conquer Multiple Marketplace",
    description:
      "Effortlessly expand your reach across diverse marketplaces and drive more revenue.",
  },
  {
    icon: solution1,
    title: "Third-Party Logistics (3PL)",
    description:
      "Ensure timely deliveries with efficient 3PL services. Set yourself free to focus on growth.",
  },
  {
    icon: solution2,
    title: "Buy Now, Pay Later (BNPL)",
    description:
      "Increase purchasing power and manage cash flow with flexible BNPL options for retailers.",
  },
  {
    icon: solution4,
    title: "Advanced Analytics",
    description:
      "Gain actionable insights with real-time dashboards and AI-driven forecasting.",
  },
  {
    icon: solution5,
    title: "Customer Support",
    description:
      "Boost loyalty with integrated customer support tools and feedback systems.",
  },
  {
    icon: solution6,
    title: "Quality Assurance",
    description:
      "Maintain high standards with automated checks and streamlined processes.",
  },
];


const Services = () => {
  return (
    <section className="services-section">

      <div className="services-container">
        <h2 className="services-heading">Discover the Revolutionary QWIPO Platform</h2>
        <div className="services-list">
          {services.map((service, index) => (
            <div className="service-box" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="float-section">
        <div className="text-content">
          <h2>Vendor Mobile App</h2>
          <p>
            Manage distribution on the go with Qwipo's Vendor Mobile App—track sales, inventory,
            payments, and returns. Upsell, implement pricing strategies, schedule deliveries, and gain
            market insights—all from one powerful Android and iOS app.
          </p>
        </div>
        <div className="image-content">
          <img src={phoneImage1} alt="Vendor Mobile App" />
        </div>
      </div>

      <div className="float-section image-left">
        <div className="image-content">
          <img src={phoneImage2} alt="Customer Mobile App" />
        </div>
        <div className="text-content">
          <h2>Business Retailers Mobile App</h2>
          <p>Connect to the marketplace of vendors seamlessly—explore products, receive AI-driven recommendations, forecast demand, manage orders, and make secure digital payments. Access flexible credit options and streamline your operations with full support anytime.
          </p>
        </div>
      </div>

      <div className="floatt-section">
        <div className="textt-content">
          <h2>The Sales Agents App</h2>
          <p>
            Enable your sales team to use the Field Agents Mobile App, allowing them to place orders, recommend products, and manage schemes on the move. Track their market visits, monitor time spent with each retailer, and boost overall business efficiency.
          </p>
        </div>
        <div className="imagee-content">
          <img src={phoneImage3} alt="Vendor Mobile App" />
        </div>
      </div>

      <div className="floatt-section image-left">
        <div className="imagee-content">
          <img src={phoneImage4} alt="Customer Mobile App" />
        </div>
        <div className="textt-content">
          <h2>The Smart Delivery App</h2>
          <p>
            Optimize delivery with real-time load calculations, traffic-based routing, and efficient payment tracking. Save on fuel, and emissions, and ensure smooth delivery processes. Track payment settlements and manage returns effortlessly.
          </p>
        </div>
      </div>

      <div className="benefits-section">
        <div className="benefits-header">
          <h2>One Platform, Endless Benefits</h2>
          <p>
            Streamline operations, manage finances, and enhance customer satisfaction with Qwipo's
            comprehensive suite of tools.
          </p>
        </div>

        <div className="benefits-grid">
          {benefits.map((item, index) => (
            <div className="benefit-card" key={index}>
              <img src={item.icon} alt={item.title} className="benefit-icon" />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="cta-section">
        <h2>Unleash Limitless Business Growth</h2>
        <button className="cta-button">Join Qwipo</button>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">
              <img src={logo} alt="Qwipo Logo" />

            </div>
            <p className="footer-phone">
              <FaPhoneAlt /> +91 9121222836
            </p>
            <div className="footer-cta">
              <p>Ready to work?</p>
              <a href="/contact" className="footer-talk">
                Let's Talk →
              </a>
            </div>
          </div>

          <div className="footer-links">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/career">Career</a></li>
              <li><a href="/partners">Partners</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
            </ul>
          </div>

          <div className="footer-address">
            <h3>Address</h3>
            <p><strong>Corporate Office:</strong></p>
            <p>Divyasree Trinity, Isprout Co-working Space,</p>
            <p>7th Floor, A-Wing, Plot No.5, at Hitech City Layout,</p>
            <p>Survey No 64(Part) Madhapur Village,</p>
            <p>Serilingampally Mandal, R R District.</p>
            <p>Hyderabad Telangana, 500081</p>

            <div className="footer-social">
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaPinterest /></a>
              <a href="#"><FaApple /></a>
              <a href="#"><FaGooglePlay /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2024 Qwipo. All rights reserved</p>
          <p>
            Cookie Settings, Anti-Spam, Privacy, User agreement, Legal Notice and Responsible Disclosure
          </p>
        </div>
      </footer>

    </section>
  );
};

export default Services;
