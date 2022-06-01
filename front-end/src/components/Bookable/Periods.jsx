import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../Header';
import PeriodPanel from './PeriodPanel';
import Calendar from './Calendar';

function Periods(){
    let {id} = useParams();

    const [updateType, setUpdateType] = React.useState("");

    const updateCalendar = (type) => {
        setUpdateType(type);
    }

    return (
        <div>
            <Header/>
            <div className="wrapper">
                <PeriodPanel bookableId={id} func={updateCalendar}/>
                <Calendar bookableId={id} updateType={updateType}/>
            </div>
        </div>
    )


}

export default Periods