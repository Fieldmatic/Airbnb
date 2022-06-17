import React from "react"
import { BiFilter } from 'react-icons/bi';
import Header from "../../Header";
import FilterPopup from './FilterPopup'
import Entity from "../Bookable/Entity"
import ClientService from "../../services/ClientService";
import { useLocation } from "react-router-dom";



export default function ShowWishList() {
    const [cottages, setCottages] = React.useState([])
    const [boats, setBoats] = React.useState([])
    const [adventures, setAdventures] = React.useState([])

    let location = useLocation();

    let cottageCards = []
    let boatCards = []
    let adventureCards = []

    React.useEffect(() => {
        ClientService.getClientCottages().then((response) => {
            setCottages(response.data) 
        })
        ClientService.getClientBoats().then((response) => {
            setBoats(response.data) 
        })
        ClientService.getClientAdventures().then((response) => {
            setAdventures(response.data) 
        })
        
    }, [location])
    
    cottageCards = cottages.map(item => {
        return makeCard(item, "cottage")})

    boatCards = boats.map(item => {
        return makeCard(item, "boat")})

    adventureCards = adventures.map(item => {
        return makeCard(item, "adventure")})

    function makeCard(item, type) {
        return (<Entity
            key={item.id}
            id={item.id}
            name={item.name}
            rating={item.rating}
            dailyRate={item.dailyRate}
            hourlyRate={item.hourlyRate}
            address={item.address}
            promotionalDescription={item.promotionalDescription}
            additionalServices={item.additionalServices}
            capacity={item.capacity}
            showAll={true}
            entity={type}
            user="client"
            favorite={true}
            />)
    }

    function checkIfAllListAreEmpty() {
        if ((cottageCards.length === 0) && (boatCards.length === 0) && (adventureCards.length === 0)) {
            return true;
        } return false;
    }
    

    return (
        <div>
        <Header />
        <div className="show_entities">
            <div className="numberOfEntities">
                {checkIfAllListAreEmpty() && <h4> Your wish list is empty. </h4>}
            </div>
            {cottageCards}
            {boatCards}
            {adventureCards}
        </div>
        </div>
    )
}