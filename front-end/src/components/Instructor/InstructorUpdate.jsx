import React from "react";
import "./InstructorRegistration.css";
import InstructorService from "../../services/InstructorService"
import { useParams } from 'react-router-dom'
import Header from "../../Header";


export default function InstructorUpdate() {

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
        biography: ""
    });

    let {id} = useParams();
    const [files, setFiles] = React.useState([]);
    const [profilePhoto, setProfilePhoto] = React.useState(undefined);

    React.useEffect(() => {
        InstructorService.getInstructor(id).then((result) => {
            let instructor = result.data;
            setFormData({
                name: instructor.name, 
                address: instructor.address,
                username: instructor.username,
                password: instructor.password,
                confirmPassword: "",
                surname: instructor.surname,
                email: instructor.email,
                phone: instructor.phone,
                biography: instructor.biography
            })
        })
        InstructorService.getProfilePicture(id).then((response) => {
            setProfilePhoto(response.data)
        })
      },[])

    React.useEffect(() => {
        
    }, [])

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(event){
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
        InstructorService.updateInstructor(data, id)
        .then(response => {
            alert(response.data);
            window.location.reload();
        });
        
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

    const [newPhoto, setNewPhoto] = React.useState("");

    function handleNewPhotoChange(event) {
        const {value} = event.target;
        setFiles(value)
        console.log(value)
    }

    function instructorToJson() {
        let formDataCopy = { ...formData };
        const json = JSON.stringify(formDataCopy);
        const instructorJson = new Blob([json], {
            type: 'application/json'
        });
        return instructorJson;
    }

    return (
        <div>
            <Header />
            <div className="instructor-update-container">
                {/* Form */}
                <div className="item">
                <form className="form--instructor--update" onSubmit={handleSubmit}>
                    <h2 className="form--title">Profile</h2>
                    <input 
                        type="text"
                        placeholder="Username"
                        className="form--input"
                        name="username"
                        readOnly
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
                        readOnly
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
                    <input 
                        type="password"
                        placeholder="Confirm password"
                        className="form--input"
                        name="confirmPassword"
                        onChange={handleChange}
                        value={formData.confirmPassword}
                    />
                    <button
                        className="form--submit"
                    >
                        Update
                    </button>
                </form>
                </div>

                {/* Profile photo */}
                <div className="item">
                    {profilePhoto && <img src={URL.createObjectURL(profilePhoto)} className="profile-photo" alt="user"/>}
                    <div className="file-upload-container">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Change photo
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            name="newPhoto"
                            onChange={handleNewPhotoChange}
                            value={newPhoto}
                            />
                    </div>
                </div>
            </div>
        </div>
    )

}