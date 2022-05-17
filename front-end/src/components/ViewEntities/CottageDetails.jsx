import React from "react"
import BedIcon from '@mui/icons-material/Bed';
import KeyIcon from '@mui/icons-material/Key';


export default function CottageDetails(props) {

    return(
        <div className="cottageCapacity">
            <div className="bedrooms">
                <KeyIcon/> 
                <span className="capacityTitle">Bedrooms</span>
                <span className="capacityNum">{props.roomsNum}</span>
            </div>
            <div className="beds">
                <BedIcon/> 
                <span className="capacityTitle">Beds</span>
                <span className="capacityNum">{props.bedsNum}</span>
            </div>
        </div>
    )
}