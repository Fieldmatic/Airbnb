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
        let data = new FormData()
        data.append("files", event.target.files[0])
        UserService.changeProfilePicture(data).then((response) => {
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
            <img src={URL.createObjectURL(profilePhoto.selectedFiles)} className={"clientProfilePicture img-" + props.category}/>
            <div className='changeProfilePictureDiv'>
                <label>
                <input type="file" onChange={selectFile} />
                Change profile picture
                </label>
            </div>
        </div>
    )
}