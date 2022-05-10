import React from "react"
import SearchIcon from '@mui/icons-material/Search';
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import EntityCard from "../ViewEntities/EntityCard"
import Header from "../../Header";

function ViewCottages(props) {
    const [allCards, setAllCards] = React.useState([])
    const [entityType, setEntityType] = React.useState("cottage")
    const [priority, setPriority] = React.useState("priceLowest")
    const [searchQuery, setSearchQuery] = React.useState("")

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
        if (props.entityType === "cottage") {
            CottageService.getOwnerCottages(props.id).then((response) => {
                setAllCards(response.data)
                showAllCottages() 
            })
        } else if (props.entityType === "boat") {
            BoatService.getAllBoats().then((response) => {
                setAllCards(response.data)
                showAllBoats() 
            })
        } else if (props.entityType === "adventure"){
            AdventureService.getAllAdventures().then((response) => {
                setAllCards(response.data) 
                showAllAdventures()
            })
        }
    }, [entityType, priority])

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
    //sortiranje po rating i number of reviews
    const cards = allCards.map(item => {
        if (searchQuery !=="" && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            {
            return (
                <EntityCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rating={item.rating}
                    dailyRate={item.dailyRate}
                    hourlyRate={item.hourlyRate}
                    address={item.address}
                    promotionalDescription={item.promotionalDescription}
                    entity={entityType}
                />
            )
            }
        else if (searchQuery === "") {
            return (
                <EntityCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    rating={item.rating}
                    dailyRate={item.dailyRate}
                    hourlyRate={item.hourlyRate}
                    address={item.address}
                    promotionalDescription={item.promotionalDescription}
                    entity={entityType}
                />
            )
        }
    })        

    return (
        <div>
            <Header />
            <div className="entities-view">
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
                {cards}
            </div>
        </div>
    )
}

export default ViewCottages