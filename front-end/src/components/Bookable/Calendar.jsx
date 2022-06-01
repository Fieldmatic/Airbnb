import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import BookableService from '../../services/BookableService'
import './calendar.scss'


export default function Calendar({ bookableId, updateType }) {

    const [availablePeriod, setAvailablePeriod] = React.useState([]);
    const [rentedPeriod, setRentedPeriod] = React.useState([]);
    const [actionPeriod, setActionPeriod] = React.useState([]);

    React.useEffect(() => {
        BookableService.getBookableAvailable(bookableId).then((response) => {
            setAvailablePeriod(response.data);
        })
    }, [updateType === "AVAILABLE_PERIOD"]);

    React.useEffect(() => {
        BookableService.getBookableReservations(bookableId).then((response) => {
            setRentedPeriod(response.data);
        })
    }, []);

    React.useEffect(() => {
        BookableService.getBookableActions(bookableId).then((response) => {
            setActionPeriod(response.data);
        })
    }, [updateType === "ACTION"]);

  
    return (
        <div className="wrapper-calendar">
            <h1 className="calendar-header">Calendar</h1>
            <div className="calendar-body">
            <FullCalendar
                headerToolbar={{start: 'today prev,next', center: 'title', end: 'dayGridMonth timeGridWeek'}}
                plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                initialView="dayGridMonth"
                events={availablePeriod.concat(rentedPeriod, actionPeriod)}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                }}
            />
            </div>
        </div>
    )
}