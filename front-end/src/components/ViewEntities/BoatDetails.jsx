import React from "react"
import PersonIcon from '@mui/icons-material/Person';



export default function BoatDetails(props) {

    var persons = []
    for (let i = 0; i < props.capacity; i++) {
        persons.push(<PersonIcon />)
    }

    return(
        <div className="boatDetails">
            <div className="boatParam">
                <h5> Number of guests: </h5>
                {persons}
            </div>
            <div className="boatParam">
                <h5> Number of engines: </h5>
                <span> {props.enginesNumber}</span>
            </div>
            <div className="boatParam">
                <h5> Engine power: </h5>
                <span> {props.enginePower}</span>
            </div>
            <div className="boatParam">
                <h5> Maximal speed: </h5>
                <span> {props.maxSpeed}</span>
            </div>
        </div>
    )
}