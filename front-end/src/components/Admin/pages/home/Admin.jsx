import React, {useEffect, useState} from 'react';
import "./admin.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import inMemoryJwt from '../../../../services/inMemoryJwtService';
import LoginRegisterService from '../../../../services/LoginRegisterService'
import Widget from '../../components/widget/Widget';


export default function Admin() {

    const [isUserLogged, setIsUserLogged] = useState(false);
    const [role, setRole] = useState(null);
    
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
    };


    return (
        <div className="adminHome">
            <AdminSidebar />
            <div className="homeContainer">
                <AdminNavbar />
                <div className="widgets">
                    <Widget type="user" />
                    <Widget type="order" />
                    <Widget type="earning" />
                    <Widget type="balance" />
                </div>
            </div>
        </div>
    )
}