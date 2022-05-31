import React from "react"
import SearchIcon from '@mui/icons-material/Search';
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import Entity from "./Entity";
import Header from "../../Header";
import { BiFilter } from 'react-icons/bi';
import FilterPopup from '../ViewEntities/FilterPopup'
import "./ViewHostEntities.css";
import LoginRegisterService from "../../services/LoginRegisterService";
import {TextField} from "@material-ui/core";

function ViewHostEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [entityType, setEntityType] = React.useState("")
    const [priority, setPriority] = React.useState("priceLowest")
    const [filterPopup, setFilterPopup] = React.useState(false)
    const [entitiesEdited, setEntitiesEdited] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState({
        name : "",
        address : "",
        description : ""
    })

    const [chosenParams, setChosenParams] = React.useState({
        priceValue: 0,
        rating: "anyRate",
        bedroomNum: "anyRooms",
        bedsNum: "anyBeds",
        maxSpeed: "anyMaxSpeed",
        capacity: "anyCapacity",
        boatType: []
    })

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
        setSearchQuery(prevState => ({
            ...prevState,
            [name] : value
        }))
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
            AdventureService.getInstructorAdventures().then((response) => {
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

    function openPopup(event) {
        event.preventDefault()
        setFilterPopup(true)
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

    function filterCardBySearch(item) {
        if (checkCard(item)) return makeCard(item)
    }

    function checkCard(item) {
        let i = 0;
        if (searchQuery.name === "" || ifCardContainsName(item.name)) i++;;
        if (searchQuery.description === "" || ifCardContainsDescription(item.promotionalDescription)) i++;
        if (searchQuery.address === "" || ifCardContainsAddress(item.address)) i++;

        if (i === 3) return true;
        else return false;
    }

    function ifCardContainsName(name) {
        if (searchQuery.name !=="" && name.toLowerCase().includes(searchQuery.name.toLowerCase()))
            return true;
    }

    function ifCardContainsDescription(description) {
        if (searchQuery.description !=="" && description.toLowerCase().includes(searchQuery.description.toLowerCase()))
            return true;
    }

    function ifCardContainsAddress(address) {
        if (searchQuery.address !=="" && (
            address.street.toLowerCase().includes(searchQuery.address.toLowerCase()) || 
            address.city.toLowerCase().includes(searchQuery.address.toLowerCase()) ||
            address.state.toLowerCase().includes(searchQuery.address.toLowerCase()) 
            ))
            return true;
    }

    function makeCard(item) {
        return (<Entity
            key={item.id}
            id={item.id}
            name={item.name}
            rating={item.rating}
            dailyRate={item.dailyRate}
            hourlyRate={item.hourlyRate}
            address={item.address}
            promotionalDescription={item.promotionalDescription}
            entity={entityType}
            user="owner"
            />)
    }

    var maximalPrice, minimalPrice;
    if (entityType === "adventure") {
        maximalPrice = Math.max(...allCards.map(o => o.hourlyRate))
        //minimalPrice = Math.min(...allCards.map(o => o.hourlyRate))
    } else {
        maximalPrice = Math.max(...allCards.map(o => o.dailyRate))
        //minimalPrice = Math.min(...allCards.map(o => o.dailyRate))
    }
    //console.log(minimalPrice)

    //sortiranje po rating i number of reviews
    var cards;
    if (entityType === "cottage") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.bedroomNum === "anyRooms" || (chosenParams.bedroomNum === "8+" && getNumberOfBedrooms(item) === 8) || parseFloat(chosenParams.bedroomNum) === getNumberOfBedrooms(item))
                        .filter(item => chosenParams.bedsNum === "anyBeds" || parseFloat(chosenParams.bedsNum) === getNumberOfBeds(item))
                        .map(item => filterCardBySearch(item)) 
    } else if (entityType === "boat") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.maxSpeed === "anyMaxSpeed" || (chosenParams.maxSpeed === "30+" && item.maxSpeed >= 30) || (chosenParams.maxSpeed === "50+" && item.maxSpeed >= 50) || (chosenParams.maxSpeed === "80+" && item.maxSpeed >= 80))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) >= item.capacity) || (chosenParams.capacity === "7+" && item.capacity >= 7))
                        .map(item => filterCardBySearch(item)) 
    } else {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.hourlyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) >= item.capacity) || (chosenParams.capacity === "7+" && item.capacity >= 7))
                        .map(item => filterCardBySearch(item))   

    }

    return (
        <div>
        <Header />
        <div className="show_entities">
        {filterPopup && <FilterPopup trigger={filterPopup} setTrigger={setFilterPopup} value={entityType} getFilters={setChosenParams} maxPrice = {maximalPrice}></FilterPopup>}
            <div className="search_sort_filter">
                <div className="sort">
                        <select 
                            name="type"
                            onChange={handleChange}
                        >
                            <option value="priceLowest">Price (lowest first)</option>
                            <option value="priceHighest">Price (highest first)</option>
                            <option value="rating">Rating</option>
                            <option value="ratingPrice">Best rating and lowest price</option>
                        </select>
                </div>         
                <div className='search'>
                    <div>
                        <TextField
                            className="search-field"
                            name="name"
                            value={searchQuery.name}
                            onChange = {handleSearch}
                            variant="standard"
                            label="Name"
                            width="fit-content"
                            InputProps={{
                                disableUnderline: true,
                            }}

                        />
                        <SearchIcon className="searchIcon"/>
                    </div>
            
                    <div>
                        <TextField
                            className="search-field"
                            name="address"
                            value={searchQuery.address}
                            onChange = {handleSearch}
                            variant="standard"
                            label="Address"
                            InputProps={{
                                disableUnderline: true,
                            }}
                        />
                        <SearchIcon className="searchIcon"/>
                    </div>

                    <div>
                    <TextField
                            className="search-field"
                            name="description"
                            value={searchQuery.description}
                            onChange = {handleSearch}
                            variant="standard"
                            label="Description"
                            InputProps={{
                                disableUnderline: true
                            }}
                        />                        
                        <SearchIcon className="searchIcon"/> 
                    </div>
                </div> 
                <div className="filter">
                        <button onClick={openPopup}> <BiFilter/> Filters</button>
                </div>
            </div>
            <div className="numberOfEntities"><h3>{cards.length} {entityType}{cards.length !== 1? "s" : ""} found</h3></div>
            {cards}
        </div>
        </div>
    )
}

export default ViewHostEntities