import React, { useState } from 'react';
import "./Banner.css";
import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";

function Banner() {
    const navigate = useNavigate();
    const [showSearch, setShowSearch] =  useState
    (false);

    return (
        <div className="banner">
            <div className="banner__info">
                <div className='explore--nearby'>
                <h1>Get out and stretch your imagination</h1>
                <h5>Plan a different kind of getaway to uncover the hidden gems near you.</h5>
                <Button onClick={() => navigate("/search")}
                variant='outlined'>Explore Nearby
                </Button>
                </div>
                <div className='banner_background'>
                    <img className ="banner_image" src = "https://secure.uniquebookingservices.com/uf/ri/flash/flashfile77/910/ukiyo-self-catering-accommodation-in-coverack-corn.jpg"/>
                </div>
            </div>
        </div>
     
    )
}

export default Banner;
