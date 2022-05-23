import './Header.css'
import React, {useEffect, useState} from 'react';
import MenuItems from './MenuItems.jsx'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import inMemoryJwt from './services/inMemoryJwtService';

export default function Header(){

    const [isUserLogged, setIsUserLogged] = useState(false);
    
    useEffect(() => {
        inMemoryJwt.setToken(localStorage.getItem("user"))
        inMemoryJwt.setExpiresIn(localStorage.getItem("expiration"))
        if ((inMemoryJwt.getToken()) !== null) setIsUserLogged(true);
        else setIsUserLogged(false)
    }, [isUserLogged]);

    const logoutHandler = event => {
        localStorage.clear()
        inMemoryJwt.deleteExpiration()
        inMemoryJwt.deleteToken()
        setIsUserLogged(false)
    };

    return (
        <div className = 'header'>
            <Link to={'/'}>
                <img className='header__icon'
                src = "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
                alt = ""
                />
            </Link>
            <div className='header__links'>
             <Link to={'/addCottage'} style={{textDecoration: 'none', color:'black'}}>Add Cottage</Link>
             <Link to={'/addBoat'} style={{textDecoration: 'none', color:'black'}}>Add Boat</Link>
             <Link to={'/addAdventure'} style={{textDecoration: 'none', color:'black'}}>Add Adventure</Link>
             <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
             <Link to={'/showEntities'} style={{textDecoration: 'none', color:'black'}}>View Offers</Link>
             <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>

            </div>
             
            <div className='header__right'>
                {
                    isUserLogged?
                    <button type="button" onClick={logoutHandler}>Logout</button>
                    :
                    <Link to={'/login'} style={{textDecoration: 'none', color:'black'}}>Login</Link>
                }
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