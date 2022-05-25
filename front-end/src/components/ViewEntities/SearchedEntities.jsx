import React from "react"
import SearchIcon from '@mui/icons-material/Search';
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import SearchResult from "./SearchResult";
import Header from "../../Header";
import {Button} from "@mui/material"
import LoginRegisterService from "../../services/LoginRegisterService";
import {useLocation} from 'react-router-dom';

function SearchedEntities() {
    const [allCards, setAllCards] = React.useState([])
    //const [entityType, setEntityType] = React.useState("")
    const location = useLocation();
    const [priority, setPriority] = React.useState("priceLowest")
    const [searchQuery, setSearchQuery] = React.useState("")

    function handleSearch(event) {
        const {name, value} = event.target
        setSearchQuery(value)
    }

    React.useEffect(() => {
        console.log(location.state)

        if (location.state.entityType === "cottage") {
            CottageService.getAvailableCottages({startDate:location.state.startDateTime, endDate:location.state.endDateTime,city:location.state.city, capacity:location.state.guestsNumber}).then((response) => {
                setAllCards(response.data)
            })
        } else if (location.state.entityType === "boat") {
            BoatService.getOwnerBoats().then((response) => {
                setAllCards(response.data)
            })
        } else if (location.state.entityType === "adventure"){
            AdventureService.getAllAdventures().then((response) => {
                setAllCards(response.data) 
            })
        }
    },[priority])

    function handleChange(event) {
        const {name, value} = event.target
        setPriority(value)
    }

    const cards = allCards.map(item => {
        if (searchQuery !=="" && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            {
            return (
                <SearchResult
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rating={item.rating}
                    dailyRate={item.dailyRate}
                    hourlyRate={item.hourlyRate}
                    address={item.address}
                    promotionalDescription={item.promotionalDescription}
                    entity={location.state.entityType}
                />
            )
            }
        else if (searchQuery === "") {
            return (
                <SearchResult
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rating={item.rating}
                    dailyRate={item.dailyRate}
                    hourlyRate={item.hourlyRate}
                    address={item.address}
                    promotionalDescription={item.promotionalDescription}
                    entity={location.state.entityType}
                />
            )
        }
    })        

    return (
        <div>
            <Header />
            <div className="search_sort">
                <div className='search'>
                    <input type ='text' value={searchQuery}  onChange = {handleSearch}/>
                    <SearchIcon/>        
                </div>
                <div className="sort">
                    <select 
                        className="form--type"
                        name="type"
                        onChange={handleChange}
                    >
                        <option value="priceLowest">Price (lowest first)</option>
                        <option value="priceHighest">Price (highest first)</option>
                        <option value="rating">Rating</option>
                        <option value="ratingPrice">Best rating and lowest price</option>
                    </select>
                </div>              
                
            </div>
            <div className="viewEntities">
                {cards}
            </div>
        </div>
    )
}

export default SearchedEntities