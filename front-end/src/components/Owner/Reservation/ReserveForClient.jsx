import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../../Header';
import ReservationDateTimePanel from './ReservationDateTimePanel';
import Calendar from '../../Bookable/Calendar';
import LoginRegisterService from '../../../services/LoginRegisterService';

function ReserveForClient(){
    let {bookableId, email} = useParams();
    const [updateType, setUpdateType] = React.useState({
        availablePeriod: false,
        reservation: false,
        action: false
    });
    const [role, setRole] = useState(null);

    useEffect(() => {
        LoginRegisterService.getUserRole().then(response => {
            if (response.data === "ROLE_COTTAGE_OWNER") setRole("COTTAGE_OWNER")
            else if (response.data === "ROLE_BOAT_OWNER") setRole("BOAT_OWNER")
            else if (response.data ==="ROLE_INSTRUCTOR") setRole("INSTRUCTOR")
        })
        
    }, []) 

    const updateCalendar = () => {
        setUpdateType(prevVal => {
            return {
                ...prevVal,
                reservation: !prevVal.reservation
            }
        });
    }
    
    return (
        <div>
            <Header/>
            {role &&
            <div className="wrapper">
                <ReservationDateTimePanel bookableId={bookableId} email = {email} role = {role} func={updateCalendar}/>
                <Calendar bookableId={bookableId} updateType={updateType}/>
            </div>
            }
        </div>
    )


}

export default ReserveForClient