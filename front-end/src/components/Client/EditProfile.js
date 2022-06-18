import React, {useState, useEffect} from 'react'
import "./EditProfile.css"
import ClientService from '../../services/ClientService'
import Popup from '../utils/Popup'
import Header from "../../Header";
import ProfilePicture from './ProfilePicture';
import LoginRegisterService from '../../services/LoginRegisterService';
import OwnerService from '../../services/OwnerService';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import muiStyles from "../utils/muiStyles"
import UserService from '../../services/UserService';
import InstructorService from "../../services/InstructorService";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { ThemeProvider} from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';


export default function EditProfile() {
    const [reasonForDeletion, setReasonForDeletion] = useState("")
    const [opacityClass, setOpacityClass] = useState("")
    const [userRole, setUserRole] = useState("")
    const [passwordChangePopup, setPasswordChangePopup] = React.useState(false);
    const [deletePopup, setDeletePopup] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState(undefined)
    const [editClicked, setEditClicked] = useState(
        {
            nameButton: false,
            surnameButton: false,
            phoneNumberButton: false,
            streetButton: false,
            cityButton: false,
            stateButton: false,
            biographyButton: false
        }   
    )
    const [user, setUser] = useState(
        {
            password: "",
            name: "",
            surname: "",
            phoneNumber: "",
            profilePhoto: "",
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: ""
            },
            biography: "",
            points: 0,
            category: "",
            penalties: 0
        }
    )

    const [passwordChangeData, setPasswordChangeData] = useState({
        newPassword:"",
        oldPassword:""
    })

    const handleClickOpen = () => {
        setPasswordChangePopup(true);
      };

    const openDeletionPopup = () => {
        setDeletePopup(true)
    }

    const closeDeletionPopup = () => {
        setDeletePopup(false);
    };

    const handleClose = () => {
        setPasswordChangePopup(false);
    };

    function submitPasswordChange(){
        UserService.updatePassword(passwordChangeData).then(response =>{
            alert(response.data)
            handleClose()
        }).catch(error => {
            alert(error.response.data)
        });
    }

    function handlePasswordChange(event){
        const {name,value} = event.target
        setPasswordChangeData(prevPasswordData => {
            return {
                ...prevPasswordData,
                [name]:value
            }
        })
    }
    function updateUser(event) {
        const {name, value} = event.target
        let address = false
        if (['street', 'city', 'state'].includes(name)) {
            address = true
        }
        setUser(prevUserData => {
            if (address) {
                return {
                    ...prevUserData,
                    "address": {
                        ...prevUserData.address,
                        [name] : value
                    }
                }
            } else {
                return {
                    ...prevUserData,
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
        UserService.updateUser(user)
    }

    useEffect(() => {
        LoginRegisterService.getUserRole().then(response => {
            if ((response.data === "ROLE_COTTAGE_OWNER") || (response.data ==="ROLE_BOAT_OWNER")) setUserRole("OWNER")
            else if (response.data === "ROLE_INSTRUCTOR") setUserRole("INSTRUCTOR")
            else if (response.data === "ROLE_CLIENT") setUserRole("CLIENT")
        })
        if (userRole === "CLIENT") {
            ClientService.getClient().then((response) => {
                setUser(response.data) 
            })
        }   
        else if (userRole === "OWNER") {
            OwnerService.getOwner().then(response => {
                setUser(response.data)
            })
        }
        else if (userRole === "INSTRUCTOR") {
            InstructorService.getInstructor().then(response => {
                setUser(response.data)
            })
        }
    }, [userRole])

    useEffect(() => {
        if (userRole === "CLIENT") {
            ClientService.getProfilePicture().then((response) => {
                setProfileImage(response.data)
            })
        }
        else if (userRole === "OWNER") {
            OwnerService.getProfilePicture().then((response)=> {
                setProfileImage(response.data)
            })
        }
        else if (userRole === "INSTRUCTOR") {
            InstructorService.getProfilePicture().then((response)=> {
                setProfileImage(response.data)
            })
        }
    },[userRole])

    function handlePopupChange(event) {
        event.preventDefault()
        setReasonForDeletion(event.target.value)
    }

    function saveDeletionReason() {
        UserService.saveReason(reasonForDeletion).then(response => {
            alert(response.data)
            closeDeletionPopup()
        }).catch(error => {
            alert(error.response.data)
        });
    }

    return (
        <div>
            <Header />
            <div className="userProfile">    
                <form className={`userProfileForm ${opacityClass}`}>
                <h1 className='editProfile-header'>Edit your profile</h1>
                {userRole === "CLIENT" ? (
                    <div className='profileImageAndPenalites'>
                    {profileImage && <ProfilePicture profileImage = {profileImage} category={user.category.name} />}
                    <div className='penalitesAndWorning'>
                        {user.penalties >= 3 && <label> <WarningIcon sx={{color:"red"}}/> You can't make a reservation this month because you have three penalties. </label>}
                        <div className='penalties'>
                                <label>The number of your penalties: </label>
                                <label className='penaltiesNum'> {user.penalties} </label>
                        </div>
                    </div>
                </div>
                ) : (
                    profileImage && <ProfilePicture profileImage = {profileImage} category={user.category.name} />
                )
                }
                <div className='user-form-data'>
                    <label className="userLabel"> First Name </label>
                    {editClicked.nameButton ? 
                        <input className="textBox"
                        type="text"
                        onChange={updateUser}
                        name="name"
                        value={user.name}
                    />
                    : 
                        <label className='userLabel'> {user.name}</label>
                    }
                    <button className="updateBtn" id="nameButton" onClick={toggleShown}> {editClicked.nameButton? "Save" : "Edit"}</button>
                </div>
                <div className='user-form-data'>
                <label className="userLabel"> Last Name </label>
                {editClicked.surnameButton ? 
                    <input className="textBox"
                    type="text"
                    onChange={updateUser}
                    name="surname"
                    value={user.surname}
                />
                : 
                    <label className='userLabel'> {user.surname}</label>
                }
                <button className="updateBtn" id="surnameButton" onClick={toggleShown}> {editClicked.surnameButton? "Save" : "Edit"}</button>
                </div>
                <div className='user-form-data'>
                <label className="userLabel"> Phone Number </label>
                {editClicked.phoneNumberButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateUser}
                    name="phoneNumber"
                    value={user.phoneNumber}
                />
                : 
                    <label className='userLabel'> {user.phoneNumber}</label>
                }
                <button className="updateBtn" id="phoneNumberButton" onClick={toggleShown}> {editClicked.phoneNumberButton? "Save" : "Edit"}</button>
                </div>
                <div className='user-form-data'>
                <label className="userLabel"> Street </label>
                {editClicked.streetButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateUser}
                    name="street"
                    value={user.address.street}
                />
                : 
                    <label className='userLabel'> {user.address.street}</label>
                }
                <button className="updateBtn" id="streetButton" onClick={toggleShown}> {editClicked.streetButton? "Save" : "Edit"}</button>
                </div>
                <div className='user-form-data'>
                <label className="userLabel"> City </label>
                {editClicked.cityButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateUser}
                    name="city"
                    value={user.address.city}
                />
                : 
                    <label className='userLabel'> {user.address.city}</label>
                }
                <button className="updateBtn" id="cityButton" onClick={toggleShown}> {editClicked.cityButton? "Save" : "Edit"}</button>
                </div>
                <div className='user-form-data'>                 
                <label className="userLabel"> State </label>
                {editClicked.stateButton? 
                    <input className="textBox"
                    type="text"
                    onChange={updateUser}
                    name="state"
                    value={user.address.state}
                />
                : 
                    <label className='userLabel'> {user.address.state}</label>
                }
                <button className="updateBtn" id="stateButton" onClick={toggleShown}> {editClicked.stateButton? "Save" : "Edit"}</button>
                </div>
                {user.biography && 
                    <div className='user-form-data user-form-data-bio'>                 
                    <label className="userLabel"> Biography </label>
                    {editClicked.biographyButton? 
                        <input className="textBox"
                        type="text"
                        onChange={updateUser}
                        name="state"
                        value={user?.biography}
                    />
                    : 
                        <label className='userLabel'> {user?.biography}</label>
                    }
                    <button className="updateBtn" id="biographyButton" onClick={toggleShown}> {editClicked.biographyButton? "Save" : "Edit"}</button>
                    </div>
                }
                <div className='user-form-data-category'>
                <label className="userLabel"> Points </label>
                <label className='userLabel'> {user.points}</label>
                </div>

                <div className='user-form-data-category'>
                <label className="userLabel"> Category </label>
                <label className={'userLabel ' + user.category.name}> {user.category.name}</label>
                </div>
                
                <div className='delete--reset'>
                    <Button 
                        variant="outlined" 
                        sx = {{
                            backgroundColor : "#FF5A5F", 
                            color:"white",
                            width: '45%',
                            '&:hover': {
                            backgroundColor: 'white',
                            color: '#FF5A5F',
                            
                                    },
                        }}
                        onClick={handleClickOpen}>
                        Change your password
                    </Button>
                    <Dialog open={passwordChangePopup} onClose={handleClose}>
                        <DialogTitle>Password change</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            To change password, please enter your old password to confirm your identity.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            sx = {muiStyles.style}
                            margin="dense"
                            id="passwordConfirm"
                            label="Old password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={passwordChangeData.oldPassword}
                            name = "oldPassword"
                            onChange={handlePasswordChange}
                        />
                        <TextField
                            sx = {muiStyles.style}
                            margin="dense"
                            id="password"
                            label="New password"
                            type="password"
                            fullWidth
                            variant="standard"
                            value={passwordChangeData.newPassword}
                            name = "newPassword"
                            onChange={handlePasswordChange}
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button sx = {{color:"#FF5A5F"}} onClick={handleClose}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={submitPasswordChange}>Change</Button>
                        </DialogActions>
                    </Dialog>
                    <Button 
                        variant="outlined" 
                        sx = {{
                            backgroundColor : "#FF5A5F", 
                            color:"white",
                            width: '45%',
                            '&:hover': {
                            backgroundColor: 'white',
                            color: '#FF5A5F',
                            
                                    },
                        }}
                        className='deleteButton'
                        onClick={openDeletionPopup}>
                        Delete your profile
                    </Button>
                    <Dialog open={deletePopup} onClose={closeDeletionPopup}>
                        <DialogTitle>Account deletion request</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            To delete your account, please enter reason.     
                        </DialogContentText>
                        <textarea className='textAreaReason'
                            value={reasonForDeletion}
                            placeholder="Reason for deletion"
                            onChange={handlePopupChange}
                            name="comments"
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button sx = {{color:"#FF5A5F"}} onClick={closeDeletionPopup}>Cancel</Button>
                        <Button sx = {{color:"#FF5A5F"}} onClick={saveDeletionReason}>Send</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                </form>              
            </div>
        </div>
    )
}

