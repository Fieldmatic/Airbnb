import React from "react"
import "./admin.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"


export default function Admin() {


    return (
        <div className="adminHome">
            <AdminSidebar />
            <div className="homeContainer">
                <AdminNavbar />
            </div>
        </div>
    )
}