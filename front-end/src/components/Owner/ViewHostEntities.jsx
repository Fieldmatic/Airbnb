import React from "react"
import SearchIcon from '@mui/icons-material/Search';
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import SearchResult from "./Entity";
import Header from "../../Header";
import {Button} from "@mui/material"
import "./ViewHostEntities.css";
import LoginRegisterService from "../../services/LoginRegisterService";

function ViewHostEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [entityType, setEntityType] = React.useState("")
    const [priority, setPriority] = React.useState("priceLowest")
    const [searchQuery, setSearchQuery] = React.useState("")
    const [entitiesEdited, setEntitiesEdited] = React.useState(false)

    function showAllCottages() {
        setEntityType("cottage")
    }

    function showAllBoats() {
        setEntityType("boat")
    }

    function showAllAdventures() {
        setEntityType("adventure")
    }

    function handleSearch(event) {
        const {name, value} = event.target
        setSearchQuery(value)


    }

    React.useEffect(() => {
        LoginRegisterService.getUserRole().then(response => {
            if (response.data === "ROLE_COTTAGE_OWNER") setEntityType("cottage")
            else if (response.data === "ROLE_BOAT_OWNER") setEntityType("boat")
            else setEntityType("adventure")
        })

        if (entityType === "cottage") {
            CottageService.getOwnerCottages().then((response) => {
                setAllCards(response.data)
                showAllCottages() 
            })
        } else if (entityType === "boat") {
            BoatService.getOwnerBoats().then((response) => {
                setAllCards(response.data)
                showAllBoats() 
            })
        } else if (entityType === "adventure"){
            AdventureService.getAllAdventures().then((response) => {
                setAllCards(response.data) 
                showAllAdventures()
            })
        }
        setEntitiesEdited(false)
    },[entityType, priority, entitiesEdited])

    function handleChange(event) {
        const {name, value} = event.target
        setPriority(value)
    }

    if (priority === "priceLowest" || priority === "ratingPrice") {
        if (entityType == "adventure") {
            allCards.sort((card1, card2) => (card1.hourlyRate > card2.hourlyRate) ? 1 : -1)
        } else {
            allCards.sort((card1, card2) => (card1.dailyRate > card2.dailyRate) ? 1 : -1)        }
    } 
    if (priority === "rating" || priority === "ratingPrice" || priority === "ratingReviews") {
        allCards.sort((card1, card2) => (card1.rating > card2.rating) ? -1 : 1)
    }
    if (priority === "priceHighest") {
        if (entityType == "adventure") {
            allCards.sort((card1, card2) => (card1.hourlyRate > card2.hourlyRate) ? -1 : 1)
        } else {
            allCards.sort((card1, card2) => (card1.dailyRate > card2.dailyRate) ? -1 : 1)
        }
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
                    entity={entityType}
                    setEntitiesEdited={setEntitiesEdited}
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
                    entity={entityType}
                    setEntitiesEdited={setEntitiesEdited}
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
            <div className="viewEntities__info">
                <h1>{cards.length} entities</h1>
                <Button variant="outlined">Cancellation Flexibility</Button>
                <Button variant="outlined">Type of place</Button>
                <Button variant="outlined">Price</Button>
                <Button variant="outlined">Rooms and beds</Button>
                <Button variant="outlined">More filters</Button>
            </div>
                {cards}
            </div>
        </div>
    )
}

export default ViewHostEntities