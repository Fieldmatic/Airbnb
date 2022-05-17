import React from "react"
import PersonIcon from '@mui/icons-material/Person';


export default function EntityDetails(props) {

    var persons = []
    for (let i = 0; i < props.capacity; i++) {
        persons.push(<PersonIcon />)
    }

    return(
        <div className="adventureCapacity">
            <span> Number of guests</span>
            {persons}
        </div>
    )
}