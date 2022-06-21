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
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import AdminService from '../../../../services/AdminService';


const MoneyWidget = ({ type, showMessage }) => {
  let data;

  const [openMoneyPercentDialog, setOpenMoneyPercentDialog] = React.useState(false);
  const [moneyPercentageFloat, setMoneyPercentageFloat] = React.useState();

  const [moneyConfig, setMoneyConfig] = React.useState({
        moneyPercentage: "",
        total: ""
    });

    function handleChange(event) {
        const {name, value} = event.target;
        setMoneyConfig(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

  const handleClose = () => {
    setOpenMoneyPercentDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    AdminService.updatePaymentConfig(moneyConfig).then(() => {
      showMessage(["Money percentage successfully updated.", true]);
      setMoneyPercentageFloat(moneyConfig.moneyPercentage);
      setOpenMoneyPercentDialog(false);
    }).catch((err) => {
      if (err.response.status == 403) {
        showMessage(["You must change your password first and then login again!", false]);
        setOpenMoneyPercentDialog(false);  
      } else {
        showMessage(["Money percentage must be a number!", false]);
        setOpenMoneyPercentDialog(false);
      }
    })
  };

  const changeMoneyPercent = (event) => {
    event.preventDefault();
    setOpenMoneyPercentDialog(true);
  }

  React.useEffect(() => {
    AdminService.getPaymentConfig().then((response) => {
      setMoneyConfig(response.data);
      setMoneyPercentageFloat(response.data.moneyPercentage);
    }).catch(err => {
      if (err.response.status == 403) {
        showMessage(["You must change your password first and then login again!", false]);
        setOpenMoneyPercentDialog(false);  
      }
    })
  }, [])

  switch (type) {
    case "moneyPercent":
      data = {
        title: "EARNINGS",
        addIcon: (
          <Link to="#" onClick={changeMoneyPercent} style={{ textDecoration: "none" }}>
              <PercentOutlinedIcon
              className="bigIcon"
              style={{
                  color: "green",
                  backgroundColor: "rgba(0, 128, 0, 0.2)",
              }}
              />
          </Link>
          ),
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
    case "total":
      data = {
        title: "TOTAL",
        isMoney: true,
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
        <Dialog open={openMoneyPercentDialog} onClose={handleClose}>
            <DialogTitle>Money percent that system takes for every reservation</DialogTitle>
            <DialogContent>
            <div className='moneyPercentField'>
                <TextField
                    sx={muiStyles.style} 
                    label = "Money percentage"
                    variant='outlined'
                    id="standard-basic"
                    className="form--input"
                    type = "text"           
                    onChange = {handleChange}
                    name = "moneyPercentage"
                    value = {moneyConfig.moneyPercentage}   
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
        {openMoneyPercentDialog && dialog()}
        <div className="left">
            <span className="title">{data?.title}</span>
            <span className="counter">
              {data?.addIcon}
              {data?.isMoney && moneyConfig.total}
            </span>
        </div>
        <div className="right">
            <div className="percentage positive">
            {data?.percent && (isNaN(parseFloat(moneyPercentageFloat)*100)? 0 : parseFloat(moneyPercentageFloat)*100) + "%"}
            {data?.isMoney && "RSD"}
            </div>
            {data?.icon}
        </div>
    </div>
  );
};

export default MoneyWidget;