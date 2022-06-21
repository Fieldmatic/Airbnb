import React from 'react';
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import muiStyles from '../../../utils/muiStyles';
import 'react-phone-number-input/style.css'
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import AdminService from '../../../../services/AdminService';
import { anyFieldEmpty } from '../../../utils/formValidation';


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
    setErrors(true);
    if (anyFieldEmpty(formData))
      return;

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

    const [errors, setErrors] = React.useState(false);

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
                      error={(formData.clientPoints === "" && errors) || (isNaN(formData.clientPoints) && errors)}
                      helperText={(formData.clientPoints === "" && errors) ? "Client points are required!" : "" ||
                                  (isNaN(formData.clientPoints) && errors) ? "Client points must be a number!" : ""}
                      required={errors}
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
                      error={(formData.ownerPoints === "" && errors) || (isNaN(formData.ownerPoints) && errors)}
                      helperText={(formData.ownerPoints === "" && errors) ? "Owner points are required!" : "" ||
                                  (isNaN(formData.ownerPoints) && errors) ? "Owner points must be a number!" : ""}
                      required={errors}
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
                      error={(formData.bronzePoints === "" && errors) || (isNaN(formData.bronzePoints) && errors)}
                      helperText={(formData.bronzePoints === "" && errors) ? "Bronze points are required!" : "" ||
                                  (isNaN(formData.bronzePoints) && errors) ? "Bronze points must be a number!" : ""}
                      required={errors}   
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
                      error={(formData.silverPoints === "" && errors) ||
                             (isNaN(formData.silverPoints) && errors) || 
                             (parseInt(formData.silverPoints) <= parseInt(formData.bronzePoints) && errors)
                            }
                      helperText={(formData.silverPoints === "" && errors) ? "Silver points are required!" : "" ||
                                  (isNaN(formData.silverPoints) && errors) ? "Silver points must be a number!" : "" ||
                                  (parseInt(formData.silverPoints) <= parseInt(formData.bronzePoints) && errors ? "Silver points must be greater then bronze!" : "")
                                 }
                      required={errors}  
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
                      error={(formData.goldPoints === "" && errors) ||
                             (isNaN(formData.goldPoints) && errors) ||
                             (parseInt(formData.goldPoints) <= parseInt(formData.bronzePoints) && errors) ||
                             (parseInt(formData.goldPoints) <= parseInt(formData.silverPoints) && errors)
                            }
                      helperText={(formData.goldPoints === "" && errors) ? "Gold points are required!" : "" ||
                                  (isNaN(formData.goldPoints) && errors) ? "Gold points must be a number!" : "" ||
                                  (parseInt(formData.goldPoints) <= parseInt(formData.bronzePoints) && errors ? "Gold points must be greater then bronze!" : "") ||
                                  (parseInt(formData.goldPoints) <= parseInt(formData.silverPoints) && errors ? "Gold points must be greater then silver!" : "")
                                 }
                      required={errors}   
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