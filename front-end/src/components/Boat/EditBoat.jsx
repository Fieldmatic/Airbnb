import React from 'react'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { useParams } from 'react-router-dom'
import Header from "../../Header";
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Tags from '../utils/Tags';
import BoatService from '../../services/BoatService';

export default function EditBoat() {
  let {id} = useParams();
  const [slideNumber, setSlideNumber] = React.useState(0)
  const [slideOpened, setSlideOpened] = React.useState(false)
  const [tags, setTags] = React.useState([]);
  const [tagsLoaded, setTagsLoaded] = React.useState(false)
  const [boat, setBoat] = React.useState (
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
        type : "",
        length :"",
        enginesNumber:"",
        enginePower:"",
        maxSpeed:"",
        capacity:"",
        navigationEquipment:"",
        fishingEquipment:"",
        photos:[],
        additionalServices:[]
      }
  )
    React.useEffect(() => {
      BoatService.getBoat(id).then((response) => {
          let boat = response.data;
          setBoat({
              name : boat.name, 
              address : boat.address,
              promotionalDescription : boat.promotionalDescription,
              rules : boat.rules,
              hourlyRate : boat.hourlyRate,
              dailyRate : boat.dailyRate,
              cancellationConditions : boat.cancellationConditions,
              type : boat.type,
              length: boat.length,
              enginesNumber : boat.enginesNumber,
              enginePower : boat.enginePower,
              maxSpeed : boat.maxSpeed,
              capacity: boat.capacity,
              navigationEquipment: boat.navigationEquipment,
              fishingEquipment: boat.fishingEquipment,
              photos:boat.photos
          })
          setTags(boat.additionalServices)
          console.log(tags)
          setTagsLoaded(true)
      })
    },[])
    
    const boat_types = [
      {
      value: 'FISHINGBOAT',
      label: 'Fishing boat',
      },
      {
      value: 'CRUISER',
      label: 'Cruiser',
      },
      {
      value: 'BOWRIDER',
      label: 'Bowrider',
      },
      {
      value: 'RUNABOUT',
      label: 'Runabout',
      },
      {
      value: 'SAILBOAT',
      label: 'Sailboat',
      },
      {
      value: 'SPEEDBOAT',
      label: 'Speedboat',
      },
      {
      value: 'TRAWLER',
      label: 'Trawler',
      },
      {
      value: 'JETSKI',
      label: 'Jetski',
      },
      {
      value: 'YACHT',
      label: 'Yacht',
      },
      
    ];

  function handleChange(event) {
    const {name, value} = event.target
    setBoat(prevboat => {
      return {
        ...prevboat,
        [name]: value
      }
    })
  }

  function handleMove(direction) {
    let newSlideNumber;
    if (direction === "l") {
        newSlideNumber = slideNumber === 0 ? boat.photos.length - 1 : slideNumber - 1
    } else {
        newSlideNumber = slideNumber === boat.photos.length - 1 ? 0 : slideNumber + 1
    }
    setSlideNumber(newSlideNumber)
}

  function handleOpenSlider(i) {
    setSlideNumber(i)
    setSlideOpened(true)
  }


  function handleAddressChange(event) {
    const {name, value} = event.target
    const address = boat.address
    setBoat(prevboat => {
        return {
            ...prevboat,
            address: {
                       ...address,
                       [name]:value
                     }
        }
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    boat.additionalServices = tags;
    boat.navigationEquipment = boat.navigationEquipment.trim().split(",");
    boat.fishingEquipment = boat.fishingEquipment.trim().split(",");
    BoatService.updateBoat(boat, id)
    .then(response => {
      alert(response.data);
      window.location.reload();
    });
  }

  return (
    <div>
      <Header />
      <div className='edit-cottage-container'>
        <div className="edit-cottage-form-container">
          <form className="edit-cottage-form" onSubmit={handleSubmit}>
            <h1 className='edit-cottage-form--header'> {boat.name}</h1>
            <div className='form--pair'>
                    <TextField
                    sx={muiStyles.style} 
                    label = "Name"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "name"
                    value = {boat.name}   
                    />
                <TextField
                    sx={muiStyles.style} 
                    label = "Cancellation conditions"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    placeholder = "Cancellation conditions"
                    onChange = {handleChange}
                    value = {boat.cancellationConditions}
                    name = "cancellationConditions"
                    />
                 </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Country"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "state"
                        value = {boat.address.state}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Zip"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "zipCode"
                        value = {boat.address.zipCode}          
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "City"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "city"
                        value = {boat.address.city}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Street"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "street"
                        value = {boat.address.street}          
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                    sx={muiStyles.style} 
                    label = "Daily rate"
                    variant='outlined'
                    id="standard-basic" 
                    className="form--input"
                    type = "text"
                    onChange = {handleChange}
                    name = "dailyRate"
                    value = {boat.dailyRate}          
                    />
                    <TextField
                    sx={muiStyles.style} 
                    label = "Hourly rate"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"
                    onChange = {handleChange}
                    name = "hourlyRate"
                    value = {boat.hourlyRate}          
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        id="outlined-select"
                        select
                        label="Boat type"
                        name = "type"
                        className='form--input'
                        sx = {muiStyles.style}
                        value={boat.type}
                        onChange={handleChange}>
                        {boat_types.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Capacity"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "capacity"
                        value = {boat.capacity}
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Length"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "length"
                        value = {boat.length}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Number of engines"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "enginesNumber"
                        value = {boat.enginesNumber}          
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Engine power"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "enginePower"
                        value = {boat.enginePower}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Max speed"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "maxSpeed"
                        value = {boat.maxSpeed}          
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Promotional description"
                        className="form--input-area"
                        sx = {muiStyles.style}
                        multiline
                        maxRows={6}
                        name = "promotionalDescription"
                        value={boat.promotionalDescription}
                        onChange={handleChange}
                    />
                </div>
               <div className='form--pair'>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Rules"
                        className="form--input-area"
                        sx = {muiStyles.style}
                        multiline
                        maxRows={6}
                        name = "rules"
                        value={boat.rules}
                        onChange={handleChange}
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Navigation equipment"
                        className="form--input-area"
                        sx = {muiStyles.style}
                        multiline
                        maxRows={6}
                        onChange = {handleChange}
                        value = {boat.navigationEquipment}
                        name = "navigationEquipment"
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Fishing equipment"
                        className="form--input-area"
                        sx = {muiStyles.style}
                        multiline
                        maxRows={6} 
                        onChange = {handleChange}
                        value = {boat.fishingEquipment}
                        name = "fishingEquipment"
                    />           
                </div>
                <div className='form--pair'>
                    {tagsLoaded && <Tags tags = {tags} setTags ={setTags}/> }
                    
                </div>
          <div className='form--pair'>
          {slideOpened && 
                    <div className="slider">
                    <CloseIcon className="close" onClick={() => setSlideOpened(false)}></CloseIcon>
                    <ArrowBackIosIcon className="arrow" onClick={() => handleMove("l")}></ArrowBackIosIcon>
                        <div className="sliderWrapper">
                            <div className="sliderImg">
                                <img src={"data:image/jpg;base64," + boat.photos[slideNumber]} alt="" className="sliderImg" />
                            </div>
                        </div>
                    <ArrowForwardIosIcon className="arrow" onClick={() => handleMove("r")}></ArrowForwardIosIcon> 
                </div>}
          </div>
          <div className="hotelImages">
                            {boat.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper" key={i}>
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
          <div className='form--pair'>
            <button className="edit-cottage-form--save">Save</button>
          </div>
          </form>
        </div>      
      </div>
    </div>
  )
}
