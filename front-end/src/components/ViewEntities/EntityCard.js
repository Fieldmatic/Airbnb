import React from "react"
import CottageService from "../../services/CottageService"
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BoatService from "../../services/BoatService"
import AdventureService from "../../services/AdventureService"

export default function EntityCard(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [profileImage, setProfileImage] = React.useState(undefined)

    React.useEffect(() => {
        if (props.entity === "cottage") {
            CottageService.getNumberOfCottageReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            CottageService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        } else if (props.entity === "boat") {
            BoatService.getNumberOfBoatReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            BoatService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        //avanture
        } else {
            AdventureService.getNumberOfAdventureReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            AdventureService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        }
   }, [])

    return(
        <div className="entityCard"> 
            {profileImage && <img src={URL.createObjectURL(profileImage)} className="entityCardImage" alt="user"/>}
            <h1 className="entityCardName">{props.name}</h1>
            <LocationOnIcon className="addressLogo"></LocationOnIcon>            
            <p className="entityCardAddress"> {props.address.city}, {props.address.state}</p>
            <p className="entityCardDescription">{props.promotionalDescription}</p> 
            <p className="entityCardReviews">{reviewsNumber} reviews</p>
            <div className="entityCardGrade"> 
                <span> Rating: </span>
                <span className="entityCardGrade"> {props.rating}</span>
            </div>
            <p className="entityCardPrices"> RSD {props.entity === "adventure"? props.hourlyRate : props.dailyRate} </p>
            <button className="entityCardButton"> Explore</button>
        </div>
    )
}
//ime
//adresa
//profilePicture
//rating
//promotionalDescription