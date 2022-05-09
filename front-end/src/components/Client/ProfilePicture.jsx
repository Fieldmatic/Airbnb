import React, {useState, useEffect} from 'react'
import ClientService from "../../services/ClientService"

export default function ProfilePicture(props) {
    const [profileImage, setProfileImage] = React.useState(undefined)

    useEffect(() => {
        ClientService.getProfilePicture().then((response) => {
            setProfileImage(response.data) 
        })
    }, [])
    return(
        <div className="clientProfilePictureDiv">
            {profileImage && <img src={URL.createObjectURL(profileImage)} className="clientProfilePicture"/>}
            <button className='changeProfilePictureBtn'> Change profile picture</button>
        </div>
    )
}