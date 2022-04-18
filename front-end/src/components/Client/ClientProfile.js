import React, {useState, useEffect} from 'react'
import "./ClientProfile.css"
import ClientService from '../../services/ClientService'

export default function ClientProfile() {
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

    useEffect(() => {
        ClientService.getClient().then((response) => {
            setClient(response.data) 
        })
    }, [])


    return (
        <div className="userProfile">
            <h2 className="userProfileHeader"> Personal details</h2>    
            <form className="userProfileForm">
            <label className="userLabel"> Username </label>
                <input className="textBox"
                type="text"
                name="username"
                value={client.username}
                />
            <br></br>
            <br></br>

            <label className="userLabel"> First Name </label>
           
                <input className="textBox"
                type="text"
                name="name"
                value={client.name}
            />
            <br></br>
            <br></br>

            <label className="userLabel"> Last Name </label>
    
                <input className="textBox"
                type="text"
                name="surname"
                value={client.surname}
            />
           
            <br></br>
            <br></br>

            <label className="userLabel"> Email </label>
        
                <input className="textBox"
                type="text"
                name="email"
                value={client.email}
            />
            <br></br>
            <br></br>


            <label className="userLabel"> PhoneNumber </label>

                <input className="textBox"
                type="text"
                name="phoneNumber"
                value={client.phoneNumber}
            />
        
            <br></br>
            <br></br>

            <label className="userLabel"> Street </label>

                <input className="textBox"
                type="text"
                name="street"
                value={client.address.street}
            />
           
            <br></br>
            <br></br>

            <label className="userLabel"> City </label>
                <input className="textBox"
                type="text"
                name="city"
                value={client.address.city}
           />
            <br></br>
            <br></br>
            
            <label className="userLabel"> State </label>
                <input className="textBox"
                type="text"
                name="state"
                value={client.address.state}
            />
            </form>
        </div>
    )
}

