import React from "react"
import AdminService from "../../services/AdminService"
import Button from '@mui/material/Button';
import "./DeletionCard.css"

export default function DeletionReasonCard(props) {
    // const [profilePicture, setProfilePicture] = React.useState(undefined)

    // React.useEffect(() => {
    //     AdminService.getUserProfilePicture(props.user.id).then((response) => {
    //         setProfilePicture(response.data) 
    //     })
    // }, [])

    const handleAccept = () => {
        let confirmation = "true"
        AdminService.registrateUser(props.user.id, props.id, confirmation)
        .then((response) => {
            alert(response.data)
            window.location.reload();
        })
    }

    const handleDeny = () => {
        let confirmation = "false"
        AdminService.registrateUser(props.user.id, props.id, confirmation)
        .then((response) => {
            alert(response.data)
            window.location.reload();
        })
    }

    return(
        <div className="entityCard"> 
            {/* {profilePicture && <img src={URL.createObjectURL(profilePicture)} className="entityCardImage" alt="user"/>} */}
            <h1 className="card--username">Username: {props.user.username}</h1>
            <h3 className="card--name">Name: {props.user.name}</h3>
            <h3 className="card--surname">Surname: {props.user.surname}</h3>
            <h2 className="card--reason">Reason: {props.reason}</h2>            
            <Button 
                className="entityCardButton--deny"
                variant="outlined"
                color="error"
                onClick={handleDeny}>Deny</Button>
            <Button 
                className="entityCardButton--accept"
                variant="contained"
                color="success"
                onClick={handleAccept}>Accept</Button>
        </div>
    )
}