import React from "react"
import { useParams } from 'react-router-dom'
import CottageService from "../../services/CottageService";
import CottageDetails from "./CottageDetails";
import AdventureDetails from "./AdventureDetails";
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import Header from "../../Header";
import "./BookableDetails.css"
import AdventureService from "../../services/AdventureService";
import BoatService from "../../services/BoatService";
import ActionService from "../../services/ActionService";
import BoatDetails from "./BoatDetails";
import ShowActions from "./ShowActions";
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClientService from '../../services/ClientService';
import ReviewService from "../../services/ReviewService";
import PersonIcon from '@mui/icons-material/Person';
import Review from "./Review";
import OwnerService from "../../services/OwnerService";




export default function EntityDetails() {

    let {id} = useParams();
    let {entityType} = useParams();
    let {user} = useParams();
    let {heartColor} = useParams();
    heartColor = "#" + heartColor;

    const [heartColorState, setHeartColor] = React.useState(heartColor)
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [owner, setOwner] = React.useState({})
    const [slideNumber, setSlideNumber] = React.useState(0)
    const [slideOpened, setSlideOpened] = React.useState(false)
    const [actions, setActions] = React.useState([])
    const [reservationMade, setReservationMade] = React.useState(false)
    const [reviews, setReviews] = React.useState([])
    const [ownerProfilePhoto, setOwnerProfilePhoto] = React.useState()
    const [entity, setEntity] = React.useState(
        {
            name : "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: ""
            },
            promotionalDescription : "",
            rules : "",
            hourlyRate : "",
            dailyRate : "",
            cancellationConditions: "",
            singleRooms : 0,
            doubleRooms : 0,
            tripleRooms : 0,
            quadRooms : 0,
            photos: [],
            rating : 0,
            services : []
          }
    )

    function setBoatType(type) {
        if (type == "FISHINGBOAT") 
            return "Fishing boat"
    }

    React.useEffect(() => {
        if (entityType === "cottage") {
            CottageService.getCottage(id).then((response) => {
                let entityDetails = response.data;
                createEntity(entityDetails)
                setEntity(prevState => ({
                    ...prevState,
                    singleRooms : entityDetails.singleRooms,
                    doubleRooms : entityDetails.doubleRooms,
                    tripleRooms : entityDetails.tripleRooms,
                    quadRooms : entityDetails.quadRooms,
                    services : entityDetails.additionalServices,
                    capacity: entityDetails.capacity,


                }))
            }) 
            CottageService.getNumberOfCottageReviews(id).then((response) => {
                setReviewsNumber(response.data) 
            })
        } else if (entityType === "adventure") {
            console.log("udje")
            AdventureService.getAdventure(id).then((response) => {
                let entityDetails = response.data;
                console.log(response.data)
                createEntity(entityDetails)
                setEntity(prevState => ({
                    ...prevState,
                    capacity: entityDetails.capacity,
                    eq: entityDetails.equipment,
                    services : entityDetails.additionalServices
                }))
            }) 
            AdventureService.getNumberOfAdventureReviews(id).then((response) => {
                setReviewsNumber(response.data) 
            })
        } else {
            BoatService.getBoat(id).then((response) => {
                let entityDetails = response.data;
                createEntity(entityDetails)
                setEntity(prevState => ({
                    ...prevState,
                    type : setBoatType(entityDetails.type),
                    enginesNumber : entityDetails.enginesNumber,
                    enginePower : entityDetails.enginePower,
                    maxSpeed : entityDetails.maxSpeed,
                    capacity: entityDetails.capacity,
                    navigationEquipment: entityDetails.navigationEquipment,
                    fishingEquipment: entityDetails.fishingEquipment,
                    services : entityDetails.additionalServices
                }))
            }) 
            BoatService.getNumberOfBoatReviews(id).then((response) => {
                setReviewsNumber(response.data) 
            })
        }
    }, [])


    React.useEffect(() => {
            ReviewService.getBookableReviews(id).then((response) => {
                setReviews(response.data) 
            })
    }, [])

    React.useEffect(() => {
        OwnerService.getBookableOwner(id).then((response) => {
            setOwner(response.data) 
        })
}, [])

    React.useEffect(() => {
        OwnerService.getProfilePicture(id).then((response) => {
            setOwnerProfilePhoto(response.data) 
        })
    }, [])



    function createEntity(entityDetails) {
        setEntity((prevState) => ({
            ...prevState,
            name : entityDetails.name, 
            address : entityDetails.address,
            promotionalDescription : entityDetails.promotionalDescription,
            rules : entityDetails.rules,
            hourlyRate : entityDetails.hourlyRate,
            dailyRate : entityDetails.dailyRate,
            cancellationConditions : entityDetails.cancellationConditions,
            photos: entityDetails.photos,
            rating: entityDetails.rating
        }))
    }

    function handleOpenSlider(i) {
        setSlideNumber(i)
        setSlideOpened(true)
    }

    function handleMove(direction) {
        let newSlideNumber;
        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? entity.photos.length - 1 : slideNumber - 1
        } else {
            newSlideNumber = slideNumber === entity.photos.length - 1 ? 0 : slideNumber + 1
        }
        setSlideNumber(newSlideNumber)
    }

    function getNumberOfBeds() {
        let bedsNum = 0;
        bedsNum += entity.singleRooms + entity.doubleRooms + entity.tripleRooms + entity.quadRooms;
        return bedsNum;
    }

    function getNumberOfBedrooms() {
        let bedroomsNum = 0;
        bedroomsNum += entity.singleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.doubleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.tripleRooms == 0 ? 0 : 1;
        bedroomsNum += entity.quadRooms == 0 ? 0 : 1;
        return bedroomsNum;
    }

    function rerenderActions() {
        setReservationMade(prevState => !prevState)
    }


    React.useEffect(() => {
        ActionService.getActions(id).then(response => {
            setActions(response.data)
        })
    }, [reservationMade]);
    createAddressUrl()

    function fillHeart() {
        if (heartColorState === "#FF5A5F") {
            setHeartColor("#A8A8A8")
            ClientService.unsubscribeFromEntity(id).then(response =>
                console.log("obrisano"))
        } else {
            setHeartColor("#FF5A5F")
            ClientService.subscribeOnEntity(id).then(response =>
                console.log("dodato"))
        }
    }


    return(
        <div>
            <Header />
            <div className="hotelContainer">
                {slideOpened && 
                    <div className="slider">
                    <CloseIcon className="close" onClick={() => setSlideOpened(false)}></CloseIcon>
                    <ArrowBackIosIcon className="arrow" onClick={() => handleMove("l")}></ArrowBackIosIcon>
                        <div className="sliderWrapper">
                            <div className="sliderImg">
                                <img src={"data:image/jpg;base64," + entity.photos[slideNumber]} alt="" className="sliderImg" />
                            </div>
                        </div>
                    <ArrowForwardIosIcon className="arrow" onClick={() => handleMove("r")}></ArrowForwardIosIcon> 
                </div>}
                <div className="hotelWrapper">
                        <h1 className="hotelTitle">{entity.name}</h1>
                        <div className="entityAddressAndPrice">
                            <div className="hotelAddress">
                                <LocationOnIcon/>
                                <span> {entity.address.street}, {entity.address.city}, {entity.address.state}</span>
                            </div>
                            <div className="ownerMainInfo">
                                <div>
                                    {ownerProfilePhoto && <img className="clientAvatar" src = {URL.createObjectURL(ownerProfilePhoto)} alt="avatar"/>}
                                    <label>{owner.name} {owner.surname}</label>
                                </div>
                                <div className="ownerBiography">
                                    {owner.biography && <label>{owner.biography}</label>}
                                </div>
                            </div>
                            <div className="price">
                                {user === "client" && <FavoriteIcon className="entity__heart" onClick={fillHeart} sx={{color: heartColorState,
                                    '&:hover': {
                                        backgroundColor: 'lightgray',
                                        color: '#FF5A5F',
                                            },
                                    }}/>          
                                }
                                {(entityType === "cottage" || entityType === "boat") &&
                                <div>
                                <span className="price"> € {entity.dailyRate}</span>
                                <span className="night"> /night</span>
                                </div>}
                                {entityType === "adventure" &&
                                <div>
                                <span className="price"> € {entity.hourlyRate}</span>
                                <span className="night"> /hour</span>
                                </div>}
                                {(entityType === "cottage" || entityType === "boat") &&
                                <div>
                                <span className="price"> € {entity.hourlyRate}</span>
                                <span className="night"> /hour</span>
                                </div>}
        
                            </div>
                        </div>
                        <div className="rating">
                            <StarIcon sx={{color: "#FF5A5F"}}/>
                            <div className="rating"> {entity.rating}/5</div>
                            <div className="reviewsNumber"> ({reviewsNumber} reviews)</div>
                        </div>
                        <div className="hotelImages">
                            {entity.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper" key={i}>
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
                        <div className="adventureCapacity">
                            <h5> Number of guests: </h5>
                            <span>{entity.capacity} <PersonIcon/></span>
                        </div>
                        {entityType === "cottage" && <CottageDetails key={id} bedsNum={getNumberOfBeds()} roomsNum={getNumberOfBedrooms()}/>}
                        {entityType === "boat" && <BoatDetails key={id} capacity={entity.capacity} enginesNumber={entity.enginesNumber} enginePower={entity.enginePower} maxSpeed={entity.maxSpeed}/>}
                        <div className="paragraphs">
                            <h3>Description</h3>
                            <p>{entity.promotionalDescription}</p>
                        </div>
                        {entityType === "adventure" && entity.eq && <AdventureDetails key={id} capacity={entity.capacity} eq={entity.eq}/>}

                        {entityType === "boat" && entity.fishingEquipment && 
                        <div className="paragraphs">
                            <h3>Fishing equipment</h3>
                            <div className="services">
                            {entity.fishingEquipment.map((service, i) =>(
                                <div className="service" key={i}>
                                    <p> {service}</p>
                                </div>
                            ))}
                            </div>
                        </div>}     
                        {entityType === "boat" && entity.navigationEquipment && 
                        <div className="paragraphs">
                            <h3>Navigation equipment</h3>
                            <div className="services">
                            {entity.navigationEquipment.map((service, i) =>(
                                <div className="service" key={i}>
                                    <p> {service}</p>
                                </div>
                            ))}
                            </div>
                        </div>}     
                        <div className="paragraphs">
                            <h3>Additional services</h3>
                            <div className="services">
                                {entity.services.map((service, i) =>(
                                    <div className="service" key={i}>
                                        <p> {service}</p>
                                    </div>
                                ))}
                            </div>
                        </div>     
                        <div className="paragraphs">
                            <h3>Rules of conduct</h3>
                            <p>{entity.rules}</p>
                        </div>
                        <div className="paragraphs">
                            <h3>Cancellation conditions</h3>
                            <p>{entity.cancellationConditions}</p>
                        </div>     
                        {user === "client" && <ShowActions actions={actions} hourlyPrice={entity.hourlyRate} dailyPrice={entity.dailyRate} bookableType={entityType} deleteAction={rerenderActions}/>}
                        <iframe style={{width: "100%", height:"500px", marginTop: "25px"}} src={`https://maps.google.com/maps?q=${createAddressUrl()}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
                        <div className="reviewParagraphs">
                            <h3>Reviews</h3>
                            <div className="reviews">
                            {reviews.map(item => {
                                return (<Review clientName={item.clientName} clientSurname={item.clientSurname} clientId={item.clientId} clientEmail={item.clientEmail} bookableRating={item.bookableRating} bookableComment={item.bookableComment}
                                                ownerRating={item.ownerRating} ownerComment={item.ownerComment} entity={entityType}/>)}
                            )} 
                            {reviews.length === 0 && <p>No one reviewed this entity yet.</p>}
                        </div>
                        </div>          
                </div>
            </div>
        </div>
    )

    function createAddressUrl(){
        let addressQuery = entity.address.street + ", " + entity.address.city + ", " + entity.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }
}