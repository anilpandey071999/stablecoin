import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CaretDownFill } from 'react-bootstrap-icons';
import { CaretUpFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import logo from "../../aseets/logo.png";
// import "./NavBar.scss";


const useActiveNavLink = (path: string) => {
    const location = useLocation();
    const isActive = location.pathname === path;
    const activeStyle = {
        color: isActive ? "#E3FF62" : "#515B61",
        backgroundColor: isActive ? "#19191F" : "transparent",
        borderRadius: isActive ? "10px" : "0px",
    };
    return activeStyle;
};

const NavbarComponent: React.FC = () => {
    return (
        /*  Navigation Bar Desktop */
        <div className="navbar-header">

            <div className="navbar-container">
                <div className="logo-container">
                    <img className='logo' alt="logo" />
                </div>
                <div className="align-item-end">
                    <ul className="items-list">
                        <li className="item "> <ConnectButton />  </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default NavbarComponent;
