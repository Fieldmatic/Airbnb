import React from "react"
import { useParams } from 'react-router-dom'
import CottageService from "../../services/CottageService";
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import BedIcon from '@mui/icons-material/Bed';
import KeyIcon from '@mui/icons-material/Key';
import Header from "../../Header";
import "./CottageDetails.css"


export default function EntityDetails() {
    const [reviewsNumber, setReviewsNumber] = React.useState(0)
    const [slideNumber, setSlideNumber] = React.useState(0)
    const [slideOpened, setSlideOpened] = React.useState(false)
    const [cottage, setCottage] = React.useState(
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
    let {id} = useParams();

    React.useEffect(() => {
        CottageService.getCottage(id).then((response) => {
            let cottageResponse = response.data;
            console.log(cottageResponse.photos)
            setCottage({
                name : cottageResponse.name, 
                address : cottageResponse.address,
                promotionalDescription : cottageResponse.promotionalDescription,
                rules : cottageResponse.rules,
                hourlyRate : cottageResponse.hourlyRate,
                dailyRate : cottageResponse.dailyRate,
                cancellationConditions : cottageResponse.cancellationConditions,
                singleRooms : cottageResponse.singleRooms,
                doubleRooms : cottageResponse.doubleRooms,
                tripleRooms : cottageResponse.tripleRooms,
                quadRooms : cottageResponse.quadRooms,
                photos: cottageResponse.photos,
                rating: cottageResponse.rating
            })
        }) 
    }, [])

    function handleOpenSlider(i) {
        setSlideNumber(i)
        setSlideOpened(true)
    }

    function handleMove(direction) {
        let newSlideNumber;
        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? cottage.photos.length - 1 : slideNumber - 1
        } else {
            newSlideNumber = slideNumber === cottage.photos.length - 1 ? 0 : slideNumber + 1
        }
        setSlideNumber(newSlideNumber)
    }

    function getNumberOfBeds() {
        let bedsNum = 0;
        bedsNum += cottage.singleRooms + cottage.doubleRooms + cottage.tripleRooms + cottage.quadRooms;
        return bedsNum;
    }

    function getNumberOfBedrooms() {
        let bedroomsNum = 0;
        bedroomsNum += cottage.singleRooms == 0 ? 0 : 1;
        bedroomsNum += cottage.doubleRooms == 0 ? 0 : 1;
        bedroomsNum += cottage.tripleRooms == 0 ? 0 : 1;
        bedroomsNum += cottage.quadRooms == 0 ? 0 : 1;
        return bedroomsNum;
    }

    React.useEffect(() => {
        CottageService.getNumberOfCottageReviews(cottage.id).then((response) => {
            setReviewsNumber(response.data) 
        })
   }, [])

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
                                <img src={"data:image/jpg;base64," + cottage.photos[slideNumber]} alt="" className="sliderImg" />
                            </div>
                        </div>
                    <ArrowForwardIosIcon className="arrow" onClick={() => handleMove("r")}></ArrowForwardIosIcon> 
                </div>}
                <div className="hotelWrapper">
                        <h1 className="hotelTitle">{cottage.name}</h1>
                        <div className="entityAddressAndPrice">
                            <div className="hotelAddress">
                                <LocationOnIcon/>
                                <span> {cottage.address.street}, {cottage.address.city}, {cottage.address.state}</span>
                            </div>
                            <div className="price">
                                <span className="price"> RSD {cottage.dailyRate}</span>
                                <span className="night"> /night</span>

                            </div>
                        </div>
                        <div className="rating">
                            <span className="rating"> {cottage.rating}</span>
                        </div>
                        <div className="hotelImages">
                            {cottage.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper">
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
                        <div className="cottageCapacity">
                            <div className="bedrooms">
                                <KeyIcon/> 
                                <span className="capacityTitle">Bedrooms</span>
                                <span className="capacityNum">{getNumberOfBedrooms()}</span>
                            </div>
                            <div className="beds">
                                <BedIcon/> 
                                <span className="capacityTitle">Beds</span>
                                <span className="capacityNum">{getNumberOfBeds()}</span>
                            </div>
                        </div>
                        <div className="paragraphs">
                            <h3>Description</h3>
                            <p>{cottage.promotionalDescription}</p>
                        </div>
                        <div className="paragraphs">
                            <h3>Behavior rules</h3>
                            <p>{cottage.rules}</p>
                        </div>
                        <div className="paragraphs">
                            <h3>Cancellation conditions</h3>
                            <p>{cottage.cancellationConditions}</p>
                        </div>
                </div>
            </div>
        </div>
    )
}