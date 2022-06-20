import React from "react"
import PersonIcon from '@mui/icons-material/Person';


export default function EntityDetails(props) {

    var persons = []
    for (let i = 0; i < props.capacity; i++) {
        persons.push(<PersonIcon />)
    }

    var equipmentStr = ""
    for (let i = 0; i < props.equipment.length; i++) {
        equipmentStr += props.equipment[i] + "  "
    }

    return(
        <>
            <div className="adventureCapacity">
                <span> Number of guests</span>
                {persons}
            </div>
            <div className="paragraphs">
                <h3>Fishing equipment</h3>
                <p>{equipmentStr}</p>
            </div>
        </>
    )
}