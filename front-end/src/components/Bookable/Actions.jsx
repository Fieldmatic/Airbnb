import React from 'react'
import { useParams } from 'react-router-dom'
import ActionPanel from './ActionPanel';
import Header from '../../Header';
import Calendar from "./Calendar";


function Actions(){
    let {id} = useParams();

    const [updateType, setUpdateType] = React.useState("");

    const updateCalendar = (type) => {
        setUpdateType(type);
    }

    return (
        <div>
            <Header/>
            <div className="wrapper">
                <ActionPanel bookableId={id} func={updateCalendar}/>
                <Calendar bookableId={id} updateType={updateType}/>
            </div>
        </div>
    )


}

export default Actions