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
import ReservationService from '../../services/ReservationService';


export default function ReservationPopup(props) {
    const [state, setState] = React.useState({});

    useEffect(() => {
        props.services.map(service => (
            setState({
                ...state,
                [service]: false,
              })
        ))
        
    }, [])

    const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
    };
    

    //proveri gde ces ovo
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
            price: props.price(),
            active: true,
            bookableId: props.bookableId
        }
        ReservationService.addReservation(reservation).then(response => {
            alert("Success");
            props.handleClose()
        })
             
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
                                    <FormLabel component="legend">Assign responsibility</FormLabel>
                                    <FormGroup>
                                        {props.services.map(service => (
                                            <FormControlLabel
                                            control={
                                            <Checkbox checked={state.service} onChange={handleChange} name={service} />
                                            }
                                            label={service}
                                        />
                                        ))}
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