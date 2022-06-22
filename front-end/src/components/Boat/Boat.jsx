import React from "react";
import './Boat.css'
import BoatService from "../../services/BoatService"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Header from "../../Header";
import { Navigate } from "react-router-dom";
import muiStyles from '../utils/muiStyles';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Tags from '../utils/Tags'
import { anyFieldEmpty } from '../utils/formValidation';


export default function Boat () {
    const [formData, setFormData] = React.useState(
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
            type : "FISHINGBOAT",
            length: "",
            enginesNumber : "",
            enginePower : "",
            maxSpeed : "",
            capacity : "",
            navigationEquipment : "",
            fishingEquipment : ""
        }
    )
    
    const [errors, setErrors] = React.useState(false);

    const [tags, setTags] = React.useState([]);

    const [redirect, setRedirect] = React.useState("")

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
        setFormData(prevFormData => {
        return {
            ...prevFormData,
            [name]: value
        }
        })
    }

    function handleAddressChange(event) {
        const {name, value} = event.target
        const address = formData.address
        setFormData(prevFormData => {
            return {
                ...prevFormData,
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
        if (anyFieldEmpty(formData))
            return;
        if(isNaN(formData.address.zipCode))
            return;
        if(isNaN(formData.capacity))
            return;
        if(isNaN(formData.hourlyRate))
            return;
        if(isNaN(formData.dailyRate))
            return;
        if(isNaN(formData.length))
            return;
        if(isNaN(formData.enginesNumber))
            return;
        if(isNaN(formData.enginePower))
            return;
        if(isNaN(formData.maxSpeed))
            return;

        formData.additionalServices = tags;
        let data = new FormData()
        const boatJson = getBoatJson();
        data.append("boat", boatJson)
        files.map((file) => {
          data.append("files", file.file)
        })
        BoatService.addBoat(data)
        .then(response => {
            alert(response.data)
            setRedirect("/")
        })
      }

    if (redirect){
        return (
            <Navigate to={redirect}/>
        )
    }

    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                <h1 className='form--header'>Boat</h1>  
                <div className='form--pair'>
                    <TextField
                    sx={muiStyles.style} 
                    label = "Name"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "name"
                    value = {formData.name}
                    error={formData.name === "" && errors}
                    helperText={(formData.name === "" && errors) ? "Name is required!" : ""}
                    required={errors}   
                    />
                <TextField
                    sx={muiStyles.style} 
                    label = "Cancellation conditions"
                    variant='outlined'
                    className="form--input"
                    placeholder = "Cancellation conditions"
                    onChange = {handleChange}
                    value = {formData.cancellationConditions}
                    name = "cancellationConditions"
                    error={formData.cancellationConditions === "" && errors}
                    helperText={(formData.cancellationConditions === "" && errors) ? "Cancellation conditions are required!" : ""}
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
                        value = {formData.address.state}
                        error={formData.address.state === "" && errors}
                        helperText={(formData.address.state === "" && errors) ? "County is required!" : ""}
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
                        value = {formData.address.zipCode}
                        error={(formData.address.zipCode === "" && errors) || (isNaN(formData.address.zipCode) && errors)}
                        helperText={(formData.address.zipCode === "" && errors) ? "ZIP is required!" : "" ||
                                    (isNaN(formData.address.zipCode) && errors) ? "ZIP must be a number!" : ""}
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
                        value = {formData.address.city} 
                        error={formData.address.city === "" && errors}
                        helperText={(formData.address.city === "" && errors) ? "City is required!" : ""}
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
                        value = {formData.address.street} 
                        error={formData.address.street === "" && errors}
                        helperText={(formData.address.street === "" && errors) ? "Street is required!" : ""}
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
                    value = {formData.dailyRate} 
                    error={(formData.dailyRate === "" && errors) || (isNaN(formData.dailyRate) && errors)}
                    helperText={(formData.dailyRate === "" && errors) ? "Daily rate is required!" : "" ||
                                (isNaN(formData.dailyRate) && errors) ? "Daily rate must be a number!" : ""}
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
                    value = {formData.hourlyRate}
                    error={(formData.hourlyRate === "" && errors) || (isNaN(formData.hourlyRate) && errors)}
                    helperText={(formData.hourlyRate === "" && errors) ? "Hourly rate is required!" : "" ||
                                (isNaN(formData.hourlyRate) && errors) ? "Hourly rate must be a number!" : ""}
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
                        value={formData.type}
                        error={formData.type === "" && errors}
                        helperText={(formData.type === "" && errors) ? "Boat type is required!" : ""}
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
                        value = {formData.capacity}
                        error={(formData.capacity === "" && errors) || (isNaN(formData.capacity) && errors)}
                        helperText={(formData.capacity === "" && errors) ? "Capacity is required!" : "" ||
                                    (isNaN(formData.capacity) && errors) ? "Capacity must be a number!" : ""}
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
                        value = {formData.length}
                        error={(formData.length === "" && errors) || (isNaN(formData.length) && errors)}
                        helperText={(formData.length === "" && errors) ? "Length is required!" : "" ||
                                    (isNaN(formData.length) && errors) ? "Length must be a number!" : ""}
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
                        value = {formData.enginesNumber}
                        error={(formData.enginesNumber === "" && errors) || (isNaN(formData.enginesNumber) && errors)}
                        helperText={(formData.enginesNumber === "" && errors) ? "Number of engines is required!" : "" ||
                                    (isNaN(formData.enginesNumber) && errors) ? "Number of engines must be a number!" : ""}
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
                        value = {formData.enginePower} 
                        error={(formData.enginePower === "" && errors) || (isNaN(formData.enginePower) && errors)}
                        helperText={(formData.enginePower === "" && errors) ? "Engine power is required!" : "" ||
                                    (isNaN(formData.enginePower) && errors) ? "Engine power must be a number!" : ""}
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
                        value = {formData.maxSpeed}
                        error={(formData.maxSpeed === "" && errors) || (isNaN(formData.maxSpeed) && errors)}
                        helperText={(formData.maxSpeed === "" && errors) ? "Max speed is required!" : "" ||
                                    (isNaN(formData.maxSpeed) && errors) ? "Max speed must be a number!" : ""}
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
                        value={formData.promotionalDescription}
                        onChange={handleChange}
                        error={formData.promotionalDescription === "" && errors}
                        helperText={(formData.promotionalDescription === "" && errors) ? "Promotional description is required!" : ""}
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
                        value={formData.rules}
                        onChange={handleChange}
                        error={formData.rules === "" && errors}
                        helperText={(formData.rules === "" && errors) ? "Rules are required!" : ""}
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
                        value = {formData.navigationEquipment}
                        name = "navigationEquipment"
                        error={formData.navigationEquipment === "" && errors}
                        helperText={(formData.navigationEquipment === "" && errors) ? "Navigation equipment is required!" : ""}
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
                        value = {formData.fishingEquipment}
                        name = "fishingEquipment"
                        error={formData.fishingEquipment === "" && errors}
                        helperText={(formData.fishingEquipment === "" && errors) ? "Fishing equipment is required!" : ""}
                        required={errors}
                    />           
                </div>
                <div className='form--pair'>
                    <Tags tags = {tags} setTags ={setTags}/>
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
            <button className="form--submit">Submit</button>
            </div>
            </form>
            </div>
        </div>
    )
    function createAddressUrl(){
        let addressQuery = formData.address.street + ", " + formData.address.city + ", " + formData.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }

    function getBoatJson() {
        let formDataCopy = { ...formData };
        formDataCopy.navigationEquipment = formDataCopy.navigationEquipment.trim().split(",");
        formDataCopy.fishingEquipment = formDataCopy.fishingEquipment.trim().split(",");
        const json = JSON.stringify(formDataCopy);
        const boatJson = new Blob([json], {
            type: 'application/json'
        });
        return boatJson;
    }
}