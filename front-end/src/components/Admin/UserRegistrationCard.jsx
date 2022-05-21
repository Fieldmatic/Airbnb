import React from "react"
import AdminService from "../../services/AdminService"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./DeletionCard.css"

export default function DeletionReasonCard(props) {
    // const [profilePicture, setProfilePicture] = React.useState(undefined)

    // React.useEffect(() => {
    //     AdminService.getUserProfilePicture(props.user.id).then((response) => {
    //         setProfilePicture(response.data) 
    //     })
    // }, [])

    const [message, setMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [confirmation, setConfirmation] = React.useState("true");

    const handleMessageChange = (event) => {
        const {value} = event.target;
        setMessage(value);
    }

    const handleAcceptMessage = () => {
        if(message === "") {
            return;
        }
        let rejectingMessage = new FormData()
        const dataJson = dataToJson();
        rejectingMessage.append("message", dataJson)
        AdminService.registrateUser(props.user.id, props.id, confirmation, rejectingMessage)
        alert("Request for user registration denied!")
        window.location.reload();
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleAccept = () => {
        setConfirmation("true");
        setMessage("");
        let accpetingMessage = new FormData();
        const dataJson = dataToJson();
        accpetingMessage.append("message", dataJson)
        AdminService.registrateUser(props.user.id, props.id, confirmation, accpetingMessage)
        alert("User successfully registered!")
        window.location.reload();
    }

    const handleDeny = () => {
        setConfirmation("false");
        setOpen(true);
    }

    function dataToJson() {
        const json = JSON.stringify(message);
        const dataJson = new Blob([json], {
            type: 'application/json'
        });
        return dataJson;
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
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Registration rejection</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Enter your reasons for rejecting account registration
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="message"
                    label="Reason for rejecting"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={message}
                    name="reason"
                    onChange={handleMessageChange}
                />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAcceptMessage}>Accept</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}