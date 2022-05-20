import React from 'react';
import "./Entity.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import {Navigate} from "react-router-dom";
import CottageService from '../../services/CottageService';
import BoatService from "../../services/BoatService"
import AdventureService from "../../services/AdventureService"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function entity(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [profileImage, setProfileImage] = React.useState(undefined)
    const [redirect, setRedirect] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    };

    React.useEffect(() => {
        if (props.entity === "cottage") {
            CottageService.getNumberOfCottageReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            CottageService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        } else if (props.entity === "boat") {
            BoatService.getNumberOfBoatReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            BoatService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        //avanture
        } else {
            AdventureService.getNumberOfAdventureReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
            AdventureService.getProfilePicture(props.id).then((response) => {
                setProfileImage(response.data)
            })
        }
   }, [])

   if (redirect) {
    return (
        <Navigate to={redirect}/>
    )
    }

    function redirectToEntityDetails(event) {
        event.preventDefault()
        setRedirect(`/bookableDetails/${props.id}&${props.entity}`)
    }

    function handleDelete(){
        if (props.entity === "cottage") CottageService.deleteCottage(props.id)
        else if (props.entity === "boat") BoatService.deleteBoat(props.id)
        handleClose()
        props.setEntitiesEdited(true)
    }

    return (
        <div className="entities">
            {profileImage && <img src={URL.createObjectURL(profileImage)}  alt=""/>}
            <FavoriteBorderIcon className="entity__heart" />
          
            <div className="entity__info">
                <div className="entity__infoTop">
                    <h3>{props.name}</h3>
                    <div className='entity__location'>
                        <LocationOnIcon className = 'location_icon'style={{ color: '#ff7779' }}/>   
                        <p>{props.address.city}, {props.address.state}</p>
                    </div>        
                    <p>____________________________</p>
                    <p>{props.promotionalDescription}</p>
                </div>
                <div className="entity__infoBottom">
                    <div className="entity__stars">
                        <StarIcon className="entity__star" />
                        <p><strong>{props.rating}</strong></p>
                    </div>
                    <div className='owner__actions'>
                    <Button sx = {{backgroundColor : "orange", color:"white"}}className = "editButton"
                        onClick={() => navigate("/search")}
                        variant='outlined'>Edit
                    </Button>
                    <Button sx = {{backgroundColor : "green", color:"white"}} onClick={() => navigate("/search")}
                    variant='outlined'>Availability
                    </Button>
                    <Button sx = {{backgroundColor : "red", color:"white"}} onClick={handleClickOpen}
                    variant='outlined'>Delete
                    </Button>
                    </div>
                    <div className="entity__price">
                        <h2>€{props.entity === "adventure"? props.hourlyRate : props.dailyRate} /night </h2>
                    </div>
                </div>
            </div>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                >
                <DialogTitle id="responsive-dialog-title">
                    {"Delete this cottage?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    This action Cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Disagree
                    </Button>
                    <Button onClick={handleDelete} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default entity
