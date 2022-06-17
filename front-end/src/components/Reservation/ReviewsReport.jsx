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

export default function ReviewsReport(props) {

    var initialType;
    if (!props.ownerReviewed) initialType = 'OWNER';
    else if (!props.entityReviewed) initialType = 'ENTITY';

    const [rateValue, setRateValue] = React.useState(' ');
    const [rateChanged, setRateChanged] = React.useState(false);
    const [reviewType, setReviewType] = React.useState(initialType);
    const [comment, setComment] = React.useState('')
    const [starColor, setStarColor] = React.useState('gray');
    const [ownerData, setOwnerData] = React.useState({
        "comment" : '',
        "rate" : 0
    });
    const [entityData, setEntityData] = React.useState({
        "comment" : '',
        "rate" : 0
    });


    React.useEffect(() => {
    var commentArea = document.getElementById("commentArea");
     var starsArea = document.getElementById("stars")
     if (commentArea && starsArea) {
        clearAllStars()
         if (reviewType === "OWNER") {
            setComment(ownerData.comment)
            fillStarsByIndex(ownerData.rate)
            
        } else if (reviewType === "ENTITY") {
            setComment(entityData.comment)
            fillStarsByIndex(entityData.rate)
        }
         
     }
    }, [reviewType])

    const handleReviewTypeChange = (event) => {
        setReviewType(event.target.value);
    };

    function handleCommentChange(event) {
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

    function selectRate(number) {
        clearAllStars()
        setRateValue(number)
        setRateChanged(true)
        fillStarsByIndex(number)
        if (reviewType === "OWNER") {
            setOwnerData((prevData) => ({
                ...prevData,
                "rate" : number
            }))
        } else if (reviewType === "ENTITY") {
            setEntityData((prevData) => ({
                ...prevData,
                "rate" : number
            }))
        } 
    }

    function fillStarsByIndex(number) {
        var el;
            for (var i = 1; i <= number; i++) {
                el = document.getElementById(i);
                el.style.color="#FF5A5F"
        }
    }

    function clearAllStars() {
        var el;
            for (var i = 1; i <= 5; i++) {
                el = document.getElementById(i);
                el.style.color="gray"
        } 
    }


    const handleMouseEnter = e => {
        if (!rateChanged) {
            var el;
            for (var i = 1; i <= e.target.id; i++) {
                el = document.getElementById(i);
                el.style.color="#FF5A5F"
            } 
        }
      }

    const handleMouseLeave = e => {
        if (!rateChanged) {
            var el;
            for (var i = 1; i <= 5; i++) {
                el = document.getElementById(i);
                el.style.color="grey"
                el.style.background="transparent"
            }
        } 
    }

    function handleSend(){
        const data = {
            reservationId : props.id,
            ownerId : props.ownerId,
            bookableId : props.bookableId,
            ownerRating : ownerData.rate,
            bookableRating : entityData.rate,
            ownerComment : ownerData.comment,
            bookableComment : entityData.comment
        }
        props.handleReportSubmit(data)
        props.handleClose()
    }

    

  return (
        <Dialog open={props.handleOpen} onClose={props.handleClose}>
                        <DialogTitle>Review</DialogTitle>
                        <DialogContent>
                        <DialogContentText sx = {{color:"#000000"}}>
                        You can rate both the owner and the entity, if you haven't already.
                        </DialogContentText>
                        <FormControl sx={{ m: 3 }} variant="standard">
                            <ThemeProvider theme={muiStyles.formLabelTheme}>
                                <FormLabel sx={{color:"black"}}>What do you want to review? </FormLabel>
                            </ThemeProvider>
                                <RadioGroup
                                    aria-labelledby="demo-error-radios"
                                    name="quiz"
                                    value={reviewType}
                                    onChange={handleReviewTypeChange}
                                >
                                    {!props.ownerReviewed && <FormControlLabel sx = {{color:"black"}} value="OWNER" control={<Radio sx={muiStyles.radioStyle}  />} label="Owner/Instructor" />}
                                    {!props.entityReviewed && <FormControlLabel sx = {{color:"black"}} value="ENTITY" control={<Radio sx={muiStyles.radioStyle} />} label="Entity" />}
                                </RadioGroup>
                        </FormControl>

                        {reviewType !== '' && (
                            <FormControl sx={{ m: 3 }} variant="standard" id="stars">
                            <ThemeProvider theme={muiStyles.formLabelTheme}>
                                <FormLabel sx={{color:"black"}}>Rate : </FormLabel>
                            </ThemeProvider>

                            <div className='starRateReviews'>
                                <StarRateIcon id="1" sx={{color: starColor}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => selectRate(1)}/>
                                <StarRateIcon id="2" sx={{color: starColor}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => selectRate(2)}/>
                                <StarRateIcon id="3" sx={{color: starColor}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => selectRate(3)}/>
                                <StarRateIcon id="4" sx={{color: starColor}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => selectRate(4)}/>
                                <StarRateIcon id="5" value="5" sx={{color: starColor}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => selectRate(5)}/>
                            </div>

                            </FormControl>)}

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
        </Dialog>

  )
}

