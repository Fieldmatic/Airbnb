import React from "react";
import "./Instructor.css";
import LoginRegisterService from "../../services/LoginRegisterService"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import { Navigate } from "react-router-dom";
import Header from "../../Header";

export default function InstructorRegistration() {
    const [formData, setFormData] = React.useState({
        name: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
        },
        username: "",
        password: "",
        confirmPassword: "",
        surname: "",
        email: "",
        phone: "",
        registrationExplanation: "",
        biography: "",
        profilePhoto: ""
    });

    const [redirect, setRedirect] = React.useState("");
    
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
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords doesn't match!")
            return;
        }
        let data = new FormData()
        const instructorJson = instructorToJson();
        data.append("instructor", instructorJson)
        files.map((file) => {
            data.append("files", file.file)
        })
        LoginRegisterService.addInstructor(data)
        .then(response => {
            if (response.data === "NC"){    // TODO: izmijeni da hvata eror a ne ovako nc
                alert("Username already exist!")
            } else {
                alert("Success!")
                setRedirect("/")
            }
        });
    }

    const [files, setFiles] = React.useState([]);

    const [imageSrc, setImageSrc] = React.useState(undefined);

    const updateFiles = (incommingFile) => {
        console.log("incomming file", incommingFile);
        setFiles(incommingFile);
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

    // function validateForm() {
    //     setValidFrom(true);
    //     validateName();
    //     validateAddress();
    //     validateCapacity();
    //     validateHourlyRate();
    // }
    
    function instructorToJson() {
        let formDataCopy = { ...formData };
        const json = JSON.stringify(formDataCopy);
        const instructorJson = new Blob([json], {
            type: 'application/json'
        });
        return instructorJson;
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
                    <h2 className="form--title">Instructor Registration</h2>
                    <input 
                        type="text"
                        placeholder="Username"
                        className="form--input"
                        name="username"
                        onChange={handleChange}
                        value={formData.username}
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="form--input"
                        name="password"
                        onChange={handleChange}
                        value={formData.password}
                    />
                    <input 
                        type="password"
                        placeholder="Confirm password"
                        className="form--input"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                    />
                    <input 
                        type="text"
                        placeholder="Name"
                        className="form--input"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <input 
                        type="text"
                        placeholder="Surname"
                        className="form--input"
                        name="surname"
                        onChange={handleChange}
                        value={formData.surname}
                    />
                    <input 
                        type="email"
                        placeholder="E-mail"
                        className="form--input"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
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
                        type="text" 
                        placeholder="Phone"
                        className="form--input"
                        name="phone"
                        onChange={handleChange}
                        value={formData.phone}
                    />
                    <textarea 
                        placeholder="Biography"
                        className="form--input-area"
                        name="biography"
                        onChange={handleChange}
                        value={formData.biography}
                    />
                    <textarea 
                        placeholder="Why you want to create an account?"
                        className="form--input-area"
                        name="registrationExplanation"
                        onChange={handleChange}
                        value={formData.registrationExplanation}
                    />
                    <Dropzone
                        style={{ minWidth: "95%", margin:"20px", fontSize:"18px" }}
                        onChange={updateFiles}
                        minHeight="20vh"
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
                    <button
                        className="form--submit"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}