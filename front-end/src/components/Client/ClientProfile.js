import React, {useState, useEffect} from 'react'
import "./ClientProfile.css"
import ClientService from '../../services/ClientService'

export default function ClientProfile() {
    const [client, setClient] = useState(Object)
    const [address, setAddress] = useState(Object)

    useEffect(() => {
        ClientService.getClient().then((response) => {
            setClient(response.data)
            setAddress(response.data.address)
        })
    }, [])


    return (
        <div className="userProfile">
            <h2 className="userProfileHeader"> User Profile</h2>    
            <form className="userProfileForm">
            <input className="textBox"
                type="text"
                placeholder={`Username: ${client.username}`}
                name="username"
            />
            <input
                className="textBox"
                type="text"
                placeholder={`First Name: ${client.name}`}
                name="firstName"
            />
            <input className="textBox"
                type="text"
                placeholder={`Last Name: ${client.surname}`}
                name="lastName"
            />
            <input className="textBox"
                type="email"
                placeholder={`Email: ${client.email}`}
                name="email"
            />
            <input className="textBox"
                type="text"
                placeholder={`Phone Number: ${client.phoneNumber}`}
                name="phoneNumber"
            />
            <input className="textBox"
                type="text"
                placeholder={`Address: ${address.street}`}
                name="street"
            />
            <input className="textBox"
                type="text"
                placeholder={`City: ${address.city}`}
                name="city"
            />
            <input className="textBox"
                type="text"
                placeholder={`State: ${address.state}`}
                name="state"
            />
            </form>
        </div>
    )
}

