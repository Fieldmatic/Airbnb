import React, {useEffect} from 'react';
import './Home.css'
import Header from './Header';
import inMemoryJwt from './services/inMemoryJwtService';

export default function Home(){

    useEffect(() => {
        inMemoryJwt.setToken(localStorage.getItem("user"))
        inMemoryJwt.setExpiresIn(localStorage.getItem("expiration"))
        console.log(inMemoryJwt.getToken())
    }, []);

    return (
        <div className = 'home'>
            <Header/>
        </div>

    )
}