import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Stack from '@mui/material/Stack';
import Alert from 'react-bootstrap/Alert'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React, {useState} from 'react'
import ActionService from '../../services/ActionService';
import { ThemeProvider, createTheme } from '@mui/material/styles';



function Action (props) {
    const [formData, setFormData] = useState(
        {
            startDate:new Date(),
            endDate : new Date(),
            personLimit: "",
            price:"",
            bookableId:props.bookableId,
            expirationDateTime:new Date(),
            startTime : new Date(),
            endTime :new Date()

        }
    )
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    const theme = createTheme({
        palette: {
          primary: {
            main: "#FF5A5F",
          },
        },
      });

    const style = {
        "& label": {
            color: "black"
          },

          "&:hover label": {
            fontWeight: 700
          },
          "& label.Mui-focused": {
            color: "#FF5A5F"
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#FF5A5F"
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "black"
            },
            "&:hover fieldset": {
              borderColor: "#FF5A5F",
              borderWidth: 2
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF5A5F"
            },
            svg : {color : '#FF5A5F'}
            
          }
      }

    function handleChange(event) {
        console.log(formData)
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

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
            personLimit: formData.personLimit,
            price:formData.price,
            bookableId:formData.bookableId,
            startDateTime:toISODate(new Date(formData.startDate.getFullYear(),formData.startDate.getMonth(), formData.startDate.getDate(), formData.startTime.getHours(), formData.startTime.getMinutes(), formData.startTime.getSeconds())),
            endDateTime: toISODate(new Date(formData.endDate.getFullYear(),formData.endDate.getMonth(), formData.endDate.getDate(), formData.endTime.getHours(), formData.endTime.getMinutes(), formData.endTime.getSeconds())),
            expirationDateTime : toISODate(formData.expirationDateTime)
        }
        ActionService.addAction(data)
        .then(response => {
            console.log(response.status)
            if (response.status === 201) setShowSuccess(true)
        }).catch(error => {
            setShowError(true)
        });
      }
    
      

    return (
        <div className='actions--container'>
            <h1 className='actions--header'>Action defining</h1>
            {showSuccess &&
            <Alert variant='success' onClose = {() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>Successfully added action!</p>
            </Alert>
            }
            {showError &&
            <Alert variant='danger' onClose = {() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>Action already exists in given date range!</p>
            </Alert>
            }
            <DateRangePicker
                className='action-dateRangePicker' 
                ranges={[selectionRange]}
                minDate={new Date()}
                rangeColors={["#FD5B61"]}
                onChange={handleDateChange}
            />
            <div className='actions--data'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                    <ThemeProvider theme={theme}>
                    <TimePicker
                        ampm={false}
                        label = "Check in"
                        value={formData.startTime}
                        onChange= {(newValue) => {
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                startTime: newValue
                            }));
                        }}
                        renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                sx={style}
                              />
                            );
                          }}
                        />
                    </ThemeProvider>
                    </Stack>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={3}>
                    <ThemeProvider theme={theme}>
                    <TimePicker
                        ampm={false}
                        label = "Check out"
                        value={formData.endTime}
                        onChange= {(newValue) => {
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                endTime: newValue
                            }));
                        }}
                        renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                sx={style}
                              />
                            );
                          }}
                        />
                    </ThemeProvider>
                    </Stack>
                </LocalizationProvider>
            </div>
            <div className='actions--data'>
            <TextField
                sx={style} 
                id="standard-basic" 
                className='actions--textfield'
                label="Max guests" 
                variant="standard"
                name = "personLimit"
                value={formData.personLimit}
                onChange={handleChange}
                />
             <TextField 
                sx={style}
                id="standard-basic" 
                label="Price" 
                className='actions--textfield'
                variant="standard" 
                name = "price"
                value={formData.price}
                onChange={handleChange}
                />
            </div>
            <div className='actions--data'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <ThemeProvider theme={theme}>
                        <DateTimePicker
                            renderInput={(params) => {
                                return (
                                <TextField
                                    {...params}
                                    sx={style}
                                />
                                );
                            }}
                            ampm={false}
                            color="#FF5A5F"
                            label="Expiration date"
                            className='expirationDatePicker'
                            value={formData.expirationDateTime}
                            name ="expirationDate"
                            onChange= {(newValue) => {
                                setFormData(prevFormData => ({
                                    ...prevFormData,
                                    expirationDateTime: newValue
                                }));
                            }}
                         />
                    </ThemeProvider>
                </LocalizationProvider>
                <Button 
                    className = "action--submit" 
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
}

function toISODate (dateTime) {
  return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000).toISOString()
}

export default Action