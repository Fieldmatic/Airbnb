import React from 'react'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import LoginRegisterService from '../../services/LoginRegisterService';
import { Navigate } from "react-router-dom";
import Header from "../../Header";
import muiStyles from '../utils/muiStyles';
import { TextField } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { anyFieldEmpty, isEmail } from '../utils/formValidation';


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
        setErrors(true);
        if (anyFieldEmpty(formData))
            return;

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

    const [errors, setErrors] = React.useState(false)
    
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
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    label = "Surname"
                    onChange = {handleChange}
                    name = "surname"
                    value = {formData.surname}  
                    error={formData.surname === "" && errors}
                    helperText={(formData.surname === "" && errors) ? "Surname is required!" : ""}
                    required={errors} 
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
                        error={formData.address.state === "" && errors}
                        helperText={(formData.address.state === "" && errors) ? "State is required!" : ""}
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
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Username"
                        variant='outlined'
                        className="form--input"
                        type = "text"
                        placeholder = "Username"
                        onChange = {handleChange}
                        name = "username"
                        value = {formData.username}   
                        error={formData.username === "" && errors}
                        helperText={(formData.username === "" && errors) ? "Username is required!" : ""}
                        required={errors}
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Email"
                        variant='outlined'
                        className="form--input"
                        type = "text"
                        onChange = {handleChange}
                        name = "email"
                        value = {formData.email}   
                        error={(formData.email === "" && errors) || (!isEmail(formData.email) && errors)}
                        helperText={((formData.email === "" && errors) ? "Email is required!" : "") || 
                                    ((!isEmail(formData.email) && errors) ? "Wrong format for email!" : "")}
                        required={errors}
                    />
                </div>
                <div className='form--pair'>
                    <TextField
                        sx={muiStyles.style} 
                        label = "Password"
                        variant='outlined'
                        className="form--input"
                        type = "password"
                        onChange = {handleChange}
                        name = "password"
                        value = {formData.password}  
                        error={formData.password === "" && errors || formData.password.length < 6 && errors}
                        helperText={(formData.password === "" && errors) ? "Password is required!" : "" ||
                                    (formData.password.length < 6 && errors) ? "Password must contain at least 6 characters!" : ""}
                        required={errors} 
                    />
                    <TextField
                        sx={muiStyles.style} 
                        label = "Retype password"
                        variant='outlined'
                        className="form--input"
                        type = "password"
                        onChange = {handleChange}
                        name = "passwordRetype"
                        value = {formData.passwordRetype}   
                        error={(formData.passwordRetype !== formData.password && errors) || (formData.passwordRetype === "" && errors)}
                        helperText={(((formData.password !== formData.passwordRetype) && errors) ? "Passwords do not match!" : "") || 
                                    (((formData.passwordRetype === "") && errors) ? "You must confirm password!" : "")}
                        required={errors}
                    />
                </div>
                <br />
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
                    
                    placeholder = {errors ? "Phone number *" : "Phone number"}
                    name = "phoneNumber"
                    value = {formData.phoneNumber}   
                    required={errors}
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
                    accept = {".jpg, .png, .jpeg"}
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