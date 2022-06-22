import React from "react"
import PersonIcon from '@mui/icons-material/Person';



export default function BoatDetails(props) {

    return(
        <div className="boatDetails">
            <div className="boatParam">
                <h5> Number of engines: </h5>
                <span> {props.enginesNumber}</span>
            </div>
            <div className="boatParam">
                <h5> Engine power: </h5>
                <span> {props.enginePower}</span>
            </div>
            <div className="boatParam">
                <h5> Maximum speed: </h5>
                <span> {props.maxSpeed}</span>
            </div>
        </div>
    )
}