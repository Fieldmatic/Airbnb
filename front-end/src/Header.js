import './Header.css'
import React, {useEffect, useState} from 'react';
import MenuItems from './MenuItems.jsx'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import inMemoryJwt from './services/inMemoryJwtService';
import LoginRegisterService from './services/LoginRegisterService';

export default function Header(){

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

    function getUnauthorizedOptions(){
        return (
            <div className='header__links'>
                <Link to={'/showEntities'} style={{textDecoration: 'none', color:'black'}}>View Offers</Link>
            </div>
        )
    }

    function getClientOptions(){
        return (
            <div className='header__links'>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/showEntities'} style={{textDecoration: 'none', color:'black'}}>View Offers</Link>
            </div>
        )
    }

    function getCottageOwnerOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addCottage'} style={{textDecoration: 'none', color:'black'}}>Add Cottage</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
            </div>
        )
    }

    function getBoatOwnerOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addBoat'} style={{textDecoration: 'none', color:'black'}}>Add Boat</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
            </div>
        )
    }

    function getInstructorOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addAdventure'} style={{textDecoration: 'none', color:'black'}}>Add Adventure</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
            </div>
        )
    }

    return (
        <div className = 'header'>
            <Link to={'/'}>
                <img className='header__icon'
                src = "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
                alt = ""
                />
            </Link>
            
            {role===null && getUnauthorizedOptions()}
            {role==="CLIENT" && getClientOptions()}
            {role==="COTTAGE_OWNER" && getCottageOwnerOptions()}
            {role==="BOAT_OWNER" && getBoatOwnerOptions()}
            {role==="INSTRUCTOR" && getInstructorOptions()}
                 
            <div className='header__right'>
                {
                    isUserLogged?
                    <button type="button" onClick={logoutHandler}>Logout</button>
                    :
                    <Link to={'/login'} style={{textDecoration: 'none', color:'black'}}>Login</Link>
                }
            </div>
            {!isUserLogged &&
                <div className='header__registrations'>
                    <ul className="menus">
                        {menuItems.map((menu, index) => {
                            return <MenuItems items={menu} key={index} />;
                        })}
                    </ul>
                    <ExpandMoreIcon/>
                    <Link to={'/clientRegistration'} style={{textDecoration: 'none', color:'black'}}>
                        <Avatar/>
                    </Link>
                </div>
            }
                
        </div>

    )
}



export const menuItems = [
    {
        title: "Become a host",
        submenu: [
         {
          title: "Cottage & boat owner",
          path: "/ownerRegistration"
         },
         {
          title: "Instructor",
          path: "/registrateInstructor"
         }]
    }
   ];