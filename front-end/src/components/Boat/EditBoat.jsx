import React from 'react'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
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
import { Button } from '@mui/material';
import { anyFieldEmpty } from '../utils/formValidation';


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
          setTagsLoaded(true)
      })
    },[])

    const [files, setFiles] = React.useState([]);

    const [imageSrc, setImageSrc] = React.useState(undefined);

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };

    const handleClean = (files) => {
        console.log("list cleaned", files);
    };

    
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

  React.useEffect(() => {
    if(boat.photos.length == 0) setSlideOpened(false);
  },[boat.photos])

  function handlePhotoDelete(event){
    event.preventDefault()
    if (slideNumber != 0) handleMove("l")
    else handleMove("r")
    setBoat(prevFormData => {
      let newPhotos = prevFormData.photos.map((item) =>item);
      newPhotos.splice(slideNumber,1)
      return {
          ...prevFormData,
          photos:newPhotos
      }
  })
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
    setErrors(true);
    if (anyFieldEmpty(boat))
        return;

    boat.additionalServices = tags;
    prepareEquipment(boat);
    let data = new FormData()
    const boatJson = getBoatJson();
    data.append("boat", boatJson)
    if (files.map.length > 0){
      files.map((file) => {
        data.append("files", file.file)
      })
   }
    BoatService.updateBoat(data, id)
    .then(response => {
      alert(response.data);
      window.location.reload();
    });
  }

  function prepareEquipment(boat){
    try{
      boat.navigationEquipment = boat.navigationEquipment.trim().split(",");
    }catch(e){
    }
    try{
      boat.fishingEquipment = boat.fishingEquipment.trim().split(",");
    }catch(e){
    }
  }

  const [errors, setErrors] = React.useState(false);

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
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "name"
                    value = {boat.name} 
                    error={boat.name === "" && errors}
                    helperText={(boat.name === "" && errors) ? "Name is required!" : ""}
                    required={errors}  
                    />
                <TextField
                    sx={muiStyles.style} 
                    label = "Cancellation conditions"
                    variant='outlined'
                    className="form--input"
                    placeholder = "Cancellation conditions"
                    onChange = {handleChange}
                    value = {boat.cancellationConditions}
                    name = "cancellationConditions"
                    error={boat.cancellationConditions === "" && errors}
                    helperText={(boat.cancellationConditions === "" && errors) ? "Cancellation conditions are required!" : ""}
                    required={errors}
                    />
                 </div>
                 <br />
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Country"
                        variant='outlined'
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "state"
                        value = {boat.address.state}  
                        error={boat.address.state === "" && errors}
                        helperText={(boat.address.state === "" && errors) ? "County is required!" : ""}
                        required={errors}        
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Zip"
                        variant='outlined'
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "zipCode"
                        value = {boat.address.zipCode}
                        error={(boat.address.zipCode === "" && errors) || (isNaN(boat.address.zipCode) && errors)}
                        helperText={(boat.address.zipCode === "" && errors) ? "ZIP is required!" : "" ||
                                    (isNaN(boat.address.zipCode) && errors) ? "ZIP must be a number!" : ""}
                        required={errors}          
                    />
                </div>
                <br />
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "City"
                        variant='outlined'
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "city"
                        value = {boat.address.city}
                        error={boat.address.city === "" && errors}
                        helperText={(boat.address.city === "" && errors) ? "City is required!" : ""}
                        required={errors}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Street"
                        variant='outlined'     
                        className="form--input"
                        type = "text"
                        onChange = {handleAddressChange}
                        name = "street"
                        value = {boat.address.street} 
                        error={boat.address.street === "" && errors}
                        helperText={(boat.address.street === "" && errors) ? "Street is required!" : ""}
                        required={errors}         
                    />
                </div>
                <br />
                <div className='form--pair'>
                <iframe style={{width: "100%", height:"250px", marginTop: "25px"}} src={`https://maps.google.com/maps?q=${createAddressUrl()}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>    
                </div>
                <br />
                <div className='form--pair'>
                    <TextField
                    sx={muiStyles.style} 
                    label = "Daily rate"
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    onChange = {handleChange}
                    name = "dailyRate"
                    value = {boat.dailyRate} 
                    error={(boat.dailyRate === "" && errors) || (isNaN(boat.dailyRate) && errors)}
                    helperText={(boat.dailyRate === "" && errors) ? "Daily rate is required!" : "" ||
                                (isNaN(boat.dailyRate) && errors) ? "Daily rate must be a number!" : ""}
                    required={errors}         
                    />
                    <TextField
                    sx={muiStyles.style} 
                    label = "Hourly rate"
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    onChange = {handleChange}
                    name = "hourlyRate"
                    value = {boat.hourlyRate}
                    error={(boat.hourlyRate === "" && errors) || (isNaN(boat.hourlyRate) && errors)}
                    helperText={(boat.hourlyRate === "" && errors) ? "Hourly rate is required!" : "" ||
                                (isNaN(boat.hourlyRate) && errors) ? "Hourly rate must be a number!" : ""}
                    required={errors}          
                    />
                </div>
                <br />
                <div className='form--pair'>
                    <TextField
                        id="outlined-select"
                        select
                        label="Boat type"
                        name = "type"
                        className='form--input'
                        sx = {muiStyles.style}
                        value={boat.type}
                        error={boat.type === "" && errors}
                        helperText={(boat.type === "" && errors) ? "Boat type is required!" : ""}
                        required={errors}
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
      
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "capacity"
                        value = {boat.capacity}
                        error={(boat.capacity === "" && errors) || (isNaN(boat.capacity) && errors)}
                        helperText={(boat.capacity === "" && errors) ? "Capacity is required!" : "" ||
                                    (isNaN(boat.capacity) && errors) ? "Capacity must be a number!" : ""}
                        required={errors}
                    />
                </div>
                <br />
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Length"
                        variant='outlined'
      
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "length"
                        value = {boat.length} 
                        error={(boat.length === "" && errors) || (isNaN(boat.length) && errors)}
                        helperText={(boat.length === "" && errors) ? "Length is required!" : "" ||
                                    (isNaN(boat.length) && errors) ? "Length must be a number!" : ""}
                        required={errors}         
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Number of engines"
                        variant='outlined'
      
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "enginesNumber"
                        value = {boat.enginesNumber}
                        error={(boat.enginesNumber === "" && errors) || (isNaN(boat.enginesNumber) && errors)}
                        helperText={(boat.enginesNumber === "" && errors) ? "Number of engines is required!" : "" ||
                                    (isNaN(boat.enginesNumber) && errors) ? "Number of engines must be a number!" : ""}
                        required={errors}          
                    />
                </div>
                <br />
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Engine power"
                        variant='outlined'
      
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "enginePower"
                        value = {boat.enginePower}
                        error={(boat.enginePower === "" && errors) || (isNaN(boat.enginePower) && errors)}
                        helperText={(boat.enginePower === "" && errors) ? "Engine power is required!" : "" ||
                                    (isNaN(boat.enginePower) && errors) ? "Engine power must be a number!" : ""}
                        required={errors}          
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Max speed"
                        variant='outlined'
      
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "maxSpeed"
                        value = {boat.maxSpeed}
                        error={(boat.maxSpeed === "" && errors) || (isNaN(boat.maxSpeed) && errors)}
                        helperText={(boat.maxSpeed === "" && errors) ? "Max speed is required!" : "" ||
                                    (isNaN(boat.maxSpeed) && errors) ? "Max speed must be a number!" : ""}
                        required={errors}          
                    />
                </div>
                <br />
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
                        error={boat.promotionalDescription === "" && errors}
                        helperText={(boat.promotionalDescription === "" && errors) ? "Promotional description is required!" : ""}
                        required={errors}
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
                        error={boat.rules === "" && errors}
                        helperText={(boat.rules === "" && errors) ? "Rules are required!" : ""}
                        required={errors}
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
                        error={boat.navigationEquipment === "" && errors}
                        helperText={(boat.navigationEquipment === "" && errors) ? "Navigation equipment is required!" : ""}
                        required={errors}
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
                        error={boat.fishingEquipment === "" && errors}
                        helperText={(boat.fishingEquipment === "" && errors) ? "Fishing equipment is required!" : ""}
                        required={errors}
                    />           
                </div>
                <div className='form--pair'>
                    {tagsLoaded && <Tags tags = {tags} setTags ={setTags}/> }
                    
                </div>
                <div className='form--pair'>
                <Dropzone
                style={{ minWidth: "100%", fontSize:"18px" }}
                onChange={updateFiles}
                minHeight="20vh"
                onClean={handleClean}
                value={files}
                label='Drop your interior & exterior pictures here'
                accept = {".jpg, .png, .jpeg"}
                maxFiles={10}
                header={true}
                maxFileSize={5000000}
            >
                {files.map((file) => (
                <FileItem
                    {...file}
                    key={file.id}
                    onDelete={onDelete}
                    onSee={handleSee}
                    resultOnTooltip
                    preview
                    info
                    hd
                />
                ))}
                <FullScreenPreview
                imgSource={imageSrc}
                openImage={imageSrc}
                onClose={(e) => handleSee(undefined)}
                />
            </Dropzone>
            </div>
          <div className='form--pair'>
          {slideOpened && 
                    <div className="pictureSlider">
                    <CloseIcon className="close" onClick={() => setSlideOpened(false)}></CloseIcon>
                    <ArrowBackIosIcon className="arrow" onClick={() => handleMove("l")}></ArrowBackIosIcon>
                        <div className="sliderWrapper">
                            <div className="sliderImg">
                                <img src={"data:image/jpg;base64," + boat.photos[slideNumber]} alt="" className="sliderImg" />
                                <Button sx = {{ 
                                    backgroundColor : "red", 
                                    color:"white", 
                                    '&:hover': {
                                            backgroundColor: 'black',
                                            color: 'white',
                                                },
                                    }} 
                                    onClick={handlePhotoDelete}
                                    variant='outlined'>Delete photo
                            </Button>
                            </div>
                        </div>
                    <ArrowForwardIosIcon className="arrow" onClick={() => handleMove("r")}></ArrowForwardIosIcon> 
                </div>}
          </div>
          <div className='form--pair'>
          <div className="editEntityImages">
                            {boat.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper" key={i}>
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
          </div>
          <div className='form--pair'>
            <button className="edit-cottage-form--save">Save</button>
          </div>
          </form>
        </div>      
      </div>
    </div>
  )

    function createAddressUrl(){
        let addressQuery = boat.address.street + ", " + boat.address.city + ", " + boat.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }

  function getBoatJson() {
    const json = JSON.stringify(boat);
    const boatJson = new Blob([json], {
        type: 'application/json'
    });
    return boatJson;
}

}
