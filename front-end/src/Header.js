import './Header.css'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, {useEffect, useState} from 'react';
import MenuItems from './MenuItems.jsx'
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import inMemoryJwt from './services/inMemoryJwtService';
import LoginRegisterService from './services/LoginRegisterService';
import { DateRangePicker } from 'react-date-range';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PeopleIcon from '@mui/icons-material/People';
import { People } from '@mui/icons-material';
import SearchedEntities from './components/ViewEntities/SearchedEntities';
import {Link, useNavigate} from 'react-router-dom';



export default function Header(){
    //const [startDate, setStartDate] = useState(new Date())
    //const [endDate, setEndDate] = useState(new Date())
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [role, setRole] = useState(null);
    //const [searchInput, setSearchInput] = useState("")
    //const [guestsNumber, setGuestsNumber] = useState(1)
    const [entityType, setEntityType] = useState("cottage")
    const [redirect, setRedirect] = React.useState("");
    const [searchData, setSearchData] = useState({
        startDate : new Date(),
        endDate : new Date(),
        city : "",
        guestsNumber : 1
    })
    const navigate = useNavigate();
    const selectionRange = {
        startDate: searchData.startDate,
        endDate: searchData.endDate,
        key: 'selection'
    }

    const handleDateChange = (ranges) => {
        setSearchData(prevData => ({
            ...prevData,
            startDate : ranges.selection.startDate,
            endDate : ranges.selection.endDate
        }))
    }
    
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

    function handleEntityTypeChanged(event) {
        const {name, value, type, checked} = event.target
        //setEntityType(type === "checkbox" ? checked : value)
        setEntityType(value)
        
    }

    function handleSearch(event) {
        navigate('/searchEntities',{state: {startDateTime: toISODate(searchData.startDate),
            endDateTime: toISODate(searchData.endDate),
            guestsNumber : searchData.guestsNumber,
            city :  searchData.city, entityType: entityType}});
    }

    function handleGuestsNumChange(event) {
        setSearchData(prevData => ({
            ...prevData,
            "guestsNumber" : event.target.value
        }))
    }

    function handleCityChange(event) {
        setSearchData(prevData => ({
            ...prevData,
            "city" : event.target.value
        }))
    }

    function closeSearch() {
        setSearchData(prevData => ({
            ...prevData,
            "city" : ""
        }))
    }

    return (
        <div>
            <div className = 'header'>
                <Link to={'/'}>
                    <img className='header__icon'
                    src = "https://cdn.worldvectorlogo.com/logos/airbnb.svg"
                    alt = ""
                    />
                </Link>
                <input type="text" placeholder="Select destination" className='search_input' value={searchData.city} onChange={handleCityChange}>
                </input>
                
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
            </div>
            {searchData.city && (
                    <div className='header-search'>
                        <DateRangePicker
                            className='action-dateRangePicker' 
                            ranges={[selectionRange]}
                            minDate={new Date()}
                            rangeColors={["#FD5B61"]}
                            onChange={handleDateChange}
                        />
                        <div className='entityType'>
                                <span>Type of Entity</span>
                                <div className="entityTypeRdb">
                                <input 
                                    type="radio"
                                    id="cottage"
                                    value="cottage"
                                    checked={entityType === "cottage"}
                                    onChange={handleEntityTypeChanged}
                                />
                                <label htmlFor="cottage">Cottage</label>
                    
                                <input 
                                    type="radio"
                                    id="boat"
                                    value="boat"
                                    checked={entityType === "boat"}
                                    onChange={handleEntityTypeChanged}
                                />
                                <label htmlFor="boat">Boat</label>
                    
                                <input 
                                    type="radio"
                                    id="adventure"
                                    value="adventure"
                                    checked={entityType === "adventure"}
                                    onChange={handleEntityTypeChanged}
                                />
                                <label htmlFor="adventure">Adventure</label>
                                </div>
                        </div>

                        <div className='guestsNumber'>
                            <span>Number of Guests</span>
                            <div className='op'>
                                <PeopleIcon fontSize='large'/>
                                <input type="number" value={searchData.guestsNumber} onChange={handleGuestsNumChange} min={1} max={20}/>
                            </div>
                        </div>
                        <div className='searchButtons'>
                            <button onClick={closeSearch}>Cancel</button>
                            <button className='searchButton' onClick={handleSearch}>Search</button>
                        </div>
                        

                    </div>
            )}
        </div>

    )

    function toISODate (dateTime) {
        dateTime.setSeconds(0)
        return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000).toISOString()
      }
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