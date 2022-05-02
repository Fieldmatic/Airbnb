import React from "react"
import CottageService from "../../services/CottageService"
import LocationOnIcon from '@mui/icons-material/LocationOn'

export default function EntityCard(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)

    React.useEffect(() => {
                CottageService.getNumberOfReviews().then((response) => {
                    setReviewsNumber(response.data) 
           //         console.log(response.data)
                })
   }, [])

    return(
        <div className="entityCard"> 
            <img src={`../images/user.png`} className="entityCardImage" alt="user"/>
            <h1 className="entityCardName">{props.name}</h1>
            <LocationOnIcon className="addressLogo"></LocationOnIcon>            
            <p className="entityCardAddress"> {props.address}</p>
            <p className="entityCardDescription">{props.promotionalDescription}</p> 
            <div className="entityCardGrade"> 
               <span> {reviewsNumber}</span>
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