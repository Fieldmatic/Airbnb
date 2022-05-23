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
import { Link } from "react-router-dom";


export default function AdminSidebar() {

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
                    <li>
                        <DashboardIcon className="icon" />
                        <span>Dashboard</span>
                    </li>
                    <p className="title">REQUESTS</p>
                    <Link to="/admin/registrationRequests" style={{ textDecoration: "none" }}>
                        <li>
                        <PersonOutlineIcon className="icon" />
                        <span>Registration</span>
                        </li>
                    </Link>
                    <Link to="/admin/deletionRequests" style={{ textDecoration: "none" }}>
                        <li>
                        <DeleteOutlineIcon className="icon" />
                        <span>Deletion</span>
                        </li>
                    </Link>
                    <p className="title">ENTITIES</p>
                    <li>
                        <PhishingIcon className="icon" />
                        <span>Adventures</span>
                    </li>
                    <li>
                        <CottageOutlinedIcon className="icon" />
                        <span>Cottages</span>
                    </li>
                    <li>
                        <DirectionsBoatOutlinedIcon className="icon" />
                        <span>Boats</span>
                    </li>
                    <p className="title">SERVICE - po potrebi dodavati</p>                  
                    <li>
                        <PsychologyOutlinedIcon className="icon" />
                        <span>Logs</span>
                    </li>
                    <li>
                        <SettingsApplicationsIcon className="icon" />
                        <span>Settings</span>
                    </li>
                    <p className="title">USER</p>
                    <li>
                        <AccountCircleOutlinedIcon className="icon" />
                        <span>Profile</span>
                    </li>
                    <li>
                        <ExitToAppIcon className="icon" />
                        <span>Logout</span>
                    </li>
                    </ul>
                </div>               
            </div>
    )
}