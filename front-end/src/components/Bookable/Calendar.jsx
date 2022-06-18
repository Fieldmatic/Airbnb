import React from 'react'
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import BookableService from '../../services/BookableService'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './calendar.scss'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #ff5a5a',
    boxShadow: 24,
    p: 4,
  };

export default function Calendar({ bookableId, updateType }) {

    const [availablePeriod, setAvailablePeriod] = React.useState([]);
    const [rentedPeriod, setRentedPeriod] = React.useState([]);
    const [actionPeriod, setActionPeriod] = React.useState([]);

    React.useEffect(() => {
        BookableService.getBookableAvailable(bookableId).then((response) => {
            setAvailablePeriod(response.data);
        })
    }, [updateType.availablePeriod]);

    React.useEffect(() => {
        BookableService.getBookableReservations(bookableId).then((response) => {
            setRentedPeriod(response.data);
        })
    }, [updateType.reservation]);

    React.useEffect(() => {
        BookableService.getBookableActions(bookableId).then((response) => {
            setActionPeriod(response.data);
        })
    }, [updateType.action]);

    function convertDate(d) {
        var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
        return datestring;
    }

    const [open, setOpen] = React.useState(false);
    const [modalBody, setModalBody] = React.useState({
        title: "",
        start: "",
        end: "",
        client: undefined
    });
    const handleOpen = (info) => {
        setOpen(true);
        let startDate = new Date(info.event.start);
        let endDate = new Date(info.event.end);
        setModalBody(prevData => ({
            ...prevData,
            title : info.event.title,
            start : convertDate(startDate),
            end : convertDate(endDate),
            client: info.event.client
        }))
    } 
    const handleClose = () => setOpen(false);

  
    return (
        <>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                    <b>{modalBody.title[0] + modalBody.title.slice(1).toLowerCase()} period</b><br />
                </Typography>
                <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                    From: {modalBody.start} &nbsp; &nbsp; To: {modalBody.end} <br />
                    {modalBody?.client && <p>Client: {modalBody?.client}</p>}
                </Typography>
                </Box>
            </Modal>
            <div className="wrapper-calendar">
                <h1 className="calendar-header">Calendar</h1>
                <div className="calendar-body">
                
                <FullCalendar
                    headerToolbar={{start: 'today prev,next', center: 'title', end: 'dayGridMonth timeGridWeek'}}
                    plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                    initialView="dayGridMonth"
                    events={availablePeriod.concat(rentedPeriod, actionPeriod)}
                    eventClick={handleOpen}
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }}
                />
                
                </div>
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
                    hour12:false,
                    meridiem: false
                }}
            />
            </div>
        </>
    )
}