import './Header.css'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, {useEffect, useState} from 'react';
import MenuItems from './MenuItems.jsx'
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar } from '@mui/material';
import inMemoryJwt from './services/inMemoryJwtService';
import LoginRegisterService from './services/LoginRegisterService';
import { DateRangePicker } from 'react-date-range';
import PeopleIcon from '@mui/icons-material/People';
import Button from '@mui/material/Button';
import {Link, useNavigate} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider} from '@mui/material/styles';
import { TextField } from '@mui/material';
import muiStyles from './components/utils/muiStyles';




export default function Header(){
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [role, setRole] = useState(null);
    const [entityType, setEntityType] = useState("cottage")
    const [popupState, setPopupState] = useState(false)
    const [searchData, setSearchData] = useState({
        startDate : new Date(),
        endDate : new Date(),
        startTime : new Date(2022,1,1,11,0,0),
        endTime :new Date(2022,1,1,11,0,0),
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

    function getUnauthorizedOptions(){
        return (
            <div className='header__links'>
            </div>
        )
    }


    function getClientOptions(){
        return (
            <div className='header__links'>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/showWishList'} style={{textDecoration: 'none', color:'black'}}>Wish list</Link>
            </div>
        )
    }

    function getCottageOwnerOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addCottage'} style={{textDecoration: 'none', color:'black'}}>Add Cottage</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
                <Link to={'/hostReservations'} style={{textDecoration: 'none', color:'black'}}>Reservation History</Link>
            </div>
        )
    }

    function getBoatOwnerOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addBoat'} style={{textDecoration: 'none', color:'black'}}>Add Boat</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
                <Link to={'/hostReservations'} style={{textDecoration: 'none', color:'black'}}>Reservation History</Link>
            </div>
        )
    }

    function getInstructorOptions(){
        return (
            <div className='header__links'>
                <Link to={'/addAdventure'} style={{textDecoration: 'none', color:'black'}}>Add Adventure</Link>
                <Link to={'/editProfile'} style={{textDecoration: 'none', color:'black'}}>Edit Your Profile</Link>
                <Link to={'/viewHostEntities'} style={{textDecoration: 'none', color:'black'}}>View your entities</Link>
                <Link to={'/hostReservations'} style={{textDecoration: 'none', color:'black'}}>Reservation History</Link>
            </div>
        )
    }

    function handleEntityTypeChanged(event) {
        const {name, value, type, checked} = event.target
        //setEntityType(type === "checkbox" ? checked : value)
        setEntityType(value)
        
    }

    function handleSearch() {
        navigate('/showEntities',{state: {
            startDateTime:toISODate(new Date(searchData.startDate.getFullYear(),searchData.startDate.getMonth(), searchData.startDate.getDate(), searchData.startTime.getHours(), searchData.startTime.getMinutes(),searchData.startTime.getSeconds())),
            endDateTime:toISODate(new Date(searchData.endDate.getFullYear(),searchData.endDate.getMonth(), searchData.endDate.getDate(), searchData.endTime.getHours(), searchData.endTime.getMinutes(),searchData.endTime.getSeconds())),
            guestsNumber : searchData.guestsNumber,
            city :  searchData.city, entityType: entityType, 
            showAll: false}});
        setPopupState(false)

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
        setPopupState(true)
    }

    function closeSearch() {
        setSearchData(prevData => ({
            ...prevData,
            "city" : "",
            "startDate" : new Date(),
            "endDate" : new Date(),
            "guestsNumber" : 1

        }))
        setPopupState(false)
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
                <div className='search-period'>
                    <input type="text" placeholder={popupState ? "Enter destination" : "Search"} className='search_input' value={searchData.city} onChange={handleCityChange} onClick={() => setPopupState(true)} />
                    <SearchIcon/>  
                </div> 
                
                {role===null && getUnauthorizedOptions()}
                {role==="CLIENT" && getClientOptions()}
                {role==="COTTAGE_OWNER" && getCottageOwnerOptions()}
                {role==="BOAT_OWNER" && getBoatOwnerOptions()}
                {role==="INSTRUCTOR" && getInstructorOptions()}
                {role ==="ADMIN" && navigate("/admin")}
                    
                <div className='header__right'>
                    {
                        isUserLogged?
                        <span className='logout' onClick={logoutHandler}>Logout </span>
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
                        <Link to={'/clientRegistration'} style={{textDecoration: 'none', color:'black'}}>
                            <Avatar/>
                        </Link>
                    </div>
                }
                    
                </div>
            </div>
            {popupState && (
                    <div className='header-search'>
                        <div>
                            <DateRangePicker
                                ranges={[selectionRange]}
                                minDate={new Date()}
                                rangeColors={["#FD5B61"]}
                                onChange={handleDateChange}
                            />

                            <div className='searchTime'>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <ThemeProvider theme={muiStyles.timePickerTheme}>
                                    <TimePicker
                                        renderInput={(params) => {
                                            return (
                                            <TextField
                                                {...params}
                                                sx={muiStyles.style}
                                            />
                                            );
                                        }}
                                        ampm={false}
                                        minutesStep={30}
                                        color="#FF5A5F"
                                        label="Start time"
                                        value={searchData.startTime}
                                        name ="startTime"
                                        onChange= {(newValue) => {
                                            setSearchData(prevFormData => ({
                                                ...prevFormData,
                                                startTime: newValue
                                            }));
                                        }}
                                    />
                                </ThemeProvider>
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <ThemeProvider theme={muiStyles.timePickerTheme}>
                                    <TimePicker
                                        renderInput={(params) => {
                                            return (
                                            <TextField
                                                {...params}
                                                sx={muiStyles.style}
                                            />
                                            );
                                        }}
                                        ampm={false}
                                        minutesStep={30}
                                        color="#FF5A5F"
                                        label="End time"
                                        value={searchData.endTime}
                                        name ="endTime"
                                        onChange= {(newValue) => {
                                            setSearchData(prevFormData => ({
                                                ...prevFormData,
                                                endTime: newValue
                                            }));
                                        }}
                                    />
                                </ThemeProvider>
                            </LocalizationProvider>
                            </div>

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
                            <button className='closeButton' onClick={closeSearch}>Cancel</button>
                            <button className='searchButton' onClick={handleSearch}>Search</button>
                        </div>
                        
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
          path: "/instructorRegistration"
         }]
    }
   ];