import React from "react"
import CottageService from "../../services/CottageService"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BoatService from "../../services/BoatService"
import AdventureService from "../../services/AdventureService"

export default function EntityCard(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)

    React.useEffect(() => {
        if (props.entityType === "cottage") {
            CottageService.getNumberOfCottageReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        } else if (props.entityType === "boat") {
            BoatService.getNumberOfBoatReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        //avanture
        } else {
            AdventureService.getNumberOfAdventureReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        }
   }, [])

    return(
        <div className="entityCard"> 
            <img src={`../images/user.png`} className="entityCardImage" alt="user"/>
            <h1 className="entityCardName">{props.name}</h1>
            <LocationOnIcon className="addressLogo"></LocationOnIcon>            
            <p className="entityCardAddress"> {props.address.city}, {props.address.state}</p>
            <p className="entityCardDescription">{props.promotionalDescription}</p> 
            <p className="entityCardReviews">{reviewsNumber} reviews</p>
            <div className="entityCardGrade"> 
                <span> Rating: </span>
                <span className="entityCardGrade"> {props.rating}</span>
            </div>
            <p className="entityCardPrices"> RSD {props.dailyRate} </p>
            <button className="entityCardButton"> Explore</button>
        </div>
    )
}
//ime
//adresa
//profilePicture
//rating
//promotionalDescription