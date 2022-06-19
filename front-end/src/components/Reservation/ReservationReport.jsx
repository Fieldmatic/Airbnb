import TextField from '@mui/material/TextField';
import React,{useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import muiStyles from "../utils/muiStyles"
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Button } from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';

export default function ReservationReport(props) {
    const [rateClientValue, setRateClientValue] = React.useState('');
    const [clientShowedUp, setClientShowedUp] = React.useState('');
    const [comment, setComment] = React.useState('')

    const handleRateChange = (event) => {
        setRateClientValue(event.target.value);
      };


    const handleClientShowedUp = (event) => {
        setClientShowedUp(event.target.value);
    };

    function handleSend(){
        const data = {
            reservationId : props.id,
            comment : comment,
            showedUp: clientShowedUp,
            type : rateClientValue,
            clientEmail : props.email
        }
        props.handleReportSubmit(data)
        props.handleClose()
    }

    function handleCommentChange(event) {
        const {name, value} = event.target
        setComment(value)
      }
    

  return (
        <Dialog open={props.handleOpen} onClose={props.handleClose}>
                        <DialogTitle>Report</DialogTitle>
                        <DialogContent>
                        <DialogContentText sx = {{color:"#000000"}}>
                            With report you can either commend your client or request penalty.
                        </DialogContentText>
                        <FormControl sx={{ m: 3 }} variant="standard">
                        <ThemeProvider theme={muiStyles.formLabelTheme}>
                            <FormLabel sx={{color:"black"}}>Rate client</FormLabel>
                        </ThemeProvider>
                            <RadioGroup
                            aria-labelledby="demo-error-radios"
                            name="quiz"
                            value={rateClientValue}
                            onChange={handleRateChange}
                            >
                            <FormControlLabel sx = {{color:"black"}} value="COMMEND" control={<Radio sx={muiStyles.radioStyle}  />} label="Commend client" />
                            <FormControlLabel sx = {{color:"black"}} value="REQUESTPENALTY" control={<Radio sx={muiStyles.radioStyle} />} label="Request penalty" />
                            <FormControlLabel sx = {{color:"black"}} value="NEUTRAL" control={<Radio sx={muiStyles.radioStyle} />} label="Stay neutral" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl sx={{ m: 3 }}  variant="standard">
                            <ThemeProvider theme={muiStyles.formLabelTheme}>
                                <FormLabel sx={{color:"black"}}>Did client show up?</FormLabel>
                            </ThemeProvider>
                            <RadioGroup
                            aria-labelledby="demo-error-radios"
                            name="quiz"
                            value={clientShowedUp}
                            onChange={handleClientShowedUp}
                            >
                            <FormControlLabel value={true} control={<Radio sx={muiStyles.radioStyle} />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio sx={muiStyles.radioStyle} />} label="No" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            autoFocus
                            sx = {muiStyles.style}
                            margin="dense"
                            id="text"
                            label="Comment"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={comment}
                            name = "comment"
                            onChange={handleCommentChange} 
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button sx = {{color:"#FF5A5F"}} onClick={props.handleClose}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={handleSend}>Send</Button>
                        </DialogActions>
                    </Dialog>

  )
}

