import React from 'react'
import AdventureService from '../../services/AdventureService'
import { useParams } from 'react-router-dom'
import Header from '../../Header'
import './Adventure.css';
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import Tags from '../utils/Tags';
import { Button } from '@mui/material'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { anyFieldEmpty } from '../utils/formValidation';


export default function EditAdventure() {
    const [adventure, setAdventure] = React.useState({
        name: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
        },
        promotionalDescription: "",
        capacity: "",
        rules: "",
        equipment: "",
        cancellationConditions: "",
        hourlyRate: "",
        photos:[],
        additionalServices:[]
    });

    let {id} = useParams();
    const [slideNumber, setSlideNumber] = React.useState(0)
    const [slideOpened, setSlideOpened] = React.useState(false)
    const [tags, setTags] = React.useState([]);
    const [tagsLoaded, setTagsLoaded] = React.useState(false)

    React.useEffect(() => {
        AdventureService.getAdventure(id).then((result) => {
            let adventure = result.data;
            setAdventure({
                name: adventure.name || "", 
                address: adventure.address || "",
                promotionalDescription: adventure.promotionalDescription || "",
                rules: adventure.rules || "",
                hourlyRate: adventure.hourlyRate || "",
                cancellationConditions: adventure.cancellationConditions || "",
                capacity: adventure.capacity || "",
                equipment: adventure.equipment.toString() || "",
                photos: adventure.photos
            })
        })
        setTags(adventure.additionalServices)
        setTagsLoaded(true)
    },[])

    React.useEffect(() => {
        if(adventure.photos.length == 0) setSlideOpened(false);
    },[adventure.photos])

    const [errors, setErrors] = React.useState(false);

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

    function handlePhotoDelete(event){
        event.preventDefault()
        console.log(slideNumber)
        if (slideNumber != 0) handleMove("l")
        else if (slideNumber == 0 && adventure.photos.length > 2) handleMove("r")
        setAdventure(prevFormData => {
            let newPhotos = prevFormData.photos.map((item) =>item);
            newPhotos.splice(slideNumber,1)
            console.log(newPhotos)
            return {
                ...prevFormData,
                photos:newPhotos
            }
        })
    }
 
    function handleChange(event) {
        const {name, value} = event.target;
        setAdventure(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleMove(direction) {
        let newSlideNumber;
        if (direction === "l") {
            newSlideNumber = slideNumber === 0 ? adventure.photos.length - 1 : slideNumber - 1
        } else {
            newSlideNumber = slideNumber === adventure.photos.length - 1 ? 0 : slideNumber + 1
        }
        setSlideNumber(newSlideNumber)
    }
    
    function handleOpenSlider(i) {
        setSlideNumber(i)
        setSlideOpened(true)
    }

    function handleSubmit(event){
        event.preventDefault()
        setErrors(true);
        if (anyFieldEmpty(formData))
            return;
        if(isNaN(adventure.address.zipCode))
            return;
        if(isNaN(adventure.capacity))
            return;
        if(isNaN(adventure.hourlyRate))
            return;

        adventure.additionalServices = tags;
        prepareEquipment(adventure)
        let data = new FormData()
        const json = JSON.stringify(adventure)
        const adventureJson = new Blob([json], {
        type: 'application/json'
        });
        data.append("adventure", adventureJson)
        if (files.map.length > 0){
            files.map((file) => {
                data.append("files", file.file)
            })
        }
        AdventureService.updateAdventure(data, id)
        .then(response => {
            alert(response.data);
            window.location.reload();
        });
        
    }

    function handleAddressChange(event) {
        const {name, value} = event.target
        const address = adventure.address
        setAdventure(prevFormData => {
            return {
                ...prevFormData,
                address: {
                    ...address,
                    [name]:value
                }
            }
        })
    }

    function prepareEquipment(adventure){
        try{
            adventure.equipment = adventure.equipment.trim().split(",");
        }catch(e){
        }
    }

    function createAddressUrl(){
        let addressQuery = adventure.address.street + ", " + adventure.address.city + ", " + adventure.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }
    
    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="form--title">{adventure.name}</h2>
                    <div className='form--pair'>
                        <TextField
                            sx={muiStyles.style} 
                            label = "Name"
                            variant='outlined'
                            className="form--input"
                            type = "text"           
                            onChange = {handleChange}
                            name = "name"
                            value = {adventure.name}
                            error={adventure.name === "" && errors}
                            helperText={(adventure.name === "" && errors) ? "Name is required!" : ""}
                            required={errors}   
                        />
                        <TextField
                            sx={muiStyles.style} 
                            label = "Cancellation conditions"
                            variant='outlined'
                            className="form--input"
                            onChange = {handleChange}
                            value = {adventure.cancellationConditions}
                            name = "cancellationConditions"
                            error={adventure.cancellationConditions === "" && errors}
                            helperText={(adventure.cancellationConditions === "" && errors) ? "Cancellation conditions are required!" : ""}
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
                            value = {adventure.address.state} 
                            error={adventure.address.state === "" && errors}
                            helperText={(adventure.address.state === "" && errors) ? "Country is required!" : ""}
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
                            value = {adventure.address.zipCode} 
                            error={(adventure.address.zipCode === "" && errors) || (isNaN(adventure.address.zipCode) && errors)}
                            helperText={(adventure.address.zipCode === "" && errors) ? "ZIP is required!" : "" ||
                                        (isNaN(adventure.address.zipCode) && errors) ? "ZIP must be a number!" : ""}
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
                            value = {adventure.address.city} 
                            error={adventure.address.city === "" && errors}
                            helperText={(adventure.address.city === "" && errors) ? "City is required!" : ""}
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
                            value = {adventure.address.street}
                            error={adventure.address.street === "" && errors}
                            helperText={(adventure.address.street === "" && errors) ? "Street is required!" : ""}
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
                            label = "Capacity"
                            variant='outlined'
                            className="form--input"
                            type = "text"
                            onChange = {handleChange}
                            name = "capacity"
                            value = {adventure.capacity}
                            error={(adventure.capacity === "" && errors) || (isNaN(adventure.capacity) && errors)}
                            helperText={(adventure.capacity === "" && errors) ? "Capacity is required!" : "" ||
                                        (isNaN(adventure.capacity) && errors) ? "Capacity must be a number!" : ""}
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
                            value = {adventure.hourlyRate}
                            error={(adventure.hourlyRate === "" && errors) || (isNaN(adventure.hourlyRate) && errors)}
                            helperText={(adventure.hourlyRate === "" && errors) ? "Hourly rate is required!" : "" ||
                                        (isNaN(adventure.hourlyRate) && errors) ? "Hourly rate must be a number!" : ""}
                            required={errors}          
                        />
                    </div>
                    <br />
                    <div className='form--pair'>
                        <TextField
                            label="Promotional description"
                            className="form--input-area"
                            sx = {muiStyles.style}
                            multiline
                            maxRows={6}
                            name = "promotionalDescription"
                            value={adventure.promotionalDescription}
                            onChange={handleChange}
                            error={adventure.promotionalDescription === "" && errors}
                            helperText={(adventure.promotionalDescription === "" && errors) ? "Promotional description is required!" : ""}
                            required={errors}
                        />
                    </div>
                    <div className='form--pair'>
                        <TextField
                            label="Rules"
                            className="form--input-area"
                            sx = {muiStyles.style}
                            multiline
                            maxRows={6}
                            name = "rules"
                            value={adventure.rules}
                            onChange={handleChange}
                            error={adventure.rules === "" && errors}
                            helperText={(adventure.rules === "" && errors) ? "Rules are required!" : ""}
                            required={errors}
                        />
                    </div>
                    <div className='form--pair'>
                        <TextField
                            label="Equipment"
                            className="form--input-area"
                            sx = {muiStyles.style}
                            multiline
                            maxRows={6}
                            name = "equipment"
                            value={adventure.equipment}
                            onChange={handleChange}
                            placeholder="Equipment(separate with ',')"
                            error={adventure.equipment === "" && errors}
                            helperText={(adventure.equipment === "" && errors) ? "Equipment is required!" : ""}
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
                            label='Drop your adventure pictures here'
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
          {/* <div className='form--pair'></div> */}
                    <div className='form--pair'>
                    {slideOpened && 
                            <div className="pictureSlider">
                            <CloseIcon className="close" onClick={() => setSlideOpened(false)}></CloseIcon>
                            <ArrowBackIosIcon className="arrow" onClick={() => handleMove("l")}></ArrowBackIosIcon>
                                <div className="sliderWrapper">
                                    <div className="sliderImg">
                                        <img src={"data:image/jpg;base64," + adventure.photos[slideNumber]} alt="" className="sliderImg" />
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
                        </div>
                    }
                    </div>
                    <div className="editEntityImages">
                        {adventure.photos.map((photo, i) =>(
                            <div className="hotelImgWrapper" key={i}>
                                <img src={"data:image/jpg;base64," + photo} onClick={() => handleOpenSlider(i)} alt = "" className="hotelImg"></img>
                            </div>
                        ))}
                    </div>
                    <div className='form--pair'>
                        <button className="edit-cottage-form--save" onClick={handleSubmit}>Save</button>
                    </div>
                </form>
            </div>
        </div>
        
    )
}