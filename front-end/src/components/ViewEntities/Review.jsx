import React from "react"
import ClientService from "../../services/ClientService"
import "./BookableDetails.css"
import StarRateIcon from '@mui/icons-material/StarRate';


export default function Review(props) {
    const [clientPicture, setClientPicture] = React.useState()

    
    React.useEffect(() => {
        ClientService.getClientProfilePicture(props.clientId).then(response => {
            setClientPicture(response.data)
        })
    }, [props.clientName]);


    var starsOwner = []
    for (let i = 0; i < props.ownerRating; i++) {
        starsOwner.push(<StarRateIcon key={i} />);
    }

    var starsBookable = []
    for (let i = 0; i < props.bookableRating; i++) {
        starsBookable.push(<StarRateIcon key={i} />);
    }

    let entityType;
    if (props.entity === "cottage") entityType = "Cottage"
    else if (props.entity === "boat") entityType = "Boat"
    else if (props.entity === "adventure") entityType = "Adventure"

    return (
        <div className="review">
            <div className="clientInfo">
                {clientPicture &&<img className="clientAvatar" src = {URL.createObjectURL(clientPicture)} alt="avatar"/>}
                <div className="clientNameEmail">
                    <span>{props.clientName} {props.clientSurname}</span>
                    <span className="clientEmailReview">{props.clientEmail}</span>
                </div>
            </div>
            <div className="reviewInfos">
                {props.ownerRating > 0 && <div className="reviewInfo">
                    <div className="reviewHeader">
                        <h5>Owner review: </h5>
                        <p>{starsOwner}</p>
                    </div>
                    <p>{props.ownerComment}</p>
                </div>}
                {props.bookableRating > 0 && <div className="reviewInfo">
                    <div className="reviewHeader">
                        <h5 className="reviewHeader">{entityType} review: </h5>
                        <p>{starsBookable}</p>
                    </div>
                    <p>{props.bookableComment}</p>
                </div>}
            </div>
            
        </div>
    )
}