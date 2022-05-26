import React,{useEffect,useState} from 'react';
import './ReservationHistory.css';
import Header from '../../Header';
import ReservationsTable from './ReservationsTable';
import ReservationService from "../../services/ReservationService"


function ReservationHistory(){



    return (
        <div className='reservation--history'>
            <div className='reservation--container'>
                <Header />
                <ReservationsTable/>
            </div>

        </div>
    )
}

export default ReservationHistory