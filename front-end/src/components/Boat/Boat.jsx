import React from "react";
import './Boat.css'
import BoatService from "../../services/BoatService"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Header from "../../Header";
import { Navigate } from "react-router-dom";
import muiStyles from '../utils/muiStyles';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

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

    const [redirect, setRedirect] = React.useState("")

    const [files, setFiles] = React.useState([]);

    const [imageSrc, setImageSrc] = React.useState(undefined);

    const updateFiles = (incommingFiles) => {
        console.log("incomming files", incommingFiles);
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
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "name"
                    value = {formData.name}   
                    />
                <TextField
                    sx={muiStyles.style} 
                    label = "Cancellation conditions"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    placeholder = "Cancellation conditions"
                    onChange = {handleChange}
                    value = {formData.cancellationConditions}
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
                        value = {formData.address.state}          
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
                        value = {formData.address.zipCode}          
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
                        value = {formData.address.city}          
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
                        value = {formData.address.street}          
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
                    value = {formData.dailyRate}          
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
                    value = {formData.hourlyRate}          
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
                        value={formData.type}
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
                        value = {formData.capacity}
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
                        value = {formData.length}          
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
                        value = {formData.enginesNumber}          
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
                        value = {formData.enginePower}          
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
                        value = {formData.maxSpeed}          
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
                        value={formData.promotionalDescription}
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
                        value={formData.rules}
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
                        value = {formData.navigationEquipment}
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
                        value = {formData.fishingEquipment}
                        name = "fishingEquipment"
                    />           
                </div>
                <div className='form--pair'>
                <Dropzone
                style={{ minWidth: "100%", fontSize:"18px" }}
                onChange={updateFiles}
                minHeight="20vh"
                onClean={handleClean}
                value={files}
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