import React from 'react'
import AdventureService from '../../services/AdventureService'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { Navigate } from "react-router-dom";
import Header from '../../Header';

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
                    <h2 className="form--header">Create adventure</h2>
                    <input 
                        type="text"
                        placeholder="Name"
                        className="form--input"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    {/* {renderErrorMessage(errorMessages.nameError)} */}
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "State"
                        onChange = {handleAddressChange}
                        name = "state"
                        value = {formData.address.state}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "City"
                        onChange = {handleAddressChange}
                        name = "city"
                        value = {formData.address.city}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "Zip"
                        onChange = {handleAddressChange}
                        name = "zipCode"
                        value = {formData.address.zipCode}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "Street"
                        onChange = {handleAddressChange}
                        name = "street"
                        value = {formData.address.street}          
                    />
                    {/* {renderErrorMessage(errorMessages.addressError)} */}
                    <input 
                        type="text" 
                        placeholder="Capacity"
                        className="form--input"
                        name="capacity"
                        onChange={handleChange}
                        value={formData.capacity}
                    />
                    {/* {renderErrorMessage(errorMessages.capacityError)} */}
                    <input 
                        type="text" 
                        placeholder="Hourly rate"
                        className="form--input"
                        name="hourlyRate"
                        onChange={handleChange}
                        value={formData.hourlyRate}
                    />
                    {/* {renderErrorMessage(errorMessages.hourlyRateError)} */}
                    <textarea 
                        placeholder="Promo description"
                        className="form--input-area"
                        name="promotionalDescription"
                        onChange={handleChange}
                        value={formData.promotionalDescription}
                    />
                    <textarea 
                        placeholder="Behaviour rules"
                        className="form--input-area"
                        name="rules"
                        onChange={handleChange}
                        value={formData.rules}
                    />
                    <textarea 
                        placeholder="Equipment(separate with ',')"
                        className="form--input-area"
                        name="equipment"
                        onChange={handleChange}
                        value={formData.equipment}
                    />
                    <textarea 
                        placeholder="Cancellation conditions"
                        className="form--input-area"
                        name="cancellationConditions"
                        onChange={handleChange}
                        value={formData.cancellationConditions}
                    />
                    <Dropzone
                        style={{ minWidth: "95%", margin:"20px", fontSize:"18px" }}
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