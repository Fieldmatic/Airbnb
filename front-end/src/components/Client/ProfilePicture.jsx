import React, {useState, useEffect} from 'react'

export default function ProfilePicture(props) {
    return(
        <div className="clientProfilePictureDiv">
            <img src={URL.createObjectURL(props.profileImage)} className={"clientProfilePicture img-" + props.category}/>
            <button className='changeProfilePictureBtn'> Change profile picture</button>
        </div>
    )
}