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
import React, {useState} from 'react'
import PeriodService from '../../services/PeriodService';
import { ThemeProvider} from '@mui/material/styles';
import './PeriodPanel.css'
import muiStyles from '../utils/muiStyles';


function PeriodPanel (props) {
    const [formData, setFormData] = useState(
        {
            startDate:new Date(),
            endDate : new Date(),
            bookableId:props.bookableId,
            startTime : new Date(2022,1,1,11,0,0),
            endTime :new Date(2022,1,1,11,0,0)

        }
    )
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("")
    const [showError, setShowError] = React.useState(false);


    const handleDateChange = (ranges) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            startDate : ranges.selection.startDate,
            endDate : ranges.selection.endDate
        }))
    }

    const selectionRange = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        key: 'selection'
    }

    function handleSubmit(event){
        event.preventDefault()
        let data = {
            bookableId:formData.bookableId,
            startDateTime:toISODate(new Date(formData.startDate.getFullYear(),formData.startDate.getMonth(), formData.startDate.getDate(), formData.startTime.getHours(), formData.startTime.getMinutes(), formData.startTime.getSeconds())),
            endDateTime: toISODate(new Date(formData.endDate.getFullYear(),formData.endDate.getMonth(), formData.endDate.getDate(), formData.endTime.getHours(), formData.endTime.getMinutes(), formData.endTime.getSeconds()))
        }
        PeriodService.addPeriod(data)
        .then(response => {
            console.log(response.status)
            if (response.status === 201 || response.status === 200) {
                setSuccessMessage(response.data)
                setShowSuccess(true)
            }
        }).catch(error => {
            setShowError(true)
        });
      }

    function setStartTime(event){
        setFormData(prevFormData => ({
            ...prevFormData,
            startTime: event
        }));
    }

    function setEndTime(event){
        setFormData(prevFormData => ({
            ...prevFormData,
            endTime: event
        }));
        console.log(formData)
    }
    
    return (
        <div className='availability--periods--container'>
            <h1 className='availability--periods--header'>Availability period defining</h1>
            {showSuccess &&
            <Alert variant='success' onClose = {() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>{successMessage}</p>
            </Alert>
            }
            {showError &&
            <Alert variant='danger' onClose = {() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>Period already exists in given date range!</p>
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
                {getTimePicker("Starting time", formData.startTime, setStartTime)}
                {getTimePicker("Ending time", formData.endTime, setEndTime)}
            </div>
            <div className='availability--periods--data'>              
                <Button 
                    className = "availability--periods--submit" 
                    variant="contained"
                    onClick={handleSubmit}
                    sx = {{background:"#FF5A5F",'&:hover': {
                        backgroundColor: '#FF5A5F',
                        color: 'black',
                    },}} 
                    endIcon={<SendIcon />}>   
                    Save
                </Button>
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

export default PeriodPanel