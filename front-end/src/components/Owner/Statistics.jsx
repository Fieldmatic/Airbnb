import React from 'react'
  import "./Statistics.css"
  import Header from '../../Header';
import IncomeChart from './IncomeChart';
import ReservationsChart from './ReservationsChart';
export default function Statistics() {
    return (
        <div className='statistics'>
        <Header/>   
        <ReservationsChart allStatistics = {true}/>
        <IncomeChart allStatistics = {true}/>   
        </div>  
        );
}


