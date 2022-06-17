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
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import AdminService from '../../../../services/AdminService';


const LoyaltyWidget = ({ showMessage }) => {

  const [openLoyaltyDialog, setOpenLoyaltyDialog] = React.useState(false);

  const [formData, setFormData] = React.useState({
        clientPoints: "",
        ownerPoints: "",
        bronzePoints: "",
        silverPoints: "",
        goldPoints: ""
    });

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

  const handleClose = () => {
    setOpenLoyaltyDialog(false);
  };

  React.useEffect(() => {
    AdminService.getLoyaltyProgram().then((response) => {
      setFormData(response.data);
    }).catch(err => {
      if (err.response.status == 403){
        setOpenLoyaltyDialog(false);
        showMessage(["You must change your password first and then login again!", false]);
    }
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    AdminService.updateLoyaltyProgram(formData).then((response) => {
      showMessage(["Loyalty program successfully updated.", true]);
      setOpenLoyaltyDialog(false);
    }).catch((err) => {
      if (err.response.status == 403) {
        showMessage(["You must change your password first and then login again!", false]);
        setOpenLoyaltyDialog(false);  
      } else {
        showMessage(["Points must be integer numbers!", false]);
        setOpenLoyaltyDialog(false);
      }
    })
  };

  const updateLoyaltyProgram = (event) => {
    event.preventDefault();
    setOpenLoyaltyDialog(true);
  }

  const loyaltyWidgetData = {
    title: "LOYALTY PROGRAM",
    addIcon: (
        <Link to="#" onClick={updateLoyaltyProgram} style={{ textDecoration: "none" }}>
            <CardMembershipOutlinedIcon
            className="bigIcon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218, 165, 32, 0.2)",
            }}
            />
        </Link>
        ),
    icon: (
        <LoyaltyOutlinedIcon
        className="icon"
        style={{
            color: "goldenrod",
            backgroundColor: "rgba(218, 165, 32, 0.2)",
        }}
        />
    ),
    };

  const dialog = () => {
      return (
        <Dialog open={openLoyaltyDialog} onClose={handleClose}>
            <DialogTitle>Loyalty program</DialogTitle>
            <DialogContent>
            <div className='form--pair'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Client points"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "clientPoints"
                    value = {formData.clientPoints}   
                />
                <TextField
                    sx={muiStyles.style} 
                    variant='outlined'
                    className="form--input"
                    type = "text"
                    label = "Owner points"
                    onChange = {handleChange}
                    name = "ownerPoints"
                    value = {formData.ownerPoints}   
                />
            </div>
            <div className="categoryContainer">
              <h4>CATEGORIES</h4>
              <div className="category bronze">
                <p>Bronze</p>
                <TextField
                    sx={muiStyles.loyaltyStyle1} 
                    variant='outlined'
                    type = "text"
                    label = "Starting points"
                    onChange = {handleChange}
                    name = "bronzePoints"
                    value = {formData.bronzePoints}   
                />
              </div>
              <div className="category silver">
                <p>Silver</p>
                <TextField
                    sx={muiStyles.loyaltyStyle2} 
                    variant='outlined'
                    type = "text"
                    label = "Starting points"
                    onChange = {handleChange}
                    name = "silverPoints"
                    value = {formData.silverPoints}   
                />
              </div>
              <div className="category gold">
                <p>Gold</p>
                <TextField
                    sx={muiStyles.loyaltyStyle3} 
                    variant='outlined'
                    type = "text"
                    label = "Starting points"
                    onChange = {handleChange}
                    name = "goldPoints"
                    value = {formData.goldPoints}   
                />
              </div>
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
        {openLoyaltyDialog && dialog()}
        <div className="left">
            <span className="title">{loyaltyWidgetData?.title}</span>
            <span className="counter">
              {loyaltyWidgetData?.addIcon}
            </span>
        </div>
        <div className="right">
            <div className="percentage positive">
            <KeyboardArrowUpIcon />
            </div>
            {loyaltyWidgetData?.icon}
        </div>
    </div>
  );
};

export default LoyaltyWidget;