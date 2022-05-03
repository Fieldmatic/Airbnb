import React from 'react'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import BoatOwnerService from "../../services/BoatOwnerService"
import CottageOwnerService from "../../services/CottageOwnerService"
import ClientService from '../../services/ClientService';

export default function OwnerRegistration() {
    const [formData, setFormData] = React.useState (
        {
          name : "",
          surname: "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
          },
          username : "",
          password : "",
          passwordRetype: "",
          email : "",
          phoneNumber: "",
        }
  
    )

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
        if (formData.password !== formData.passwordRetype) {
            alert("Passwords aren't matching")
            return
        }
        let type = formData.type;
        let data = new FormData()
        const clientJson = getClientJson();
        data.append("client", clientJson)
        files.map((file) => {
            data.append("files", file.file)
        })
        ClientService.addClient(data).then((response) => {
            alert(response.data);
        }).catch((err) => {
            alert(err.response.data);
        });
    }
    
    return (
    <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
        <h1 className='form--header'>Client Registration</h1>
        <input
            className="form--input"
            type = "text"
            placeholder = "Name"
            onChange = {handleChange}
            name = "name"
            value = {formData.name}   
        />
        <input
            className="form--input"
            type = "text"
            placeholder = "Surname"
            onChange = {handleChange}
            name = "surname"
            value = {formData.surname}   
        />
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
        <input
            className="form--input"
            type = "text"
            placeholder = "Username"
            onChange = {handleChange}
            name = "username"
            value = {formData.username}   
        />
        <input
            className="form--input"
            type = "password"
            placeholder = "Password"
            onChange = {handleChange}
            name = "password"
            value = {formData.password}   
        />
        <input
            className="form--input"
            type = "password"
            placeholder = "Retype Password"
            onChange = {handleChange}
            name = "passwordRetype"
            value = {formData.passwordRetype}   
        />
        <input
            className="form--input"
            type = "text"
            placeholder = "Email"
            onChange = {handleChange}
            name = "email"
            value = {formData.email}   
        />
        <input
            className="form--input"
            type = "text"
            placeholder = "Phone number"
            onChange = {handleChange}
            name = "phoneNumber"
            value = {formData.phoneNumber}   
        />       
        <Dropzone
            style={{ minWidth: "100%", margin:"20px", fontSize:"20px" }}
            onChange={updateFiles}
            minHeight="10%"
            onClean={handleClean}
            value={files}
            maxFiles={1}
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
        <button className="form--submit">Submit</button>  
     </form>
    </div>
    )

    function getClientJson() {
        const json = JSON.stringify(formData);
        const clientJson = new Blob([json], {
            type: 'application/json'
        });
        return clientJson;
    }
}