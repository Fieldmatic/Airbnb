import React from 'react';
import "./Entity.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import {useNavigate, Navigate} from "react-router-dom";
import CottageService from '../../services/CottageService';
import BoatService from "../../services/BoatService"
import AdventureService from "../../services/AdventureService"
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ReservationPopup from './ReservationPopup';
import ClientService from '../../services/ClientService';
import BookableService from '../../services/BookableService';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';


function entity(props) {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [profileImage, setProfileImage] = React.useState(undefined)
    const [redirect, setRedirect] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [reservePopup, setReservePopup] = React.useState(false);
    const [heartColor, setHeartColor] = React.useState("#A8A8A8")
    const navigate = useNavigate()

    const alertText = {
        accept: "Reservation is successfull!",
        deny: "You are not allowed to reserve after cancellation!"
    }

    const [accept, setAccept] = React.useState(true);
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        if (props.user === "client") {
            if (props.favorite) 
                setHeartColor("#FF5A5F")
            else {
            ClientService.isClientSubscribed(props.id).then(response => {
                if (response.status === 200) setHeartColor("#FF5A5F")
            }).catch(error => {
                setHeartColor("#A8A8A8")
            }
            )}}
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
    setReservePopup(false)
    };

    function handleCloseAfterReservation(result) {
        console.log(result)
        setAccept(result);
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false);
            }, 2500)
        setReservePopup(false)
        };

    React.useEffect(() => {
        if (props.entity === "cottage") {
            CottageService.getNumberOfCottageReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        } else if (props.entity === "boat") {
            BoatService.getNumberOfBoatReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        //avanture
        } else {
            AdventureService.getNumberOfAdventureReviews(props.id).then((response) => {
                setReviewsNumber(response.data) 
            })
        }
        BookableService.getProfilePicture(props.id).then((response) => {
            setProfileImage(response.data)
        })
   }, [])

   if (redirect) {
    return (
        <Navigate to={redirect}/>
    )
    }

    function redirectToEntityDetails(event) {
        event.preventDefault()
        let heart = heartColor
        heart = heart.replace("#", "")
        setRedirect(`/bookableDetails/${props.id}&${props.entity}&${props.user}&${heart}`)
    }

    function handleDelete(){
        if (props.entity === "cottage") {
            CottageService.deleteCottage(props.id).then(() => {
                props.setEntitiesEdited(true)
            })
            
        }
        else if (props.entity === "boat") {
            BoatService.deleteBoat(props.id).then(() => {
                props.setEntitiesEdited(true)
            })
        }
        handleClose()
    }

    function openReservePopup() {
        setReservePopup(true);
    };

    function handleEdit(){
        if (props.entity === "cottage") {
            navigate("/editCottage/"+props.id)
            
        }
        else if (props.entity === "boat") {
            navigate("/editBoat/"+props.id)
        }
        
    }


    function getPrice() {
        let price;
        let hours = getNumberOfHours()
        let days = Math.floor(hours / 24)
        let leftHours = hours % 24
        if (props.entity === "cottage" || props.entity === "boat") {
            price = days * props.dailyRate + leftHours * props.hourlyRate
        } else {
            //adventure
            price = hours * props.hourlyRate
        }
        return price
    }

    function getNumberOfHours() {
        return Math.abs(new Date(props.endDateTime) - new Date(props.startDateTime)) / 36e5;
    }

    function fillHeart() {
        if (heartColor === "#FF5A5F") {
            setHeartColor("#A8A8A8")
            ClientService.unsubscribeFromEntity(props.id).then(response =>
                console.log("obrisano"))
        } else {
            setHeartColor("#FF5A5F")
            ClientService.subscribeOnEntity(props.id).then(response =>
                console.log("dodato"))
        }
    }

    return (
        <div>
            <Collapse in={showAlert}>
                            <Alert variant="filled" severity="info">{accept ? alertText.accept : alertText.deny}</Alert>
                </Collapse>
        <div className="entities">
            {profileImage && <img src={URL.createObjectURL(profileImage)}  alt=""/>}
            {props.user === "client" && <FavoriteIcon className="entity__heart" onClick={fillHeart} sx={{color: heartColor,
                '&:hover': {
                    backgroundColor: 'lightgray',
                    color: '#FF5A5F',
                        },
                }}/>          
            }
            <div className="entity__info">
                <div className="entity__infoTop">
                    <h2>{props.name}</h2>
                    <div className='entity__location'>
                        <LocationOnIcon className = 'location_icon' />   
                        <p>{props.address.street}, {props.address.city}, {props.address.state}</p>
                    </div>        
                    <p className='entity_description'>{props.promotionalDescription}</p>
                </div>
                <div className="entity__infoBottom">
                    <div className="entity__stars">
                        <div>
                        <StarIcon className="entity__star" />
                        <div>
                        <span className='entity_rating_value'>{props.rating}</span>
                        <span>/10 ({reviewsNumber} reviews)</span>
                        </div>
                        </div>
                    </div>
                    {props.user === "owner" && 
                    <div>
                        <div className='owner__actions'>
                            <Button sx = {{
                                    backgroundColor : "orange", 
                                    color:"white",
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                            },
                                    }}
                                    className = "editButton"
                                    onClick={handleEdit}
                                    variant='outlined'>Edit
                            </Button>
                            <Button sx = {{
                                    backgroundColor : "green", 
                                    color:"white",
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                            },
                                        }} 
                                    onClick={() => navigate("/addActions/"+props.id)}
                                    variant='outlined'>Actions
                            </Button>
                            <Button sx = {{
                                    backgroundColor : "blue", 
                                    color:"white",
                                    '&:hover': {
                                        backgroundColor: 'black',
                                        color: 'white',
                                            },
                                        }} 
                                    onClick={() => navigate("/addAvailabilityPeriods/"+props.id)}
                                    variant='outlined'>Availability Periods
                            </Button>
                            <Button sx = {{ 
                                    backgroundColor : "black", 
                                    color:"white", 
                                    '&:hover': {
                                            backgroundColor: 'white',
                                            color: 'blacl',
                                                },
                                    }} 
                                    onClick={() => navigate("/statistics/"+props.id)}
                                    variant='outlined'>Statistics
                            </Button>
                            <Button sx = {{ 
                                    backgroundColor : "red", 
                                    color:"white", 
                                    '&:hover': {
                                            backgroundColor: 'black',
                                            color: 'white',
                                                },
                                    }} 
                                    onClick={handleClickOpen}
                                    variant='outlined'>Delete
                            </Button>
                        </div>
                    <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                    <DialogTitle id="responsive-dialog-title">{"Delete this cottage?"}</DialogTitle>
                    <DialogContent><DialogContentText>This action Cannot be undone.</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleDelete} autoFocus>Agree</Button>
                    </DialogActions>
                    </Dialog>
                </div>}
                    <div className='entity_right_corner'>
                        <div className="entity__price">
                            <span className='entity_price_value'>€{props.entity === "adventure"? props.hourlyRate : props.dailyRate} </span>
                            <span className='entity_price_per'>{props.entity === "adventure" ? '/hour' : '/night'}</span>
                        </div>
                        <div className='exploreAndReserveButtons'>
                            <Button className="entity_explore_button" sx = {{
                                backgroundColor : props.user === "client" && !props.showAll ? "#D4AF37" : "#FF5A5F", 
                                width : "10vw",
                                color:"white",
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                        },
                                    }} variant='outlined'  onClick={redirectToEntityDetails}> Explore</Button>
                            {props.user === "client" && !props.showAll && <Button sx = {{
                                backgroundColor : "#FF5A5F", 
                                width : "10vw",
                                color:"white",
                                '&:hover': {
                                    backgroundColor: 'black',
                                    color: 'white',
                                        },
                                    }} variant='outlined'  onClick={openReservePopup}> Reserve</Button>}
        
                        </div>
                        {props.user === "client" && <ReservationPopup handleClose={handleClose} handleCloseAfterReservation={handleCloseAfterReservation} reservePopup={reservePopup} services={props.additionalServices} startDateTime={props.startDateTime} endDateTime={props.endDateTime} price={getPrice} bookableId={props.id} capacity={props.capacity}/>}
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default entity
