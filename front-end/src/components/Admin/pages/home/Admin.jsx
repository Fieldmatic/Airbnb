import React, {useEffect, useState} from 'react';
import "./admin.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import inMemoryJwt from '../../../../services/inMemoryJwtService';
import LoginRegisterService from '../../../../services/LoginRegisterService'
import Widget from '../../components/widget/Widget';
import NewAdminWidget from '../../components/widget/NewAdminWidget';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';


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

    const [showAlert, setShowAlert] = React.useState(false);
    const [message, setMessage] = React.useState({
        success: undefined,
        text: ""
    })

    const showMessage = (returnMessage) => {
        setShowAlert(true);
        setMessage(() => {
            return {
                success: returnMessage[1],
                text: returnMessage[0]
            }
        })
        setTimeout(() => {
            setShowAlert(false);
        }, 2500)
    }

    return (
        <div className="adminHome">
            <AdminSidebar />
            <div className="homeContainer">
                <AdminNavbar />
                <Collapse in={showAlert}>
                    {message.success ? 
                        <Alert variant="filled" severity="success">{message.text}</Alert> :
                        <Alert variant="filled" severity="error">{message.text}</Alert>
                    }           
                </Collapse>
                <div className="widgets">
                    <NewAdminWidget showMessage={showMessage}/>
                    <Widget type="order" showMessage={showMessage}/>
                    <Widget type="earning" showMessage={showMessage}/>
                    <Widget type="balance" showMessage={showMessage}/>
                </div>
            </div>
        </div>
    )
}