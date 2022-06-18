import "./ReservationsTable.css"
import {useParams} from 'react-router-dom';
import React,{useEffect,useState} from 'react';
import ReservationService from "../../services/ReservationService"
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Header from '../../Header';
import BookableService from "../../services/BookableService";
import { gridNumberComparator } from "@mui/x-data-grid/hooks";
import { useLocation } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Alert from 'react-bootstrap/Alert'




export default function ClientReservationHistory() {
  let location = useLocation();

    const [rows, setRows] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [reservations, setReservations] = useState([])
    const [showCancellationDialog, setShowCancellationDialog] = useState(false)
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [reservationId, setReservationId] = useState("")

    const [showSuccess, setShowSuccess] = React.useState(false);
    const [showError, setShowError] = React.useState(false);

    useEffect(() => {
        ReservationService.getFutureReservations().then(response => 
            {
                setReservations(response.data)
                setRowData()
            },
            
        )             
    }, [dataLoaded, location])

    function refreshPage(){
      window.location.reload();
    }

    function setRowData(){
        setRows([])
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour:'numeric', minute:'numeric' };
        reservations.map ((item) => {
          //DODAAAJ !
                var row = {}
                BookableService.getProfilePicture(item.bookableId).then(response => {
                    row.img = response.data
                    row.id = item.id
                    row.name = item.bookableName
                    row.price = item.price + " €"
                    row.canceled = item.canceled
                    row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
                    row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
                    row.address = item.bookableAddress.street + ", " + item.bookableAddress.city + ", " + item.bookableAddress.state
                    row.phoneNumber = item.ownerPhoneNumber
                    row.capacity = item.personLimit
                    row.duration = getPeriodBetweenDates(item.startDateTime, item.endDateTime)
                    row.bookableId = item.bookableId
                    row.ownerId = item.ownerId
                    row.handleCancellationClicked = handleCancellationClicked
                  })
                  .then(() => {
                    setRows(prevRows => [...prevRows, row])
                })
        });
        setDataLoaded(true)
    }

    function handleCancellationClicked(id){
      setReservationId(id)
      setShowCancellationDialog(true)
  }


  function handleClose(){
    setShowCancellationDialog(false)
  }

  function handleDelete() {
    ReservationService.cancelReservation(reservationId).then(response => {
        console.log(response.status)
        if (response.status === 200) {
            setShowSuccess(true)
            refreshPage()
        }
    }).catch(error => {
        setShowError(true)
    });
    setShowCancellationDialog(false)
  }

    return (
        <div>
            <Header />
        <div>
        {showSuccess &&
            <Alert style={{width:"100%", height:"80px"}} variant='success' onClose = {() => setShowSuccess(false)} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>You have successfully canceled the reservation!</p>
            </Alert>
            }
            {showError &&
            <Alert style={{width:"100%", height:"80px"}} variant='danger' onClose = {() => setShowError(false)} dismissible>
                <Alert.Heading>Error!</Alert.Heading>
                <p>You can cancel the reservation no later than 3 days before it starts!</p>
            </Alert>
            }
            <div className="reservations--table" style={{ display: 'flex', height: '80vh' }}>
            {dataLoaded && <DataGrid 
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            rowsPerPageOptions={[10]}
            checkboxSelection
             />}
            </div>
            {showCancellationDialog && <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                    <DialogTitle id="responsive-dialog-title">{"Are you sure you want to cancel the reservation?"}</DialogTitle>
                    <DialogContent><DialogContentText>This action cannot be undone.</DialogContentText></DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleDelete} autoFocus>Agree</Button>
                    </DialogActions>
            </Dialog>}
            </div>
        </div>

    )

}

const dateCustomComparator = (v1, v2) => {
  return new Date(v1).getTime() - new Date(v2).getTime()
};

const doubleCustomComparator = (v1, v2) => {
  v1 = v1.replace(" €", "");
  v2 = v2.replace(" €", "");
  return (parseFloat(v1) - parseFloat(v2))
};

const durationCustomComparator = (v1, v2) => {
  let v1Minutes = getDaysAndHoursFromPeriod(v1)
  let v2Minutes = getDaysAndHoursFromPeriod(v2)
  return v2Minutes - v1Minutes;
};

function getDaysAndHoursFromPeriod(v1) {
  let v1Hours = 0;
  let v1Days = 0;
  v1 = v1.split(" ")
  v1 = v1.filter(e => e !== 'day').filter(e => e !== 'days').filter(e => e !== 'hour').filter(e => e !== 'hours')
  
  if (v1[0] === '') v1Hours = parseFloat(v1[1])
  else if (v1[1] === '') v1Days = parseFloat(v1[0])
  else {
    v1Days = parseFloat(v1[0])
    v1Hours = parseFloat(v1[1])
  }
  return ((v1Days * 24 + v1Hours) * 60);
}

function getPeriodBetweenDates(date1, date2) {
  var seconds = Math.abs(new Date(date2) - new Date(date1)) / 1000
  var days = Math.floor(seconds / 86400);
  seconds -= days * 86400;
  // calculate (and subtract) whole hours
  var hours = Math.floor(seconds / 3600) % 24;

  var daysString = days === 1 ? "day" : "days"
  var hoursString = hours === 1 ? "hour" : "hours"
  return `${days === 0 ? "" : days + " " + daysString} ${hours === 0 ? "" : hours + " " + hoursString}`

}


const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'name', headerName: 'Name', width: 230, sortable: true,
      renderCell:(params) => {
          return (
              <div className = "clientWithImg">
                  {params.row.img &&<img className="clientAvatar" src = {URL.createObjectURL(params.row.img)} alt="avatar"/>}
                  {params.row.name} 
              </div>
          )
      },
    },
    { field: 'address', headerName: 'Address', width: 240, sortable: false},
    { field: 'price', headerName: 'Price', width: 110, sortable: true, sortComparator: doubleCustomComparator},
    { field: 'phoneNumber', headerName: 'Phone number', width: 180, sortable: false },
    { field: 'capacity', headerName: 'Guests number', width: 120, sortable: true, sortComparator: gridNumberComparator },
    { field: 'duration', headerName: 'Duration', width: 170, sortable: true, sortComparator: durationCustomComparator },
    { field: 'startDateTime', headerName: 'Start', width: 260, sortComparator: dateCustomComparator},
    { field: 'endDateTime', headerName: 'End', width: 260, sortComparator: dateCustomComparator},
    { field : 'cancel', headerName : 'Cancellation', width : 190,
    renderCell:(params) => {
      if (!params.row.canceled) {
          return ( <Button 
                    sx = {{ 
                    backgroundColor : "#FF5A5F", 
                    color:"white", 
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#FF5A5F',
                            },
                          }}                       
                    onClick = { () => {params.row.handleCancellationClicked(params.row.id)}}                                    
                    variant='outlined'>Cancel reservation
                </Button>)
         } else {
          return (<div className='checkIcon'><CheckIcon style={{ fontSize: 35, color: '#FF5A5F' }} /> </div>)
        }
  }},
  
  ];


