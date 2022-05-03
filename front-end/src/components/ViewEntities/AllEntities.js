import React from "react"
import CottageIcon from '@mui/icons-material/Cottage'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import PhishingIcon from '@mui/icons-material/Phishing'
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import BoatService from "../../services/BoatService"
import EntityCard from "./EntityCard"
import "./EntityCard.css"
import { selectUnstyledClasses } from "@mui/base"

function AllEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [entityType, setEntityType] = React.useState("cottage")
    const [priority, setPriority] = React.useState("price")
    const [cottageButtonStyle, setCottageButtonStyle] = React.useState("entityButton")
    const [boatButtonStyle, setBoatButtonStyle] = React.useState("entityButton")
    const [adventureButtonStyle, setAdventureButtonStyle] = React.useState("entityButton")

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
        //setPriority(value)
    }

    const cards = allCards.map(item => {
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
    })        

    return (
        <div className="allEntities">
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
            {cards}
        </div>
    )
}

export default AllEntities