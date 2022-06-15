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
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';


const Widget = ({ type, showMessage }) => {
  let data;

  const [openRegisterDialog, setOpenRegisterDialog] = React.useState(false);

  const [formData, setFormData] = React.useState({
        moneyPercent: ""
    });

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
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

  switch (type) {
    case "earning":
      data = {
        title: "EARNINGS",
        addIcon: (
          <Link to="#" onClick={registerAdmin} style={{ textDecoration: "none" }}>
              <PercentOutlinedIcon
              className="bigIcon"
              style={{
                  color: "green",
                  backgroundColor: "rgba(0, 128, 0, 0.2)",
              }}
              />
          </Link>
          ),
        isMoney: true,
        percent: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "BALANCE",
        isMoney: true,
        percent: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  const dialog = () => {
      return (
        <Dialog open={openRegisterDialog} onClose={handleClose}>
            <DialogTitle>Money percent that system takes for every reservation</DialogTitle>
            <DialogContent>
            <div className='moneyPercentField'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Money percent"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "moneyPercent"
                    value = {formData.moneyPercent}   
                />
                <h2 className='percentSymbol'>%</h2>
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
            <span className="title">{data?.title}</span>
            <span className="counter">
              {data?.addIcon}
            </span>
        </div>
        <div className="right">
            <div className="percentage positive">
            {data?.percent && "0%"}
            </div>
            {data?.icon}
        </div>
    </div>
  );
};

export default Widget;