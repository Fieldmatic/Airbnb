import React from 'react'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import LoginRegisterService from "../../services/LoginRegisterService"
import Header from "../../Header";
import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import MenuItem from '@mui/material/MenuItem';
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
          registrationExplanation : "",
          role : "ROLE_COTTAGE_OWNER"
        }
  
    )

    const [errors, setErrors] = React.useState(false)

    const account_types = [
        {
          value: 'ROLE_COTTAGE_OWNER',
          label: 'Cottage owner',
        },
        {
          value: 'ROLE_BOAT_OWNER',
          label: 'Boat owner',
        },
        
      ];

    let navigate = useNavigate();

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
        if(isNaN(formData.address.zipCode))
            return;
        if (formData.password.length < 6)
            return;
        if(formData.passwordRetype !== formData.password)
            return;
        if(!isEmail(formData.email))
            return;

        let data = new FormData()
        const ownerJson = getOwnerJson();
        data.append("owner", ownerJson)
        files.map((file) => {
            data.append("files", file.file)
        })
        LoginRegisterService.registerOwner(data).then(response => {
            if (response.status === 200) alert("Success");
            navigate("/");
        });
    }
    
    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                <h1 className='form--header'>Owner Registration</h1>
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
                    className="form--phoneInput"
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
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Account type"
                    name = "role"
                    className='form-account-type'
                    sx = {muiStyles.style}
                    value={formData.role}
                    onChange={handleChange}
                    helperText="Please choose your account type"
                    >
                    {account_types.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                </div>
                <div className='form--pair'>
                <TextField
                    id="outlined-multiline-flexible"
                    label="Registration explanation"
                    className="form--input-area"
                    sx = {muiStyles.style}
                    multiline
                    maxRows={6}
                    name = "registrationExplanation"
                    value={formData.registrationExplanation}
                    onChange={handleChange}
                    error={formData.registrationExplanation === "" && errors}
                    helperText={(formData.registrationExplanation === "" && errors) ? "Registration explanation is required!" : ""}
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
                    label='Drop your profile picture here'
                    accept = {".jpg, .png, .jpeg"}
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
                </div>
                <div className='form--pair'>
                <button className="form--submit">Submit</button>  
                </div>
            </form>
        </div>
    </div>
    )

    function registerOwner(data) {
            RegistrationService.addCottageOwner(data).then((response) => {
                alert(response.data);
                setRedirect("/");
            }).catch((err) => {
                alert(err.response.data);
            });
    }

    function getOwnerJson() {
        const json = JSON.stringify(formData);
        const ownerJson = new Blob([json], {
            type: 'application/json'
        });
        return ownerJson;
    }
}