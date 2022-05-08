import React, {useState, useEffect} from 'react'
import "./ClientProfile.css"
import ClientService from '../../services/ClientService'
import Popup from './Popup'
import Header from "../../Header";

export default function ClientProfile() {
    const [reasonForDeletion, setReasonForDeletion] = useState("")
    const [deletePopup, setDeletePopup] = useState(false)
    const [editClicked, setEditClicked] = useState(
        {
            usernameButton: false,
            nameButton: false,
            surnameButton: false,
            emailButton: false,
            phoneNumberButton: false,
            streetButton: false,
            cityButton: false,
            stateButton: false
        }   
    )
    const [client, setClient] = useState(
        {
            username: "",
            password: "",
            name: "",
            surname: "",
            email: "",
            phoneNumber: "",
            profilePhoto: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: ""
            }
        }
    )

    function updateClient(event) {
        const {name, value} = event.target
        let address = false
        if (['street', 'city', 'state'].includes(name)) {
            address = true
        }
        setClient(prevClientData => {
            if (address) {
                return {
                    ...prevClientData,
                    "address": {
                        ...prevClientData.address,
                        [name] : value
                    }
                }
            } else {
                return {
                    ...prevClientData,
                    [name] : value
                }   
            }
        })
    }


    function toggleShown(event){
        event.preventDefault()
        const {id} = event.target
        setEditClicked(prevShown => {
            return {
                ...prevShown,
                [id]: !editClicked[id]
            }
        })
        ClientService.updateClient(client)
    }
    

    useEffect(() => {
        ClientService.getClient().then((response) => {
            setClient(response.data) 
        })
    }, [])

    function handlePopupChange(event) {
        setReasonForDeletion(event.target.value)
    }

    function saveDeletionReason(event) {
        event.preventDefault()
        ClientService.saveReason(reasonForDeletion)
    }


    return (
        <div>
            <Header />
            <div className="userProfile">
                <h2 className="userProfileHeader"> Personal details</h2>    
                <form className="userProfileForm">
                <label className="userLabel"> Username </label>
                {editClicked.usernameButton ? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="username"
                    value={client.username}
                    />
                : 
                    <label className='userLabel'> {client.username}</label>
                }
                <button className="updateBtn" id="usernameButton" onClick={toggleShown}> {editClicked.usernameButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>

                <label className="userLabel"> First Name </label>
                {editClicked.nameButton ? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="name"
                    value={client.name}
                />
                : 
                    <label className='userLabel'> {client.name}</label>
                }
                <button className="updateBtn" id="nameButton" onClick={toggleShown}> {editClicked.nameButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>

                <label className="userLabel"> Last Name </label>
                {editClicked.surnameButton ? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="surname"
                    value={client.surname}
                />
                : 
                    <label className='userLabel'> {client.surname}</label>
                }
                <button className="updateBtn" id="surnameButton" onClick={toggleShown}> {editClicked.surnameButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>

                <label className="userLabel"> Email </label>
                {editClicked.emailButton ? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="email"
                    value={client.email}
                />
                : 
                    <label className='userLabel'> {client.email}</label>
                }
                <button className="updateBtn" id="emailButton" onClick={toggleShown}> {editClicked.emailButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>


                <label className="userLabel"> PhoneNumber </label>
                {editClicked.phoneNumberButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="phoneNumber"
                    value={client.phoneNumber}
                />
                : 
                    <label className='userLabel'> {client.phoneNumber}</label>
                }
                <button className="updateBtn" id="phoneNumberButton" onClick={toggleShown}> {editClicked.phoneNumberButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>

                <label className="userLabel"> Street </label>
                {editClicked.streetButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="street"
                    value={client.address.street}
                />
                : 
                    <label className='userLabel'> {client.address.street}</label>
                }
                <button className="updateBtn" id="streetButton" onClick={toggleShown}> {editClicked.streetButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>

                <label className="userLabel"> City </label>
                {editClicked.cityButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="city"
                    value={client.address.city}
                />
                : 
                    <label className='userLabel'> {client.address.city}</label>
                }
                <button className="updateBtn" id="cityButton" onClick={toggleShown}> {editClicked.cityButton? "Save" : "Edit"}</button>
                <br></br>
                <br></br>
                
                <label className="userLabel"> State </label>
                {editClicked.stateButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateClient}
                    name="state"
                    value={client.address.state}
                />
                : 
                    <label className='userLabel'> {client.address.state}</label>
                }
                <button className="updateBtn" id="stateButton" onClick={toggleShown}> {editClicked.stateButton? "Save" : "Edit"}</button>
                </form>
                <br></br><br></br>
                <button onClick={() => setDeletePopup(true)} className='deleteButton'> Delete your profile</button>
                <Popup trigger={deletePopup} setTrigger={setDeletePopup}> 
                    <h3> Razlog za brisanje naloga: </h3>
                    <textarea className='textAreaReason' rows="10" cols="40"
                        value={reasonForDeletion}
                        placeholder="Comments"
                        onChange={handlePopupChange}
                        name="comments"
                    />   
                    <button className='saveReasonButton' onClick={saveDeletionReason}> Save</button>
                </Popup>
            </div>
        </div>
    )
}

