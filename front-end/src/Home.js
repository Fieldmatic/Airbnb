import React, {useEffect, useState} from 'react';
import './Home.css'
import Header from './Header';
import inMemoryJwt from './services/inMemoryJwtService';

export default function Home(){
    const [isUserLogged, setIsUserLogged] = useState(false);
    
    useEffect(() => {
        inMemoryJwt.setToken(localStorage.getItem("user"))
        inMemoryJwt.setExpiresIn(localStorage.getItem("expiration"))
        if ((inMemoryJwt.getToken()) !== null) setIsUserLogged(true);
        else setIsUserLogged(false)
    }, [isUserLogged]);

    return (
        <div className = 'home'>
            <Header isUserLogged = {isUserLogged} setIsUserLogged = {setIsUserLogged}/>
        </div>

    )
}