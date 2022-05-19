import React from "react"
import CottageIcon from '@mui/icons-material/Cottage'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import PhishingIcon from '@mui/icons-material/Phishing'
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import EntityCard from "./EntityCard"
import { BiFilter } from 'react-icons/bi';
import "./EntityCard.css"
import Header from "../../Header";
import SearchPopup from './SearchPopup'
import { getFunctionName } from "@mui/utils/getDisplayName"

function AllEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [entityType, setEntityType] = React.useState("cottage")
    const [priority, setPriority] = React.useState("priceLowest")
    const [cottageButtonStyle, setCottageButtonStyle] = React.useState("entityButton")
    const [boatButtonStyle, setBoatButtonStyle] = React.useState("entityButton")
    const [adventureButtonStyle, setAdventureButtonStyle] = React.useState("entityButton")
    const [filterPopup, setFilterPopup] = React.useState(false)
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

    React.useEffect(() => {
        if (entityType === "cottage") {
            setCottageButtonStyle("entityButtonWithBorder")
            setBoatButtonStyle("entityButton")
            setAdventureButtonStyle("entityButton")
            CottageService.getAllCottages().then((response) => {
                setAllCards(response.data) 
            })
        } else if (entityType === "boat") {
            setCottageButtonStyle("entityButton")
            setBoatButtonStyle("entityButtonWithBorder")
            setAdventureButtonStyle("entityButton")
            BoatService.getAllBoats().then((response) => {
                setAllCards(response.data) 
            })
        } else {
            setCottageButtonStyle("entityButton")
            setBoatButtonStyle("entityButton")
            setAdventureButtonStyle("entityButtonWithBorder")
            AdventureService.getAllAdventures().then((response) => {
                setAllCards(response.data) 
            })
        }
    }, [entityType, priority])

    function handleChange(event) {
        const {name, value} = event.target
        setPriority(value)
    }

    if (priority === "priceLowest" || priority === "ratingPrice") {
        if (entityType === "adventure") {
            allCards.sort((card1, card2) => (card1.hourlyRate > card2.hourlyRate) ? 1 : -1)
        } else {
            allCards.sort((card1, card2) => (card1.dailyRate > card2.dailyRate) ? 1 : -1)        }
    } 
    if (priority === "rating" || priority === "ratingPrice" || priority === "ratingReviews") {
        allCards.sort((card1, card2) => (card1.rating > card2.rating) ? -1 : 1)
    }
    if (priority === "priceHighest") {
        if (entityType === "adventure") {
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
        console.log(bedsNum)
        console.log("bedsNum")
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
    if (entityType === "cottage") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.bedroomNum === "anyRooms" || (chosenParams.bedroomNum === "8+" && getNumberOfBedrooms(item) === 8) || parseFloat(chosenParams.bedroomNum) === getNumberOfBedrooms(item))
                        .filter(item => chosenParams.bedsNum === "anyBeds" || parseFloat(chosenParams.bedsNum) === getNumberOfBeds(item))
                        .map(item => makeCard(item))  
    } else if (entityType === "boat") {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.dailyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.maxSpeed === "anyMaxSpeed" || (chosenParams.maxSpeed === "30+" && item.maxSpeed >= 30) || (chosenParams.maxSpeed === "50+" && item.maxSpeed >= 50) || (chosenParams.maxSpeed === "80+" && item.maxSpeed >= 80))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) >= item.capacity) || (chosenParams.capacity === "7+" && item.capacity >= 7))
                        .map(item => makeCard(item))  
    } else {
        cards = allCards.filter(item => chosenParams.priceValue === 0 || item.hourlyRate <= chosenParams.priceValue)
                        .filter(item => chosenParams.rating === "anyRate" || (parseFloat(chosenParams.rating[0]) <= item.rating && parseFloat(chosenParams.rating[1]) >= item.rating))
                        .filter(item => chosenParams.capacity === "anyCapacity" || (parseInt(chosenParams.capacity[0]) <= item.capacity && parseInt(chosenParams.capacity[2]) >= item.capacity) || (chosenParams.capacity === "7+" && item.capacity >= 7))
                        .map(item => makeCard(item))   

    }
    
    function makeCard(item) {
        return (<EntityCard
                key={item.id}
                id={item.id}
                name={item.name}
                rating={item.rating}
                dailyRate={item.dailyRate}
                hourlyRate={item.hourlyRate}
                address={item.address}
                promotionalDescription={item.promotionalDescription}
                entity={entityType}
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
    

    return (
        <div>
            <Header />
            <div className="entities-view">
                {filterPopup && 
                <SearchPopup trigger={filterPopup} setTrigger={setFilterPopup} value={entityType} getFilters={setChosenParams} maxPrice = {maximalPrice}></SearchPopup>
                }
                <div className="searchFilterSort">
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
                    <div className="filter">
                        <button onClick={openPopup}> <BiFilter/> Filters</button>
                    </div>
                </div>
                <div className="entities">
                    <button className={cottageButtonStyle} onClick={showAllCottages}> 
                        <CottageIcon fontSize="large"></CottageIcon>
                        Cottages
                    </button>
                    <button className={boatButtonStyle} onClick={showAllBoats}>
                        <DirectionsBoatIcon fontSize="large"></DirectionsBoatIcon>
                        Boats
                    </button>
                    <button className={adventureButtonStyle} onClick={showAllAdventures}>
                        <PhishingIcon fontSize="large"></PhishingIcon>                
                        Adventures
                    </button>
                </div>
                {cards}
            </div>
        </div>
    )
}

export default AllEntities