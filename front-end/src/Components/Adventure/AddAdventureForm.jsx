import React from 'react'
import AdventureService from '../../services/AdventureService'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { Navigate } from "react-router-dom";
import Header from '../../Header';
import Tags from '../utils/Tags'
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';

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
                        />
                        <TextField
                        sx={muiStyles.style} 
                        label = "Cancellation conditions"
                        variant='outlined'
                        className="form--input"
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
                            label = "Capacity"
                            variant='outlined'
                            className="form--input"
                            type = "text"
                            onChange = {handleChange}
                            name = "capacity"
                            value = {formData.capacity}          
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
                        />
                    </div>
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
                        accept = {".jpg, .png"}
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