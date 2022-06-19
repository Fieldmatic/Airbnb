import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import Alert from 'react-bootstrap/Alert'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React, {useState, useEffect} from 'react'
import { ThemeProvider} from '@mui/material/styles';
import muiStyles from '../../utils/muiStyles'
import CottageService from '../../../services/CottageService';
import BoatService from '../../../services/BoatService';
import ReserveForClientPopup from './ReserveForClientPopup';
import AdventureService from '../../../services/AdventureService'


function ReservationDateTimePanel (props) {
    const [reservationDates, setReservationDates] = useState(
        {
            startDate:new Date(),
            endDate : new Date(),
            startTime : new Date(2022,1,1,11,0,0),
            endTime :new Date(2022,1,1,11,0,0)

        }
    )
    const [data, setData] = useState(null)
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("")
    const [showError, setShowError] = React.useState(false);
    const [entity, setEntity] = React.useState(null)
    const [reservePopup, setReservePopup] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        if (props.role === "COTTAGE_OWNER"){
            CottageService.getCottage(props.bookableId).then(response => {
                setEntity(response.data)
            })
        }
        else if (props.role === "BOAT_OWNER"){
            BoatService.getBoat(props.bookableId).then(response => {
                setEntity(response.data)
            })
        }
        else if (props.role ==="INSTRUCTOR"){
            AdventureService.getAdventure(props.bookableId).then(response => {
                setEntity(response.data)
            })
            
        }


    },[])

    function getPrice() {
        let price;
        let hours = getNumberOfHours()
        let days = Math.floor(hours / 24)
        let leftHours = hours % 24
        if (props.entity === "cottage" || props.entity === "boat") {
            price = days * entity.dailyRate + leftHours * entity.hourlyRate
        } else {
            price = hours * entity.hourlyRate
        }
        return price
    }

    function getNumberOfHours() {
        return Math.abs(new Date(reservationDates.endDate.getFullYear(),reservationDates.endDate.getMonth(), reservationDates.endDate.getDate(), reservationDates.endTime.getHours(), reservationDates.endTime.getMinutes(), reservationDates.endTime.getSeconds()) - new Date(reservationDates.startDate.getFullYear(),reservationDates.startDate.getMonth(), reservationDates.startDate.getDate(), reservationDates.startTime.getHours(), reservationDates.startTime.getMinutes(), reservationDates.startTime.getSeconds())) / 36e5;
    }

    const handleDateChange = (ranges) => {
        setReservationDates(prevFormData => ({
            ...prevFormData,
            startDate : ranges.selection.startDate,
            endDate : ranges.selection.endDate
        }))
    }

    const selectionRange = {
        startDate: reservationDates.startDate,
        endDate: reservationDates.endDate,
        key: 'selection'
    }

    function setStartTime(event){
        setReservationDates(prevFormData => ({
            ...prevFormData,
            startTime: event
        }));
    }

    function setEndTime(event){
        setReservationDates(prevFormData => ({
            ...prevFormData,
            endTime: event
        }));
    }

    function handleReservationPopupClicked() {
        setData({
                bookableId:props.bookableId,
                email : props.email,
                services : entity.additionalServices,
                price : getPrice(),
                capacity : entity.capacity,
                startDateTime:toISODate(new Date(reservationDates.startDate.getFullYear(),reservationDates.startDate.getMonth(), reservationDates.startDate.getDate(), reservationDates.startTime.getHours(), reservationDates.startTime.getMinutes(), reservationDates.startTime.getSeconds())),
                endDateTime: toISODate(new Date(reservationDates.endDate.getFullYear(),reservationDates.endDate.getMonth(), reservationDates.endDate.getDate(), reservationDates.endTime.getHours(), reservationDates.endTime.getMinutes(), reservationDates.endTime.getSeconds()))               
            });
        setReservePopup(true);
    }
    const handleClose = () => {
        setOpen(false);
        setReservePopup(false)
        };
    
    return (
        <div className='availability--periods--container'>
            <h1 className='availability--periods--header'>Reservation for existing client</h1>
            {showSuccess &&
            <Alert variant='success' onClose = {() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>{successMessage}</p>
            </Alert>
            }
            {showError &&
            <Alert variant='danger' onClose = {() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>Entity isn't available in given period!</p>
            </Alert>
            }
            <DateRangePicker
                className='availability--periods-dateRangePicker' 
                ranges={[selectionRange]}
                minDate={new Date()}
                rangeColors={["#FD5B61"]}
                onChange={handleDateChange}
            />
            <div className='availability--periods--data'>
                {getTimePicker("Starting time", reservationDates.startTime, setStartTime)}
                {getTimePicker("Ending time", reservationDates.endTime, setEndTime)}
            </div>
            <div className='availability--periods--data'>              
                <Button 
                    className = "availability--periods--submit" 
                    variant="contained"
                    onClick={handleReservationPopupClicked}
                    sx = {{background:"#FF5A5F",'&:hover': {
                        backgroundColor: '#FF5A5F',
                        color: 'black',
                    },}} 
                    endIcon={<SendIcon />}>   
                    Reserve
                </Button>
                {reservePopup && <ReserveForClientPopup handleClose={handleClose} email={data.email} reservePopup={reservePopup} services={data.services} startDateTime={data.startDateTime} endDateTime={data.endDateTime} price={data.price} bookableId={data.bookableId} capacity={data.capacity}/>}
            </div>
        </div>
    )

    function getTimePicker(label, value, onChange) {
        return <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack spacing={3}>
                <ThemeProvider theme={muiStyles.timePickerTheme}>
                    <TimePicker
                        ampm={false}
                        minutesStep={60}
                        label={label}
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    sx={muiStyles.style} />
                            );
                        } } />
                </ThemeProvider>
            </Stack>
        </LocalizationProvider>;
    }
}

function toISODate (dateTime) {
  return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000).toISOString()
}

export default ReservationDateTimePanel