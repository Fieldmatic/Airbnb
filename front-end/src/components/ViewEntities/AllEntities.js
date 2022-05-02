import React from "react"
import CottageIcon from '@mui/icons-material/Cottage'
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat'
import PhishingIcon from '@mui/icons-material/Phishing'
import CottageService from "../../services/CottageService"
import AdventureService from "../../services/AdventureService"
import EntityCard from "./EntityCard"
import "./EntityCard.css"

function AllEntities() {
    const [allCards, setAllCards] = React.useState([])
    const [reviewsNumber, setReviewsNumber] = React.useState(0)

    // React.useEffect(() => {
    //     CottageService.getAllCottages().then((response) => {
    //         setAllCottages(response.data) 
    //     })
    //     AdventureService.getAllAdventures().then((response) => {
    //         setAllAdventures(response.data) 
    //         console.log(response.data)
    //     })
    // }, [])

    function showAllCottages() {
        CottageService.getAllCottages().then((response) => {
            setAllCards(response.data) 
        })
    }

    function showAllAdventures() {
        AdventureService.getAllAdventures().then((response) => {
            setAllCards(response.data) 
        })
    }

    const cards = allCards.map(item => {
        return (
            <EntityCard 
                id={item.id}
                name={item.name}
                rating={item.rating}
                dailyRate={item.dailyRate}
                hourlyRate={item.hourlyRate}
                address={item.address}
                promotionalDescription={item.promotionalDescription}
            />
        )
    })        

    return (
        <div className="allEntities">
            <button className="entityButton" onClick={showAllCottages}> 
                <CottageIcon fontSize="large"></CottageIcon>
                Cottages
            </button>
            <button className="entityButton">
                <DirectionsBoatIcon fontSize="large"></DirectionsBoatIcon>
                Boats
            </button>
            <button className="entityButton" onClick={showAllAdventures}>
                <PhishingIcon fontSize="large"></PhishingIcon>                
                Adventures
            </button>
            {cards}
        </div>
    )
}

export default AllEntities