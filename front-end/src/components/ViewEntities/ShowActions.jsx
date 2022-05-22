import { differenceInHours } from 'date-fns'
import { Action } from 'history';
import React from 'react'
import { useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import ReservationService from '../../services/ReservationService'
import './BookableDetails.css'


export default function ShowActions(props) {
    
    function getOriginalPrice(action) {
        let originalPrice;
        let hours = getNumberOfHours(action)
        let days = Math.floor(hours / 24)
        let leftHours = hours % 24
        if (props.bookableType === "cottage" || props.bookableType === "boat") {
            originalPrice = days * props.dailyPrice + leftHours * props.hourlyPrice
        } else {
            //adventure
            originalPrice = hours * props.hourlyPrice
        }
        return originalPrice
    }

    function getNumberOfHours(action) {
        let startDateTime = new Date(action.startDateTime)
        let endDateTime = new Date(action.endDateTime)
        return Math.abs(endDateTime - startDateTime) / 36e5;
    }

    function getFormattedMinutes(minutes) {
        let formattedMins = minutes < 10 ? '0' + minutes : minutes
        return formattedMins
    }

    function makeQuickReservation(event) {
        const {value} = event.target
        ReservationService.addQuickReservation(value).then(response =>{
            alert("Success");
        })

    }
    
    return (
        <div className='showActions'>
            <h4> Make a quick reservation</h4>
            <div>
                {props.actions.map(action => (
                    
                    //datum
                    //satnica
                    //originalna cena
                    //popust
                    
                    <div className='showActionContainer'>
                        <div className='showAction'>
                            <div className="leftActionContainer">
                                <div className="showActionDates">
                                    <div className="actionDate">
                                        <div>
                                            <label>Start date: </label>
                                            <span>{new Date(action.startDateTime).getDate()}.{new Date(action.startDateTime).getMonth()+1}.{new Date(action.startDateTime).getFullYear()}.</span>
                                        </div>
                                        <div>
                                            <label>End date: </label>
                                            <span>{new Date(action.endDateTime).getDate()}.{new Date(action.endDateTime).getMonth()+1}.{new Date(action.endDateTime).getFullYear()}.</span>
                                        </div>
                                    </div>
                                    <div className='actionTime'>
                                        <div>
                                            <label>Check in: </label>
                                            <span>{new Date(action.startDateTime).getHours()}:{getFormattedMinutes(new Date(action.startDateTime).getMinutes())}</span>
                                        </div>
                                        <div>
                                            <label>Check out: </label>
                                            <span>{new Date(action.endDateTime).getHours()}:{getFormattedMinutes(new Date(action.endDateTime).getMinutes())}</span>
                                        </div>
                                    </div>
                                </div>
                                <span>Action available until: {new Date(action.expirationDate).getDate()}.{new Date(action.expirationDate).getMonth()+1}.{new Date(action.expirationDate).getFullYear()}. {new Date(action.expirationDate).getHours()}:{getFormattedMinutes(new Date(action.expirationDate).getMinutes())}</span>
                            </div>
                            <div className='rightActionContainer'>
                                    <div className="showActionPrice">
                                        <div>
                                            <span>{Math.floor(getNumberOfHours(action) / 24)} nights, {action.personLimit} people</span>
                                        </div>
                                        <div className='originalAndDiscountPrice'>
                                            <label>RSD {getOriginalPrice(action)}</label>
                                            <span>RSD {action.price}</span>
                                        </div>


                                    </div>
                                    <Button className = "availability--periods--submit" 
                                            onClick={makeQuickReservation}
                                            value={action.id}
                                            variant="contained"
                                            sx = {{background:"#FF5A5F",'&:hover': {
                                            backgroundColor: '#FF5A5F',
                                            color: 'black',
                                            },}}>Book now
                                    </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}