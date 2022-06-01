import React from 'react'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import LoginRegisterService from '../../services/LoginRegisterService';
import { Navigate } from "react-router-dom";
import Header from "../../Header";
import muiStyles from '../utils/muiStyles';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

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

    const [redirect, setRedirect] = React.useState("");

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
        LoginRegisterService.addClient(data).then((response) => {
            alert(response.data);
            setRedirect("/")
        }).catch((err) => {
            alert(err.response.data);
        });
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
                <h1 className='form--header'>Client Registration</h1>
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
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    label = "Surname"
                    onChange = {handleChange}
                    name = "surname"
                    value = {formData.surname}   
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
                        label = "Username"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        placeholder = "Username"
                        onChange = {handleChange}
                        name = "username"
                        value = {formData.username}   
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Email"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "email"
                        value = {formData.email}   
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Password"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "password"
                        onChange = {handleChange}
                        name = "password"
                        value = {formData.password}   
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Retype password"
                        variant='outlined'
                        id="standard-basic"
                        className="form--input"
                        type = "password"
                        onChange = {handleChange}
                        name = "passwordRetype"
                        value = {formData.passwordRetype}   
                    />
                </div>
                <div className='form--pair'>
                <PhoneInput
                    className="form--phoneInputClient"
                    onChange = {(value) => {
                        setFormData(prevFormData => {
                        return {
                            ...prevFormData,
                            phoneNumber:value
                        }
                        });
                }}
                    
                    placeholder = "Phone number"
                    name = "phoneNumber"
                    value = {formData.phoneNumber}   
                />
                </div>
                <div className='form--pair'>
                <Dropzone
                    style={{ minWidth: "100%", fontSize:"18px" }}
                    onChange={updateFiles}
                    minHeight="20vh"
                    onClean={handleClean}
                    value={files}
                    maxFiles={1}
                    string = "drop"
                    label='Drop your profile picture here'
                    accept = {".jpg, .png"}
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

    function getClientJson() {
        const json = JSON.stringify(formData);
        const clientJson = new Blob([json], {
            type: 'application/json'
        });
        return clientJson;
    }
}