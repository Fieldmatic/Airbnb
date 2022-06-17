import React from 'react'
import { useParams } from 'react-router-dom'
import ActionPanel from './ActionPanel';
import Header from '../../Header';
import Calendar from "./Calendar";


function Actions(){
    let {id} = useParams();

    const [updateType, setUpdateType] = React.useState({
        availablePeriod: false,
        reservation: false,
        action: false
    });

    const updateCalendar = (newType) => {
        if (newType === "AVAILABLE_PERIOD") {
            setUpdateType(prevVal => {
                return {
                    ...prevVal,
                    availablePeriod: !prevVal.availablePeriod
                }
            });
        }
        else if (newType === "ACTION") {
            setUpdateType(prevVal => {
                return {
                    ...prevVal,
                    action: !prevVal.action
                }
            });
        }
        else {
            setUpdateType(prevVal => {
                return {
                    ...prevVal,
                    reservation: !prevVal.reservation
                }
            });
        }
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