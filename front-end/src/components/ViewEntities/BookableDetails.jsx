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


export default function EntityDetails() {

    let {id} = useParams();
    let {entityType} = useParams();

    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [slideNumber, setSlideNumber] = React.useState(0)
    const [slideOpened, setSlideOpened] = React.useState(false)
    const [actions, setActions] = React.useState([])
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
            rating : 0
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

                }))
            }) 
            CottageService.getNumberOfCottageReviews(id).then((response) => {
                setReviewsNumber(response.data) 
            })
        } else if (entityType === "adventure") {
            AdventureService.getAdventure(id).then((response) => {
                let entityDetails = response.data;
                createEntity(entityDetails)
                setEntity(prevState => ({
                    ...prevState,
                    capacity: entityDetails.capacity
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
                    fishingEquipment: entityDetails.fishingEquipment
                }))
            }) 
            BoatService.getNumberOfBoatReviews(id).then((response) => {
                setReviewsNumber(response.data) 
            })
        }
    }, [])

    function createEntity(entityDetails) {
        setEntity({
            name : entityDetails.name, 
            address : entityDetails.address,
            promotionalDescription : entityDetails.promotionalDescription,
            rules : entityDetails.rules,
            hourlyRate : entityDetails.hourlyRate,
            dailyRate : entityDetails.dailyRate,
            cancellationConditions : entityDetails.cancellationConditions,
            photos: entityDetails.photos,
            rating: entityDetails.rating
        })
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


    React.useEffect(() => {
        ActionService.getActions(id).then(response => {
            setActions(response.data)
        })
    }, []);

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
                            <div className="price">
                                {(entityType === "cottage" || entityType === "boat") &&
                                <div>
                                <span className="price"> RSD {entity.dailyRate}</span>
                                <span className="night"> /night</span>
                                </div>}
                                {entityType === "adventure" &&
                                <div>
                                <span className="price"> RSD {entity.hourlyRate}</span>
                                <span className="night"> /hour</span>
                                </div>}
                            </div>
                        </div>
                        <div className="rating">
                            <span className="rating"> {entity.rating}</span>
                            <span className="reviews"> /{reviewsNumber} reviews</span>
                        </div>
                        <div className="hotelImages">
                            {entity.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper">
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
                        {entityType === "cottage" && <CottageDetails bedsNum={getNumberOfBeds()} roomsNum={getNumberOfBedrooms()}/>}
                        {entityType === "adventure" && <AdventureDetails capacity={entity.capacity}/>}
                        {entityType === "boat" && <BoatDetails capacity={entity.capacity} enginesNumber={entity.enginesNumber} enginePower={entity.enginePower} maxSpeed={entity.maxSpeed}/>}
                        <div className="paragraphs">
                            <h3>Description</h3>
                            <p>{entity.promotionalDescription}</p>
                        </div>
                        <div className="paragraphs">
                            <h3>Behavior rules</h3>
                            <p>{entity.rules}</p>
                        </div>
                        <div className="paragraphs">
                            <h3>Cancellation conditions</h3>
                            <p>{entity.cancellationConditions}</p>
                        </div>
                        <ShowActions actions={actions} hourlyPrice={entity.hourlyRate} dailyPrice={entity.dailyRate} bookableType={entityType}/>
                </div>
            </div>
        </div>
    )
}