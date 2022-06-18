import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import ReservationService from '../../../services/ReservationService';
import { TextField } from '@mui/material';
import muiStyles from '../../utils/muiStyles'


export default function ReserveForClientPopup(props) {
    const [state, setState] = useState({});
    const [price, setPrice] = useState(props.price)


    const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
    };
    
    function submitReservation(){
        let chosenServices = []
        for (const service of Object.keys(state)) {
            if (state[service]) chosenServices.push(service);
        }
        let reservation = {
            startDateTime: props.startDateTime,
            endDateTime: props.endDateTime,
            additionalServices: chosenServices,
            personLimit: props.capacity,
            price: price,
            active: true,
            bookableId: props.bookableId
        }
        console.log(reservation)
        console.log(props.email)
        ReservationService.reserveForClient(reservation, props.email).then(response => {
            alert("Success");
            props.handleClose()
        })
             
    }

    function handlePriceChange(event){
        setPrice(event.target.value)
    }
        
    return (
        <div className="ReservationPopup">
            <Dialog open={props.reservePopup} onClose={props.handleClose}>
                        <DialogTitle>Additional services</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please select the additional services, if you want.
                        </DialogContentText>
                            <Box sx={{ display: 'flex' }}>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormGroup>
                                        {props.services.map(service => (
                                            <FormControlLabel
                                            control={
                                            <Checkbox checked={state.service}  name={service} onChange={handleChange} />
                                            }
                                            label={service}
                                        />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                                
                            </Box>                         
                        <DialogContentText>
                        Price is suggested based on this entity pricelist,
                        you can discount it for this client if you want.
                        </DialogContentText>
                            <Box sx={{ display: 'flex' }}>
                                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                        <FormGroup>
                                        <TextField
                                        sx={muiStyles.style} 
                                        label = "Price"
                                        variant='outlined'
                                        className="form--input"
                                        type = "text"
                                        onChange = {handlePriceChange}
                                        name = "dailyRate"
                                        value = {price}          
                                        />    
                                        </FormGroup>
                                    </FormControl>
                                    
                            </Box>

                        </DialogContent>
                        <DialogActions>                       
                        <Button sx = {{color:"#FF5A5F"}} onClick={props.handleClose}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={submitReservation}>Reserve</Button>
                        </DialogActions>
                    </Dialog>
        </div>
    )
}