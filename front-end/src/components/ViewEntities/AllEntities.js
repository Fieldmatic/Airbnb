import React from "react"
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import { BiFilter } from 'react-icons/bi';
import Header from "../../Header";
import FilterPopup from './FilterPopup'
import Entity from "../Bookable/Entity"
import {useLocation} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {TextField} from "@material-ui/core";


function AllEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [priority, setPriority] = React.useState("priceLowest")
    const [filterPopup, setFilterPopup] = React.useState(false)
    const location = useLocation();
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

    React.useEffect(() => {
        if (location.state.showAll === true) {
            if (location.state.entityType === "cottage") {
                CottageService.getAllCottages().then((response) => {
                    setAllCards(response.data) 
                })
            } else if (location.state.entityType === "boat") {
                BoatService.getAllBoats().then((response) => {
                    setAllCards(response.data) 
                })
            } else {
                AdventureService.getAllAdventures().then((response) => {
                    setAllCards(response.data) 
                })
            }
        } else {
            //pozvan search po periodu
            if (location.state.entityType === "cottage") {
                CottageService.getAvailableCottages({startDate:location.state.startDateTime, endDate:location.state.endDateTime, city:location.state.city, capacity:location.state.guestsNumber}).then((response) => {
                    setAllCards(response.data)
                })
            } else if (location.state.entityType === "boat") {
                BoatService.getAvailableBoats({startDate:location.state.startDateTime, endDate:location.state.endDateTime, city:location.state.city, capacity:location.state.guestsNumber}).then((response) => {
                    setAllCards(response.data)
                })
            } else if (location.state.entityType === "adventure"){
                AdventureService.getAvailableAdventures({startDate:location.state.startDateTime, endDate:location.state.endDateTime, city:location.state.city, capacity:location.state.guestsNumber}).then((response) => {
                    setAllCards(response.data)
                })
            }
        }
    }, [location.state.entityType, priority])

    function handleChange(event) {
        const {value} = event.target
        setPriority(value)
    }

    if (priority === "priceLowest" || priority === "ratingPrice") {
        if (location.state.entityType === "adventure") {
            allCards.sort((card1, card2) => (card1.hourlyRate > card2.hourlyRate) ? 1 : -1)
        } else {
            allCards.sort((card1, card2) => (card1.dailyRate > card2.dailyRate) ? 1 : -1)        }
    } 
    if (priority === "rating" || priority === "ratingPrice" || priority === "ratingReviews") {
        allCards.sort((card1, card2) => (card1.rating > card2.rating) ? -1 : 1)
    }
    if (priority === "priceHighest") {
        if (location.state.entityType === "adventure") {
            allCards.sort((card1, card2) => (card1.hourlyRate > card2.hourlyRate) ? -1 : 1)
        } else {
            allCards.sort((card1, card2) => (card1.dailyRate > card2.dailyRate) ? -1 : 1)
        }
    }

    function openPopup(event) {
        event.preventDefault()
        setFilterPopup(true)
    }    

    function getNumberOfBeds(entity) {
        let bedsNum = 0;
        bedsNum += entity.singleRooms + entity.doubleRooms + entity.tripleRooms + entity.quadRooms;
        return bedsNum;
    }

    function getNumberOfBedrooms(entity) {
        let bedroomsNum = 0;
        bedroomsNum += entity.singleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.doubleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.tripleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.quadRooms == 0 ? 0 : 1;
        return bedroomsNum;
    }

    
    //sortiranje po rating i number of reviews
    var cards;
    console.log(chosenParams.boatType)
    //console.log(chosenParams.boatType[item.boatType])
    if (location.state.entityType === "cottage") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[2]) >= item.rating))
                        .filter(item => chosenParams.bedroomNum === "anyRooms" || (chosenParams.bedroomNum === "8+" && getNumberOfBedrooms(item) === 8) || parseFloat(chosenParams.bedroomNum) === getNumberOfBedrooms(item))
                        .filter(item => chosenParams.bedsNum === "anyBeds" || parseFloat(chosenParams.bedsNum) === getNumberOfBeds(item))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (chosenParams.capacity === "7+" && item.capacity >= 7) || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) > item.capacity))
                        .map(item => filterCardBySearch(item)) 
    } else if (location.state.entityType === "boat") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[2]) >= item.rating))
                        .filter(item => chosenParams.maxSpeed === "anyMaxSpeed" || (item.maxSpeed >= parseFloat(chosenParams.maxSpeed.split("+")[0])))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (chosenParams.capacity === "7+" && item.capacity >= 7) || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) > item.capacity))
                        .filter(item => (chosenParams.boatType["Any"]) || (chosenParams.boatType[item.type]))
                        .map(item => filterCardBySearch(item)) 
    } else {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.hourlyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[2]) >= item.rating))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (chosenParams.capacity === "7+" && item.capacity >= 7) || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) > item.capacity))
                        .map(item => filterCardBySearch(item))   

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
            additionalServices={item.additionalServices}
            capacity={location.state.showAll ? item.capacity : location.state.guestsNumber}
            startDateTime={location.state.startDateTime}
            endDateTime={location.state.endDateTime}
            showAll={location.state.showAll}
            entity={location.state.entityType}
            user="client"
            favorite={false}
            />)
    }

    var maximalPrice, minimalPrice;
    if (location.state.entityType === "adventure") {
        maximalPrice = Math.max(...allCards.map(o => o.hourlyRate))
        minimalPrice = Math.min(...allCards.map(o => o.hourlyRate))
    } else {
        maximalPrice = Math.max(...allCards.map(o => o.dailyRate))
        minimalPrice = Math.min(...allCards.map(o => o.dailyRate))
    }

    function handleSearch(event) {
        const {name, value} = event.target
        setSearchQuery(prevState => ({
            ...prevState,
            [name] : value
        }))
    }

    

    return (
        <div>
        <Header />
        <div className="show_entities">
            {filterPopup && <FilterPopup trigger={filterPopup} setTrigger={setFilterPopup} value={location.state.entityType} getFilters={setChosenParams} maxPrice = {maximalPrice} minPrice = {minimalPrice}></FilterPopup>}
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
            <div className="numberOfEntities"><h4>{cards.length} {location.state.entityType}{cards.length !== 1? "s" : ""} found</h4></div>
            {cards}
        </div>
        </div>
    )
}

export default AllEntities