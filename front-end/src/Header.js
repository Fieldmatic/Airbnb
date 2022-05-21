import './Header.css'
import MenuItems from './MenuItems.jsx'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import inMemoryJwt from './services/inMemoryJwtService';

export default function Header(props){
    const logoutHandler = event => {
        localStorage.clear()
        inMemoryJwt.deleteExpiration()
        inMemoryJwt.deleteToken()
        props.setIsUserLogged(false)
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
                    props.isUserLogged?
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