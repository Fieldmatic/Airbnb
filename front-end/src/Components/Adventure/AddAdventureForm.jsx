import React from 'react'
import AdventureService from '../../services/AdventureService'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { Navigate } from "react-router-dom";
import Header from '../../Header';
import Tags from '../utils/Tags'
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import { anyFieldEmpty } from '../utils/formValidation';


export default function AddAdventureForm() {
    const [formData, setFormData] = React.useState({
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
        hourlyRate: ""
    });

    const [errors, setErrors] = React.useState(false);

    const [tags, setTags] = React.useState([]);

    const [redirect, setRedirect] = React.useState("");

    const [validForm, setValidFrom] = React.useState(true);
    
    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
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
    
    function handleSubmit(event) {
        event.preventDefault();
        setErrors(true);
        if (anyFieldEmpty(formData))
            return;
        if(isNaN(formData.address.zipCode))
            return;
        if(isNaN(formData.capacity))
            return;
        if(isNaN(formData.hourlyRate))
            return;
        
        setValidFrom(true);
        if (validForm) {
            formData.additionalServices = tags;
            let data = new FormData()
            const adventureJson = adventureToJson();
            data.append("adventure", adventureJson)
            files.map((file) => {
                data.append("files", file.file)
            })
            AdventureService.addAdventure(data)
            .then(response => {
                alert(response.data)
                setRedirect("/")
            })
        }
        
    }

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

    function adventureToJson() {
        let formDataCopy = { ...formData };
        formDataCopy.equipment = formDataCopy.equipment.trim().split(",");
        const json = JSON.stringify(formDataCopy);
        const adventureJson = new Blob([json], {
            type: 'application/json'
        });
        return adventureJson;
    }

    if (redirect){
        return (
            <Navigate to={redirect}/>
        )
    }

    function createAddressUrl(){
        let addressQuery = formData.address.street + ", " + formData.address.city + ", " + formData.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }
    
    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <h1 className="form--header">Adventure</h1>
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
                            helperText={(formData.address.state === "" && errors) ? "Country is required!" : ""}
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
                            label="Equipment"
                            className="form--input-area"
                            sx = {muiStyles.style}
                            multiline
                            maxRows={6}
                            name = "equipment"
                            value={formData.equipment}
                            onChange={handleChange}
                            placeholder="Equipment(separate with ',')"
                            error={formData.equipment === "" && errors}
                            helperText={(formData.equipment === "" && errors) ? "Equipment is required!" : ""}
                            required={errors}
                        />
                    </div>
                     <div className='form--pair'>
                        <Tags tags = {tags} setTags ={setTags}/>
                    </div>
                    <Dropzone
                        style={{ minWidth: "95%", margin:"20px", fontSize:"18px" }}
                        onChange={updateFiles}
                        minHeight="20vh"
                        onClean={handleClean}
                        value={files}
                        maxFiles={10}
                        header={true}
                        label='Drop your adventure pictures here'
                        accept = {".jpg, .png, .jpeg"}
                        maxFileSize={5000000}
                        required
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
                    <button
                        className="form--submit"
                    >
                        Create adventure
                    </button>
                </form>
            </div>
        </div>
    )
}