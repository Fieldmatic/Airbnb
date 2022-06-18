import React from 'react'
import "./Statistics.css"
import Header from '../../Header';
import { useParams } from 'react-router-dom'
import IncomeChart from './IncomeChart';
import ReservationsChart from './ReservationsChart';
export default function BookableStatistics() {
    let {id} = useParams();
    return (
        <div className='statistics'>
        <Header/>   
        <ReservationsChart bookableId = {id} allStatistics = {false}/>
        <IncomeChart bookableId = {id} allStatistics = {false}/>   
        </div>  
        );
}