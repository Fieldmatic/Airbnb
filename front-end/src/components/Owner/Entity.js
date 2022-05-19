import React from 'react';
import "./Entity.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import {Navigate} from "react-router-dom";
import CottageService from '../../services/CottageService';
import BoatService from "../../services/BoatService"
import AdventureService from "../../services/AdventureService"
import LocationOnIcon from '@mui/icons-material/LocationOn';

function entity(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [profileImage, setProfileImage] = React.useState(undefined)
    const [redirect, setRedirect] = React.useState("");

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

   if (redirect) {
    return (
        <Navigate to={redirect}/>
    )
    }

    function redirectToEntityDetails(event) {
        event.preventDefault()
        setRedirect(`/bookableDetails/${props.id}&${props.entity}`)
    }

    return (
        <div className="entities">
            {profileImage && <img src={URL.createObjectURL(profileImage)}  alt=""/>}
            <FavoriteBorderIcon className="entity__heart" />
          
            <div className="entity__info">
                <div className="entity__infoTop">
                    <h3>{props.name}</h3>
                    <div className='entity__location'>
                        <LocationOnIcon className = 'location_icon'style={{ color: '#ff7779' }}/>   
                        <p>{props.address.city}, {props.address.state}</p>
                    </div>        
                    <p>____________________________</p>
                    <p>{props.promotionalDescription}</p>
                </div>
                <div className="entity__infoBottom">
                    <div className="entity__stars">
                        <StarIcon className="entity__star" />
                        <p><strong>{props.rating}</strong></p>
                    </div>
                    <div className="entity__price">
                        <h2>€{props.entity === "adventure"? props.hourlyRate : props.dailyRate} /night </h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default entity
