import React,{useEffect,useState} from 'react';
import './ReservationHistory.css';
import Header from '../../Header';
import ReservationsTable from './ReservationsTable';
import ReservationService from "../../services/ReservationService"


function ReservationHistory(){
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        ReservationService.getReservations().then(response => 
            {
                setReservations(response.data)
            },
            
        )             
    }, [])

    return (
        <div className='reservation--history'>
            <div className='reservation--container'>
                <Header />
                <ReservationsTable reservations = {reservations}/>
            </div>

        </div>
    )
}

export default ReservationHistory