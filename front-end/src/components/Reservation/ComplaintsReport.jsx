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
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { Button } from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';
import StarRateIcon from '@mui/icons-material/StarRate';
import "./ReservationHistory.css"
import Alert from '@mui/material/Alert';


export default function ComplaintsReport(props) {

    var initialType;
    if (!props.ownerComplained) initialType = 'OWNER';
    else if (!props.bookableComplained) initialType = 'ENTITY';

    const [alert, setAlert] = React.useState(false);
    const [reviewType, setReviewType] = React.useState(initialType);
    const [comment, setComment] = React.useState('')
    const [ownerData, setOwnerData] = React.useState({
        "comment" : '',
    });
    const [entityData, setEntityData] = React.useState({
        "comment" : '',
    });


    React.useEffect(() => {
    var commentArea = document.getElementById("commentArea");
     if (commentArea) {
         if (reviewType === "OWNER") {
            setComment(ownerData.comment)            
        } else if (reviewType === "ENTITY") {
            setComment(entityData.comment)
        }
         
     }
    }, [reviewType])

    const handleReviewTypeChange = (event) => {
        setReviewType(event.target.value);
    };

    function handleCommentChange(event) {
        setAlert(false)
        const {value} = event.target
        setComment(value)
        if (reviewType === "OWNER") {
            setOwnerData((prevData) => ({
                ...prevData,
                "comment" : value
            }))
        } else if (reviewType === "ENTITY") {
            setEntityData((prevData) => ({
                ...prevData,
                "comment" : value
            }))
        }
    }

    function checkInputs() {
        if ((ownerData.comment === '') && (entityData.comment === '')) {
            return false;
        }
        return true;
    }

    function handleSend(){
        if (checkInputs()) {
            const data = {
                reservationId : props.id,
                ownerId : props.ownerId,
                bookableId : props.bookableId,
                ownerComment : ownerData.comment,
                bookableComment : entityData.comment
            }
            props.handleReportSubmit(data)
            props.handleClose()
        } else {
            setAlert(true)
        }
    }

    

  return (
        <Dialog open={props.handleOpen} onClose={props.handleClose}>
                        <DialogTitle>Complaints</DialogTitle>
                        <DialogContent>
                        <DialogContentText sx = {{color:"#000000"}}>
                        You can complain about both the owner and the entity, if you haven't already.
                        </DialogContentText>
                        <FormControl sx={{ m: 3 }} variant="standard">
                            <ThemeProvider theme={muiStyles.formLabelTheme}>
                                <FormLabel sx={{color:"black"}}>What do you want to complain about? </FormLabel>
                            </ThemeProvider>
                                <RadioGroup
                                    aria-labelledby="demo-error-radios"
                                    name="quiz"
                                    value={reviewType}
                                    onChange={handleReviewTypeChange}
                                >
                                    {!props.ownerComplained && <FormControlLabel sx = {{color:"black"}} value="OWNER" control={<Radio sx={muiStyles.radioStyle}  />} label="Owner/Instructor" />}
                                    {!props.bookableComplained && <FormControlLabel sx = {{color:"black"}} value="ENTITY" control={<Radio sx={muiStyles.radioStyle} />} label="Entity" />}
                                </RadioGroup>
                        </FormControl>

                        {reviewType !== '' && (<div id = "commentArea">
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
                        </div>)
                        }

                        
                        </DialogContent>
                        <DialogActions>
                        <Button sx = {{color:"#FF5A5F"}} onClick={props.handleClose}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={handleSend}>Send</Button>
                        </DialogActions>
                        {alert && <Alert severity="warning">You have not entered a complaint. Please try again.</Alert>}

        </Dialog>

  )
}
