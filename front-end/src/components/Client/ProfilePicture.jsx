import React, {useState, useEffect} from 'react'
import UserService from '../../services/UserService'

export default function ProfilePicture(props) {
    const [profilePhoto, setProfilePhoto] = useState({
        selectedFiles: props.profileImage,
        currentFile: undefined,
        progress: 0,
        message: "",
        fileInfos: [],
    })

    function selectFile(event) {
        console.log(event.target.files[0])
        let data = new FormData()
        data.append("files", event.target.files[0])
        UserService.changeProfilePicture(data).then((response) => {
            console.log(response.data)
            setProfilePhoto((prevProfilePhoto) =>{
                return {
                    ...prevProfilePhoto,
                    selectedFiles:response.data
                }
            })
        })
    }
    return(
        <div className="clientProfilePictureDiv">
            <img src={URL.createObjectURL(profilePhoto.selectedFiles)} className="clientProfilePicture"/>
            <label className='changeProfilePictureBtn'>
            <input type="file" onChange={selectFile} />
             Change profile picture
            </label>
        </div>
    )
}