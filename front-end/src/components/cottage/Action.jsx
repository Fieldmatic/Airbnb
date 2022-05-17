import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Alert from 'react-bootstrap/Alert'
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import React, {useState} from 'react'
import ActionService from '../../services/ActionService';


function Action (props) {
    const [formData, setFormData] = useState(
        {
            startDateTime:new Date(),
            endDateTime:new Date(),
            personLimit: "",
            price:"",
            bookableId:props.bookableId,
            expirationDate:new Date()

        }
    )
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [showError, setShowError] = React.useState(false);
    
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
            }
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
        ActionService.addAction(formData)
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
            <DateRangePicker
                className='action-dateRangePicker' 
                ranges={[selectionRange]}
                minDate={new Date()}
                rangeColors={["#FD5B61"]}
                onChange={handleDateChange}
            />
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
                    <DateTimePicker
                        renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                sx={style}
                              />
                            );
                          }}
                        color="#FF5A5F"
                        label="Expiration date"
                        className='expirationDatePicker'
                        value={formData.expirationDate}
                        name ="expirationDate"
                        onChange= {(newValue) => {
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                expirationDate: newValue
                            }));
                        }}
                />
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
            {showSuccess &&
            <Alert variant='success' onClose = {() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>Successfully added action!</p>
            </Alert>
            }
            {showError &&
            <Alert variant='danger' onClose = {() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>Bad request!</p>
            </Alert>
            }
        

        </div>
    )
}


export default Action