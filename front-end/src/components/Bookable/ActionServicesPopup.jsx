import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
import BookableService from '../../services/BookableService'


export default function ReserveForClientPopup(props) {
    const [state, setState] = useState({});
    const [availableServices, setAvailableServices] = useState(null)


    const handleChange = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
        });
    };

    useEffect(() => {
        BookableService.getBookableServices(props.id).then((response) =>{
            console.log(response.data)
            if (response.data.length === 0) {
                props.handleSubmit([])
                props.handleClose()
            }
            else{
            setAvailableServices(response.data)
            }
        })
    },[])

    
    
    function submitAction(){
        let chosenServices = []
        for (const service of Object.keys(state)) {
            if (state[service]) chosenServices.push(service);
        }
        props.handleSubmit(chosenServices)
        props.handleClose()
             
    }
        
    return (
        <div className="ReservationPopup">
            {availableServices && (<Dialog open={props.actionPopup} onClose={props.handleClose}>
                        <DialogTitle>Additional services</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please select the additional services for action.
                        </DialogContentText>
                            <Box sx={{ display: 'flex' }}>
                                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                                    <FormGroup>
                                        {availableServices.map(service => (
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
                        </DialogContent>
                        <DialogActions>                       
                        <Button sx = {{color:"#FF5A5F"}} onClick={props.handleClose}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={submitAction}>Save</Button>
                        </DialogActions>
                    </Dialog>)}
        </div>
    )
}