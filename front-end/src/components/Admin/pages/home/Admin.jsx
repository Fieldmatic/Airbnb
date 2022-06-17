import React, {useEffect, useState} from 'react';
import "./admin.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import inMemoryJwt from '../../../../services/inMemoryJwtService';
import LoginRegisterService from '../../../../services/LoginRegisterService'
import Widget from '../../components/widget/Widget';
import NewAdminWidget from '../../components/widget/NewAdminWidget';
import MoneyWidget from '../../components/widget/MoneyWidget';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import Chart from '../../components/chart/Chart';

import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider} from '@mui/material/styles';
import muiStyles from '../../../utils/muiStyles';
import Button from '@mui/material/Button';
import AdminService from '../../../../services/AdminService';


export default function Admin() {

    const [isUserLogged, setIsUserLogged] = useState(false);
    const [role, setRole] = useState(null);

    const [dateRange, setDateRange] = useState({
        startDate: new Date(),
        endDate: new Date()
    })
    const [chartData, setChartData] = useState([])
    
    useEffect(() => {
        inMemoryJwt.setToken(localStorage.getItem("user"))
        inMemoryJwt.setExpiresIn(localStorage.getItem("expiration"))
        if ((inMemoryJwt.getToken()) !== null) setIsUserLogged(true);
        else setIsUserLogged(false)
        if (isUserLogged){
            LoginRegisterService.getUserRole().then(response => {
                if (response.data === "ROLE_COTTAGE_OWNER") setRole("COTTAGE_OWNER")
                else if (response.data === "ROLE_BOAT_OWNER") setRole("BOAT_OWNER")
                else if (response.data ==="ROLE_INSTRUCTOR") setRole("INSTRUCTOR")
                else if (response.data ==="ROLE_ADMIN") setRole("ADMIN")
                else setRole("CLIENT")
            })
        }
    }, [isUserLogged]);

    const logoutHandler = event => {
        localStorage.clear()
        inMemoryJwt.deleteExpiration()
        inMemoryJwt.deleteToken()
        setIsUserLogged(false)
        setRole(null)
    };

    const [showAlert, setShowAlert] = React.useState(false);
    const [message, setMessage] = React.useState({
        success: undefined,
        text: ""
    })

    const showMessage = (returnMessage) => {
        setShowAlert(true);
        setMessage(() => {
            return {
                success: returnMessage[1],
                text: returnMessage[0]
            }
        })
        setTimeout(() => {
            setShowAlert(false);
        }, 2500)
    }

    const showOnChart = (e) => {
        e.preventDefault();
        let dateRangeCopy = { ...dateRange };
        const offset = dateRange.startDate.getTimezoneOffset();
        let startDateTemp = new Date(dateRange.startDate.getTime() - (offset*60*1000))
        let endDateTemp = new Date(dateRange.endDate.getTime() - (offset*60*1000))

        dateRangeCopy.startDate = startDateTemp.toISOString().split('T')[0] + "T" + "00:00:00";
        dateRangeCopy.endDate = endDateTemp.toISOString().split('T')[0] + "T" + "00:00:00";
        const json = JSON.stringify(dateRangeCopy);
        const dateRangeJson = new Blob([json], {
            type: 'application/json'
        });
        

        AdminService.getChartData(dateRangeCopy.startDate, dateRangeCopy.endDate).then((response) => {
            setChartData(response.data);
        }).catch(() => {
            alert("Sorry, no data to display.")
        })
        
    }

    return (
        <div className="adminHome">
            <AdminSidebar />
            <div className="homeContainer">
                <AdminNavbar />
                <Collapse in={showAlert}>
                    {message.success ? 
                        <Alert variant="filled" severity="success">{message.text}</Alert> :
                        <Alert variant="filled" severity="error">{message.text}</Alert>
                    }           
                </Collapse>
                <div className="widgets">
                    <NewAdminWidget showMessage={showMessage}/>
                    <Widget type="order" showMessage={showMessage}/>
                    <MoneyWidget type="moneyPercent" showMessage={showMessage}/>
                    <MoneyWidget type="total" showMessage={showMessage}/>
                </div>
                <div className="charts">
                    <div className='dateRange'>
                        <div className='dateRangeTitle'>Date range</div>
                        <div className="dateRangePicker">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <ThemeProvider theme={muiStyles.timePickerTheme}>
                                    <DatePicker
                                        renderInput={(params) => {
                                            return (
                                            <TextField
                                                {...params}
                                                sx={muiStyles.style}
                                            />
                                            );
                                        }}
                                        color="#FF5A5F"
                                        label="Start date"
                                        className='expirationDatePicker'
                                        value={dateRange.startDate}
                                        name ="startDate"
                                        onChange= {(newValue) => {
                                            setDateRange(prevFormData => ({
                                                ...prevFormData,
                                                startDate: newValue
                                            }));
                                        }}
                                    />
                                </ThemeProvider>
                            </LocalizationProvider>
                        </div>
                        <div className="dateRangePicker">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <ThemeProvider theme={muiStyles.timePickerTheme}>
                                    <DatePicker
                                        renderInput={(params) => {
                                            return (
                                            <TextField
                                                {...params}
                                                sx={muiStyles.style}
                                            />
                                            );
                                        }}
                                        color="#FF5A5F"
                                        label="End date"
                                        className='expirationDatePicker'
                                        value={dateRange.endDate}
                                        name ="endDate"
                                        onChange= {(newValue) => {
                                            setDateRange(prevFormData => ({
                                                ...prevFormData,
                                                endDate: newValue
                                            }));
                                        }}
                                    />
                                </ThemeProvider>
                            </LocalizationProvider>
                        </div>
                        <div className="acceptBtnContainer">
                            <Button variant="contained" 
                            style={{
                                backgroundColor: "#FF5A5F",
                            }}
                            onClick={showOnChart}
                            >
                                Show on chart
                            </Button>
                        </div>
                    </div>
                    <Chart title="Income chart" aspect={2 / 1} data={chartData}/>
                </div>
            </div>
        </div>
    )
}