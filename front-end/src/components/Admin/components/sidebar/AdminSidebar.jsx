import React from "react"
import "./adminSidebar.scss"
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PhishingIcon from '@mui/icons-material/Phishing';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import DirectionsBoatOutlinedIcon from '@mui/icons-material/DirectionsBoatOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import { Link , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import inMemoryJwt from '../../../../services/inMemoryJwtService'
import LoginRegisterService from '../../../../services/LoginRegisterService';


export default function AdminSidebar() {

    const [isUserLogged, setIsUserLogged] = useState(false);
    const [role, setRole] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        inMemoryJwt.setToken(localStorage.getItem("user"))
        inMemoryJwt.setExpiresIn(localStorage.getItem("expiration"))
        if ((inMemoryJwt.getToken()) !== null) setIsUserLogged(true);
        else setIsUserLogged(false)
        if (isUserLogged){
            LoginRegisterService.getUserRole().then(response => {
                if (response.data === "ROLE_COTTAGE_OWNER") setRole("COTTAGE_OWNER")
                else if (response.data === "ROLE_BOAT_OWNER") setRole("BOAT_OWNER")
                else if (response.data ==="ROLE_INSTRUCTOR") setRole("INSTRUCTOR")
                else if (response.data ==="ROLE_ADMIN") setRole("ADMIN")
                else setRole("CLIENT")
            })
        }
    }, [isUserLogged]);

    const logoutHandler = event => {
        localStorage.clear()
        inMemoryJwt.deleteExpiration()
        inMemoryJwt.deleteToken()
        setIsUserLogged(false)
        setRole(null)
        navigate("/")
    };

    return (
        <div className="adminSidebar">
            <div className="top">
                <span className="logo-sidebar">
                    <img className="header__icon-sidebar"
                        src = "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
                        alt = "" />
                </span>
            </div>
            <div className="center">
                <ul>
                    <p className="title">MAIN</p>
                    <Link to="/admin" style={{ textDecoration: "none" }}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <p className="title">REQUESTS</p>
                    <Link to="/admin/requests/registrationRequests" style={{ textDecoration: "none" }}>
                        <li>
                        <PersonOutlineIcon className="icon" />
                        <span>Registration</span>
                        </li>
                    </Link>
                    <Link to="/admin/requests/deletionRequests" style={{ textDecoration: "none" }}>
                        <li>
                        <DeleteOutlineIcon className="icon" />
                        <span>Deletion</span>
                        </li>
                    </Link>
                    <p className="title">ENTITIES</p>
                    <Link to="/admin/entities/adventures" style={{ textDecoration: "none" }}>
                        <li>
                            <PhishingIcon className="icon" />
                            <span>Adventures</span>
                        </li>
                    </Link>
                    <Link to="/admin/entities/cottages" style={{ textDecoration: "none" }}>
                        <li>
                            <CottageOutlinedIcon className="icon" />
                            <span>Cottages</span>
                        </li>
                    </Link>
                    <Link to="/admin/entities/boats" style={{ textDecoration: "none" }}>
                        <li>
                            <DirectionsBoatOutlinedIcon className="icon" />
                            <span>Boats</span>
                        </li>
                    </Link>
                    <p className="title">REVISIONS</p>
                    <Link to="/admin/revisions/complaints" style={{ textDecoration: "none" }}>
                        <li>
                            <ReceiptLongOutlinedIcon className="icon" />
                            <span>Complaints</span>
                        </li>
                    </Link>
                    <Link to="/admin/revisions/reviews" style={{ textDecoration: "none" }}>
                        <li>
                            <DocumentScannerOutlinedIcon className="icon" />
                            <span>Reviews</span>
                        </li>
                    </Link>
                    <p className="title">USER</p>
                    <Link to="/admin/profile" style={{ textDecoration: "none" }}>
                        <li>
                            <AccountCircleOutlinedIcon className="icon" />
                            <span>Profile</span>
                        </li>
                    </Link>
                    <li>
                        <ExitToAppIcon className="icon" />
                        <span onClick={logoutHandler}>Logout</span>
                    </li>
                    </ul>
                </div>               
            </div>
    )
}