import React , {useState, useEffect} from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ThemeProvider} from '@mui/material/styles';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
import OwnerService from '../../services/OwnerService'
import muiStyles from '../utils/muiStyles';
import { Button,TextField } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function IncomeChart(props) {
    const today = new Date()
    const [totalIncome, setTotalIncome] = useState(0)
    const [pieChartData, setPieChartData] = useState({labels:[], datasets:[]})
    const [dataLoaded, setDataLoaded] = useState(false)
    const [incomeData, setIncomeData] = useState([])
    const [incomeDates, setIncomeDates] = useState(
        {
            startDateTime:new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()-14,0,0),
            endDateTime:new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(),0,0)
        }
    )

    useEffect(() => {
        let StartISOString = toISODate(incomeDates.startDateTime)
        let EndISOString = toISODate(incomeDates.endDateTime)
        OwnerService.getIncomeStatistics(StartISOString, EndISOString).then((response) =>{
            setIncomeData(response.data)
            setDataLoaded(true)        
        })
        fillPieChartData()
    },[dataLoaded])
    function fillPieChartData(){
        let income = 0
        let labels = []
        let dataSets = [{label:"Income per entity", data :[],backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1, }]
        for (const item in incomeData){
            labels.push(item)
            dataSets[0].data.push(incomeData[item])
            income += incomeData[item]         
        }
        setTotalIncome(income)
        setPieChartData({labels:labels, datasets:dataSets});
    }

    function handleShowIncomeChartClicked(){
        setDataLoaded(false)
    }
    return (<div className='incomeStatsContainer'>
                <div className='incomeStatsForm'>
                    <span>Your total income in period: {totalIncome} € </span>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ThemeProvider theme={muiStyles.timePickerTheme}>
                            <DateTimePicker
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            sx={muiStyles.style} />
                                    );
                                } }
                                ampm={false}
                                minutesStep={60}
                                color="#FF5A5F"
                                label="Start"
                                className='incomeStatsStart'
                                value={incomeDates.startDateTime}
                                name="startDateTime"
                                onChange={(newValue) => {
                                    setIncomeDates(prevIncomeDates => ({
                                        ...prevIncomeDates,
                                        startDateTime: newValue
                                    }));
                                } } />
                        </ThemeProvider>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <ThemeProvider theme={muiStyles.timePickerTheme}>
                            <DateTimePicker
                                renderInput={(params) => {
                                    return (
                                        <TextField
                                            {...params}
                                            sx={muiStyles.style} />
                                    );
                                } }
                                ampm={false}
                                minutesStep={60}
                                color="#FF5A5F"
                                label="End"
                                className='incomeStatsEnd'
                                value={incomeDates.endDateTime}
                                name="endDateTime"
                                onChange={(newValue) => {
                                    setIncomeDates(prevIncomeDates => ({
                                        ...prevIncomeDates,
                                        endDateTime: newValue
                                    }));
                                } } />
                        </ThemeProvider>
                    </LocalizationProvider>
                    <Button sx={{
                        backgroundColor: "#FF5A5F",
                        color: "white",
                        '&:hover': {
                            backgroundColor: 'white',
                            color: '#FF5A5F',
                        },
                    }}
                        onClick={handleShowIncomeChartClicked}
                        className="showButton"
                        variant='outlined'>Show
                    </Button>
                </div>
                <div className='pieChart'>
                    <Pie options={pieChartOptions} data={pieChartData} />
                </div>
    </div>);
}

const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income in euros for every entity',
      },
    },
  };

  function toISODate (dateTime) {
    dateTime.setSeconds(0)
    return new Date(dateTime.getTime() - dateTime.getTimezoneOffset() * 60000).toISOString()
  }