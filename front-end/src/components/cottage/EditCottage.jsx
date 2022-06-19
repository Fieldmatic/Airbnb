import React from 'react'
import './EditCottage.css'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { useParams } from 'react-router-dom'
import Header from "../../Header";
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import Tags from '../utils/Tags';
import { Button } from '@mui/material'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";

export default function EditCottage() {
  let {id} = useParams();
  const [slideNumber, setSlideNumber] = React.useState(0)
  const [slideOpened, setSlideOpened] = React.useState(false)
  const [tags, setTags] = React.useState([]);
  const [tagsLoaded, setTagsLoaded] = React.useState(false)
  const [cottage, setCottage] = React.useState (
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
        photos:[],
        additionalServices:[]
      }
  )
    React.useEffect(() => {
      CottageService.getCottage(id).then((response) => {
          let cottage = response.data;
          setCottage({
              name : cottage.name, 
              address : cottage.address,
              promotionalDescription : cottage.promotionalDescription,
              rules : cottage.rules,
              hourlyRate : cottage.hourlyRate,
              dailyRate : cottage.dailyRate,
              cancellationConditions : cottage.cancellationConditions,
              singleRooms : cottage.singleRooms,
              doubleRooms : cottage.doubleRooms,
              tripleRooms : cottage.tripleRooms,
              quadRooms : cottage.quadRooms,
              photos:cottage.photos
          })
          setTags(cottage.additionalServices)
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
    

  function handleChange(event) {
    const {name, value} = event.target
    setCottage(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
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

  function handleOpenSlider(i) {
    setSlideNumber(i)
    setSlideOpened(true)
  }


  function handleAddressChange(event) {
    const {name, value} = event.target
    const address = cottage.address
    setCottage(prevFormData => {
        return {
            ...prevFormData,
            address: {
                       ...address,
                       [name]:value
                     }
        }
    })
  }

  React.useEffect(() => {
    if(cottage.photos.length == 0) setSlideOpened(false);
  },[cottage.photos])

  function handlePhotoDelete(event){
    event.preventDefault()
    console.log(slideNumber)
    if (slideNumber != 0) handleMove("l")
    else handleMove("r")
    setCottage(prevFormData => {
      let newPhotos = prevFormData.photos.map((item) =>item);
      newPhotos.splice(slideNumber,1)
      console.log(newPhotos)
      return {
          ...prevFormData,
          photos:newPhotos
      }
  })
  }

  function handleRoomChange(name, value) {
    setCottage(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    cottage.additionalServices = tags;
    let data = new FormData()
    const json = JSON.stringify(cottage)
    const cottageJson = new Blob([json], {
      type: 'application/json'
    });
    data.append("cottage", cottageJson)
    if (files.map.length > 0){
      files.map((file) => {
        data.append("files", file.file)
      })
   }
    CottageService.updateCottage(data, id)
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
          <form className="edit-cottage-form">
            <h1 className='edit-cottage-form--header'> {cottage.name}</h1>
            <div className='form--pair'>
                <TextField
                  sx={muiStyles.style} 
                  label = "Name"
                  variant='outlined'
                  className="form--input"
                  type = "text"           
                  onChange = {handleChange}
                  name = "name"
                  value = {cottage.name}   
                />
               <TextField
                  sx={muiStyles.style} 
                  label = "Cancellation conditions"
                  variant='outlined'
                  className="form--input"
                  placeholder = "Cancellation conditions"
                  onChange = {handleChange}
                  value = {cottage.cancellationConditions}
                  name = "cancellationConditions"
                />
            </div>
            <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "Country"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "state"
                  value = {cottage.address.state}          
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Zip"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "zipCode"
                  value = {cottage.address.zipCode}          
              />
          </div>
          <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "City"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "city"
                  value = {cottage.address.city}          
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Street"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "street"
                  value = {cottage.address.street}          
              />
          </div>
          <div className='form--pair'>
          <iframe style={{width: "100%", height:"250px", marginTop: "25px"}} src={`https://maps.google.com/maps?q=${createAddressUrl()}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>    
          </div>
          <div className='form--pair'>
            <TextField
              sx={muiStyles.style} 
              label = "Daily rate"
              variant='outlined'
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "dailyRate"
              value = {cottage.dailyRate}          
            />
            <TextField
              sx={muiStyles.style} 
              label = "Hourly rate"
              variant='outlined'
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "hourlyRate"
              value = {cottage.hourlyRate}          
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
                  value={cottage.promotionalDescription}
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
                  value={cottage.rules}
                  onChange={handleChange}
              />
          </div>
          <div className='form--pair'>
                    {tagsLoaded && <Tags tags = {tags} setTags ={setTags}/> }
                    
          </div>
          <div className='form--bedrooms'>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Single rooms: </label>  
              <Counter name = "singleRooms" value = {cottage.singleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
            <label className='bedRoom--label'>Double rooms: </label>  
              <Counter name = "doubleRooms" value = {cottage.doubleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Triple rooms: </label>  
              <Counter name = "tripleRooms" value = {cottage.tripleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Quad rooms: </label>  
              <Counter name = "quadRooms" value = {cottage.quadRooms} handleChange = {handleRoomChange}/>
            </div>
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
          <div className='form--pair'></div>
          <div className='form--pair'>
          {slideOpened && 
                    <div className="pictureSlider">
                    <CloseIcon className="close" onClick={() => setSlideOpened(false)}></CloseIcon>
                    <ArrowBackIosIcon className="arrow" onClick={() => handleMove("l")}></ArrowBackIosIcon>
                        <div className="sliderWrapper">
                            <div className="sliderImg">
                                <img src={"data:image/jpg;base64," + cottage.photos[slideNumber]} alt="" className="sliderImg" />
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
                            {cottage.photos.map((photo, i) =>(
                                <div className="hotelImgWrapper" key={i}>
                                    <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                                </div>
                            ))}
                        </div>
          </div>
          <div className='form--pair'>
            <button className="edit-cottage-form--save" onClick={handleSubmit}>Save</button>
          </div>
          </form>
        </div>  
      </div>
    </div>
  )
    function createAddressUrl(){
        let addressQuery = cottage.address.street + ", " + cottage.address.city + ", " + cottage.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }
}
