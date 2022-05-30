import React from "react"
import "./adminNavbar.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";


export default function AdminNavbar() {

    return (
        <div className="adminNavbar">
            <div className="wrapper">
                <div className="searchBar">
                    <input type="text" placeholder="Search..." />
                    <SearchOutlinedIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <img
                        src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                        alt=""
                        className="avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}