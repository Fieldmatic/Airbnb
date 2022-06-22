import "./adminProfile.scss";
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import React from "react";
import AdminService from "../../../../services/AdminService";
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import UserService from '../../../../services/UserService'
import { anyFieldEmpty, isEmail } from "../../../utils/formValidation";


const AdminProfile = () => {

  const [formData, setFormData] = React.useState({
    name: "",
    address: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
    },
    username: "",
    password: "",
    newPassword: "",
    surname: "",
    email: "",
    phone: ""
  });

  const [profileImage, setProfileImage] = React.useState(undefined)

  React.useEffect(() => {
    AdminService.getAdmin().then((result) => {
        let admin = result.data;
        setFormData({
            name: admin.name, 
            address: admin.address,
            username: admin.username,
            password: "",
            newPassword: "",
            surname: admin.surname,
            email: admin.email,
            phone: admin.phone,
        })
    })
    AdminService.getProfilePicture().then((response) => {
        setProfileImage(response.data);
    })
  },[])

  const inputs = [
    {
      id: 1,
      label: "Username",
      type: "text",
      value: formData.username,
      name: "username",
      onChange: handleChange,
      errorMessage: "Username cannot be empty!",
    },
    {
      id: 2,
      label: "Name",
      type: "text",
      value: formData.name,
      name: "name",
      onChange: handleChange,
      errorMessage: "Name cannot be empty!",
    },
    {
      id: 3,
      label: "Surname",
      type: "text",
      value: formData.surname,
      name: "surname",
      onChange: handleChange,
      errorMessage: "Surname cannot be empty!",
    },
    {
      id: 4,
      label: "Email",
      type: "email",
      value: formData.email,
      name: "email",
      onChange: handleChange,
      errorMessage: "Email cannot be empty and must be in correct format!",
    },
    {
      id: 5,
      label: "Phone",
      type: "text",
      value: formData.phone,
      name: "phone",
      onChange: handleChange,
      errorMessage: "Phone number cannot be empty and must contain only numbers!",
      pattern: '^[0-9]+$'
    },
    {
      id: 6,
      label: "City",
      type: "text",
      value: formData.address.city,
      name: "city",
      onChange: handleAddressChange,
      errorMessage: "City cannot be empty!",
    },
    {
      id: 7,
      label: "State",
      type: "text",
      value: formData.address.state,
      name: "state",
      onChange: handleAddressChange,
      errorMessage: "State cannot be empty!",
    },
    {
      id: 8,
      label: "Street",
      type: "text",
      value: formData.address.street,
      name: "street",
      onChange: handleAddressChange,
      errorMessage: "Street cannot be empty!",
    },
    {
      id: 9,
      label: "ZIP",
      type: "text",
      value: formData.address.zipCode,
      name: "zipCode",
      onChange: handleAddressChange,
      errorMessage: "ZIP cannot be empty and must be a number!",
      pattern: '^[0-9]+$'
    }
  ];

  function handleChange(event) {
    const {name, value} = event.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
    }));
  }

  function handleAddressChange(event) {
    const {name, value} = event.target
    const address = formData.address
    setFormData(prevFormData => {
        return {
            ...prevFormData,
            address: {
                ...address,
                [name]:value
            }
        }
    })
  }

  const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  function handleSubmit(event){
    event.preventDefault();
    AdminService.updateAdmin(formData)
    .then(() => {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2500)
    })
    .catch(() => {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2500)
    })
  }

  const [openDialog, setOpenDialog] = React.useState(false);

  const openPasswordDialog = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    setErrors(true);
    if (anyFieldEmpty(formData))
      return;

    setOpenDialog(false);
    AdminService.updateAdmin(formData)
    .then(() => {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 2500)
    })
    .catch(() => {
      setShowErrorAlert(true);
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 2500)
    })
  }

  function selectFile(event) {
    let data = new FormData()
    data.append("files", event.target.files[0])
    UserService.changeProfilePicture(data).then((response) => {
        setProfileImage(response.data)
    })
  }

  const [errors, setErrors] = React.useState(false)

  return (
    <div className="new">
      <AdminSidebar />
      <div className="newContainer">
        <AdminNavbar />

        <Collapse in={showSuccessAlert}>
          <Alert variant="filled" severity="success">Profile successfully updated!</Alert>
        </Collapse>
        <Collapse in={showErrorAlert}>
          <Alert variant="filled" severity="error">Your password is incorrect!</Alert>
        </Collapse>

        <div className="top">
          <h1>Profile</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={selectFile}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input 
                    type={input.type} 
                    value={input.value}
                    name={input.name}
                    onChange={input.onChange} 
                    pattern={input?.pattern}
                    required
                    />
                  <span>{input.errorMessage}</span>
                </div>
              ))}
              <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Change password</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    To change password, please enter your password and new passowrd.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Old password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={formData.password}
                    name="password"
                    onChange={handleChange}
                  />
                  <TextField
                    margin="dense"
                    id="password"
                    label="New password"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={formData.newPassword}
                    name="newPassword"
                    onChange={handleChange}
                    error={formData.newPassword === "" && errors || formData.newPassword.length < 6 && errors}
                    helperText={(formData.newPassword === "" && errors) ? "New password is required!" : "" ||
                                (formData.newPassword.length < 6 && errors) ? "New password must contain at least 6 characters!" : ""}
                    required={errors}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleConfirm}>Confirm</Button>
                </DialogActions>
              </Dialog>
              <div className="buttons">
                <button type="button" onClick={openPasswordDialog}>Change Password</button>
                <button type="submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;