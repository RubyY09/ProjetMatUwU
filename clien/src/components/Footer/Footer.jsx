import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareFacebook,
  faSquareXTwitter,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import logoImg from "../../../public/logo.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
    w-full    bottom-0
    flex flex-col md:flex-row items-center md:items-center justify-between
    px-6 md:px-8 py-3
  "
    >
      <div className="absolute  left-0 w-full h-2 "></div>

      <div className="flex flex-col items-center order-1 md:order-2 mb-3 md:mb-0">
        <NavLink to="/Home" className="block -mb-1">
          <div className="w-[90px] h-[90px] flex items-center justify-center">
            <img src={logoImg} alt="logo RollUp" className="object-contain" />
          </div>
        </NavLink>
        <p className="text-[#F2EEE8] text-xl font-medium-mt-1">{currentYear}</p>
      </div>

      <div className="flex space-x-4 order-2 md:order-1 mb-3 md:mb-0">
        <FontAwesomeIcon
          icon={faSquareFacebook}
          className=" text-3xl md:w-9 md:h-9 text-[#F2EEE8]  cursor-pointer  transition-all ease-in-out duration-300 hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faDiscord}
           className=" text-3xl md:w-9 md:h-9 text-[#F2EEE8]  cursor-pointer  transition-all ease-in-out duration-300 hover:scale-110"
        />
        <FontAwesomeIcon
          icon={faSquareXTwitter}
          className=" text-3xl md:w-9 md:h-9 text-[#F2EEE8]  cursor-pointer  transition-all ease-in-out duration-300 hover:scale-110"
        />
      </div>

      <div className="flex flex-col items-center md:items-end space-y-2 order-3">
        <a
          href="#"
        className="text-[#F2EEE8] text-xl font-medium transition-all ease-in-out duration-300 hover:scale-110 text-center md:text-right "
        
        >
          Politique de confidentialité
        </a>
        <a
          href="#"
          className="text-[#F2EEE8] text-xl font-medium transition-all ease-in-out duration-300 hover:scale-110 text-center md:text-right "
        >
          Mentions légales
        </a>
      </div>
    </footer>
  );
}

export default Footer;