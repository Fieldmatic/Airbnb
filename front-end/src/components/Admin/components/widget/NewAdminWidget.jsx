import React from 'react';
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import muiStyles from '../../../utils/muiStyles';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import LoginRegisterService from '../../../../services/LoginRegisterService';


const NewAdminWidget = ({ showMessage }) => {

  const [openRegisterDialog, setOpenRegisterDialog] = React.useState(false);

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
        surname: "",
        email: "",
        phone: ""
    });

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

    const handleClose = () => {
        setOpenRegisterDialog(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        LoginRegisterService.addAdmin(formData)
        .then(response => {
            setOpenRegisterDialog(false);
            showMessage([response.data, true]);
        })
        .catch(err => {
            setOpenRegisterDialog(false);
            showMessage([err.response.data, false]);
        })
    };

    const registerAdmin = (event) => {
    event.preventDefault();
    setOpenRegisterDialog(true);
    }

    const adminWidgetData = {
    title: "NEW ADMIN",
    addIcon: (
        <Link to="#" onClick={registerAdmin} style={{ textDecoration: "none" }}>
            <AddOutlinedIcon
            className="bigIcon"
            style={{
                color: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
            }}
            />
        </Link>
        ),
    icon: (
        <PersonOutlinedIcon
        className="icon"
        style={{
            color: "crimson",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
        }}
        />
    ),
    };

  const dialog = () => {
      return (
        <Dialog open={openRegisterDialog} onClose={handleClose}>
            <DialogTitle>Register admin</DialogTitle>
            <DialogContent>
            <div className='form--pair'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Name"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "name"
                    value = {formData.name}   
                />
                <TextField
                    sx={muiStyles.style} 
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    label = "Surname"
                    onChange = {handleChange}
                    name = "surname"
                    value = {formData.surname}   
                />
            </div>
            <div className='form--pair'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Username"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "username"
                    value = {formData.username}   
                />
                <TextField
                    sx={muiStyles.style} 
                    variant='outlined'
                    className="form--input"
                    type = "password"
                    label = "Password"
                    onChange = {handleChange}
                    name = "password"
                    value = {formData.password}   
                />
            </div>
            <div className='form--pair'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Email"
                    variant='outlined'
                    className="form--input"
                    type = "email"           
                    onChange = {handleChange}
                    name = "email"
                    value = {formData.email}   
                />
                <TextField
                    sx={muiStyles.style} 
                    label = "State"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleAddressChange}
                    name = "state"
                    value = {formData.address.state}   
                />
            </div>
            <div className='form--pair-3'>
                <TextField
                    sx={muiStyles.style} 
                    label = "City"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleAddressChange}
                    name = "city"
                    value = {formData.address.city}   
                />
                <TextField
                    sx={muiStyles.style} 
                    label = "Street"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleAddressChange}
                    name = "street"
                    value = {formData.address.street}   
                />
                <TextField
                    sx={muiStyles.style} 
                    label = "ZIP"
                    variant='outlined'
                    className="form--input"
                    type = "text"           
                    onChange = {handleAddressChange}
                    name = "zipCode"
                    value = {formData.address.zipCode}   
                />
            </div>
            <div className='form--pair'>
                <PhoneInput
                    className="form--phoneInputClient"
                    onChange = {(value) => {
                        setFormData(prevFormData => {
                        return {
                            ...prevFormData,
                            phone:value
                        }
                        });
                    }}
                    placeholder = "Phone number"
                    name = "phone"
                    value = {formData.phone}   
                />
            </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
      )
  }

  return (
    <div className="widget">
        {openRegisterDialog && dialog()}
        <div className="left">
            <span className="title">{adminWidgetData.title}</span>
            <span className="counter">
                {adminWidgetData.addIcon}
            </span>
        </div>
        <div className="right">
            <div className="percentage positive">
            <KeyboardArrowUpIcon />
            +1
            </div>
            {adminWidgetData.icon}
        </div>
    </div>
  );
};

export default NewAdminWidget;