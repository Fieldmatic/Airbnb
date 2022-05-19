import React, {useEffect, useState} from 'react';
import './Home.css'
import Header from './Header';
import Banner from './components/Banner';
import Card from './components/Card';
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
            <Banner/>
            <div className="home__section">
                <Card
                    src="https://a0.muscache.com/im/pictures/fdb46962-10c1-45fc-a228-d0b055411448.jpg?im_w=720"
                    title="Cottages"
                    description="Comfortable private places, with room for friends or family."
                />    
                 <Card
                    src="https://besthqwallpapers.com/Uploads/31-12-2017/35839/thumb2-heesen-project-maia-superyacht-4k-luxury-yacht-sea.jpg"
                    title="Boats"
                    description="Luxury boats to fulfill your dreams."
                />   
                <Card
                    src="https://www.bsframework.io/wp-content/uploads/2020/12/Adventure-Travel-A-Thrilling-And-Enthralling-Experience.jpg"
                    title="Adventures"
                    description="Unique activities we can do together, led by a world of hosts."
                />   
            </div>
            <div className="home__section">
                <Card 
                    src="https://media.nomadicmatt.com/2019/airbnb_breakup3.jpg"
                    title="3 Bedroom Flat in Bournemouth"
                    description="Superhost with a stunning view of the beachside in Sunny Bournemouth"
                    price="£130/night"
                />
                <Card 
                    src="https://thespaces.com/wp-content/uploads/2017/08/Courtesy-of-Airbnb.jpg"
                    title="Penthouse in London"
                    description="Enjoy the amazing sights of London with this stunning penthouse"
                    price="£350/night"
                />
                <Card 
                    src="https://media.nomadicmatt.com/2018/apartment.jpg"
                    title="1 Bedroom apartment"
                    description="Superhost with great amenities and a fabolous shopping complex nearby"
                    price="£70/night"
                 />
            </div>
        </div>

    )
}