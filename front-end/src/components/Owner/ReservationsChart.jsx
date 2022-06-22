import React,{useState, useEffect} from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { TextField } from '@mui/material';
  import StarIcon from '@mui/icons-material/Star';
  import muiStyles from '../utils/muiStyles';
  import "./Statistics.css"
  import { MenuItem} from '@mui/material';
  import OwnerService from '../../services/OwnerService';
import BookableService from '../../services/BookableService';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
  );

export default function ReservationsChart(props) {
    const [reportType,setReportType] = useState("reservationsMonthly")
    const [avgRating, setAvgRating] = useState(null)
    const [reservationData, setReservationData] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [lineChartData, setLineChartData] = useState({
        labels:[],
        datasets:[]
    })

    function handleChange(event) {
        const {name, value} = event.target
        setReportType(value)
        changeChartData(value);
    }

    useEffect(() => {
        if (props.allStatistics){
            OwnerService.getReservationStatistics().then((response) => {
                setReservationData(response.data)
                setDataLoaded(true)              
            })
            OwnerService.getAverageRating().then((response) => {
                if (!isNaN(response.data))
                    setAvgRating(response.data.toFixed(2))
            })
        }
        else {
            OwnerService.getReservationStatisticsBookable(props.bookableId).then((response) => {
            setReservationData(response.data)
            setDataLoaded(true)
            })  
            BookableService.getRating(props.bookableId).then((response) => {
                if (!isNaN(response.data))
                    setAvgRating(response.data.toFixed(2))
            })            
            }
    },[]) 

    useEffect(() => {
        changeChartData("reservationsMonthly")

    },[dataLoaded])
    return (
        <div className='reservationStatsContainer'>          
                <div className='statOptions'>
                    <div>       
                        <span>Average rating</span>
                        <StarIcon className="entity__star" />               
                        <span className='entity_rating_value'>{avgRating}</span>
                        <span>/5</span>
                    </div>
                    <TextField
                        select
                        label="Report type"
                        name = "type"
                        className='statTypeCombo'
                        sx = {muiStyles.style}
                        value={reportType}
                        onChange={handleChange}>
                        {statTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                            {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div className = "statChart">
                    {lineChartData && <Line options={lineChartOptions} data={lineChartData}/>  }
                </div>         
        </div>
  )

    function changeChartData(value) {
        var options = { year: 'numeric',day: '2-digit', month: '2-digit',};
        if (value == "reservationsWeekly") {
            let labels = ["0"];
            let dataSets = [{
                label: "Reservations per week", data: [0], borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }];
            for (const item in reservationData["weeklyStatistics"]) {
                let weekStart = new Date(item);
                let weekEnd = new Date(weekStart.getTime());
                weekEnd.setDate(weekEnd.getDate() + 7);
                labels.push(weekStart.toLocaleDateString("en-GB", options) + "-" + weekEnd.toLocaleDateString("en-GB", options));
                dataSets[0].data.push(reservationData["weeklyStatistics"][item]);
            }
            setLineChartData({ labels: labels, datasets: dataSets });
        }

        else if (value == "reservationsMonthly") {
            let labels = ["0"];
            let dataSets = [{
                label: "Reservations per month", data: [0], borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }];
            for (const item in reservationData["monthlyStatistics"]) {
                labels.push(item);
                dataSets[0].data.push(reservationData["monthlyStatistics"][item]);
            }
            setLineChartData({ labels: labels, datasets: dataSets });
        }
        else if (value == "reservationsYearly") {
            let labels = ["0"];
            let dataSets = [{
                label: "Reservations per year", data: [0], borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }];
            for (const item in reservationData["yearlyStatistics"]) {
                labels.push(item);
                dataSets[0].data.push(reservationData["yearlyStatistics"][item]);
            }
            setLineChartData({ labels: labels, datasets: dataSets });
        }
    }
}

const statTypes = [
    {
    value: 'reservationsWeekly',
    label: 'Number of reservations weekly',
    },
    {
    value: 'reservationsMonthly',
    label: 'Number of reservations monthly',
    },
    {
    value: 'reservationsYearly',
    label: 'Number of reservations yearly',
    }
    
    
  ];
 const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Reservation statistics',
      },
    },
  };
