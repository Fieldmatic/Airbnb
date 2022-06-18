import "./ReservationsTable.css"
import {useParams} from 'react-router-dom';
import React,{useEffect,useState} from 'react';
import ReservationService from "../../services/ReservationService"
import ClientService from "../../services/ClientService";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import ReportService from "../../services/ReportService"
import ReservationReport from "./ReservationReport";
import {useNavigate} from 'react-router-dom';
import Header from '../../Header';
import BookableService from "../../services/BookableService";
import { gridNumberComparator } from "@mui/x-data-grid/hooks";
import { useLocation } from "react-router-dom";
import ReviewsReport from "./ReviewsReport";
import ComplaintsReport from "./ComplaintsReport";
import ReviewService from "../../services/ReviewService";
import ComplaintService from "../../services/ComplaintService";
import CheckIcon from '@mui/icons-material/Check';


export default function ClientReservationHistory() {
  let location = useLocation();
  let {entityType} = useParams();

    const [rows, setRows] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [reservations, setReservations] = useState([])
    const [showReportDialog, setShowReportDialog] = useState(false)
    const [showComplaintDialog, setShowComplaintDialog] = useState(false)
    const [bookableId, setBookableId] = useState("")
    const [ownerId, setOwnerId] = useState("")
    const [reservationId, setReservationId] = useState("")
    const [ownerReviewed, setOwnerReviewed] = useState(false)
    const [bookableReviewed, setBookableReviewed] = useState(false)
    const [ownerComplained, setOwnerComplained] = useState(false)
    const [bookableComplained, setBookableComplained] = useState(false)

    useEffect(() => {
        ReservationService.getReservations().then(response => 
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
            if ((entityType === "Future" && item.active) || (!item.active && entityType !== "Future" && item.bookableType === entityType)) {
                var row = {}
                row.id = item.id
                    row.active = item.active
                    row.name = item.bookableName
                    row.price = item.price + " €"
                    row.ownerReviewed = item.ownerReviewed
                    row.bookableReviewed = item.bookableReviewed
                    row.ownerComplained = item.ownerComplained
                    row.bookableComplained = item.bookableComplained
                    row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
                    row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
                    row.address = item.bookableAddress.street + ", " + item.bookableAddress.city + ", " + item.bookableAddress.state
                    row.phoneNumber = item.ownerPhoneNumber
                    row.capacity = item.personLimit
                    row.duration = getPeriodBetweenDates(item.startDateTime, item.endDateTime)
                    row.bookableId = item.bookableId
                    row.ownerId = item.ownerId
                    row.handleReviewsClicked = handleReviewsClicked
                    row.handleComplaintsClicked = handleComplaintsClicked
                BookableService.getProfilePicture(item.bookableId).then(response => {
                    row.img = response.data
                  })
                  .then(() => {
                    setRows(prevRows => [...prevRows, row])
                })
        }});
        setDataLoaded(true)
    }

    function handleReviewsClicked(id1, id2, id3, ownerRated, bookableRated){
      setBookableId(id1)
      setOwnerId(id2)
      setReservationId(id3)
      setOwnerReviewed(ownerRated)
      setBookableReviewed(bookableRated)
      setShowReportDialog(true)
  }

  function handleComplaintsClicked(id1, id2, id3, ownerCompl, bookableCompl){
    setBookableId(id1)
    setOwnerId(id2)
    setReservationId(id3)
    setOwnerComplained(ownerCompl)
    setBookableComplained(bookableCompl)
    setShowComplaintDialog(true)
  }

  function handleReportClose(){
      setShowReportDialog(false)
      setShowComplaintDialog(false)
  }

  function handleReportSubmit(data) {
    ReviewService.addReview(data).then(response => {
      alert(response.data)
      refreshPage()
  })}

  function handleComplaintSubmit(data) {
    ComplaintService.addComplaint(data).then(response => {
      alert(response.data)
      refreshPage()
  })}

    return (
        <div>
            <Header />
        <div>
            <div className="reservations--table" style={{ display: 'flex', height: '80vh' }}>
            {dataLoaded && <DataGrid 
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            rowsPerPageOptions={[10]}
            checkboxSelection
             />}
            </div>
            {showReportDialog && <ReviewsReport ownerReviewed={ownerReviewed} entityReviewed={bookableReviewed} handleReportSubmit = {handleReportSubmit} id = {reservationId.toString()} bookableId = {bookableId.toString()} ownerId = {ownerId.toString()} handleOpen = {handleReviewsClicked} handleClose = {handleReportClose}/>}
            {showComplaintDialog && <ComplaintsReport ownerComplained={ownerComplained} bookableComplained={bookableComplained} handleReportSubmit = {handleComplaintSubmit} id = {reservationId.toString()} bookableId = {bookableId.toString()} ownerId = {ownerId.toString()} handleOpen = {handleReviewsClicked} handleClose = {handleReportClose}/>}
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
    { field: 'id', headerName: 'ID', width: 60, sortable: true, sortComparator: gridNumberComparator},
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
    { field : 'reviews', headerName : 'Reviews', width : 190,
    renderCell:(params) => {
      if (!params.row.active && ((!params.row.ownerReviewed) || (!params.row.bookableReviewed)))
          return ( <Button 
                    sx = {{ 
                    backgroundColor : "#FF5A5F", 
                    color:"white", 
                    '&:hover': {
                        backgroundColor: 'white',
                        color: '#FF5A5F',
                            },
                          }}                       
                    onClick = { () => {params.row.handleReviewsClicked(params.row.bookableId, params.row.ownerId, params.row.id, params.row.ownerReviewed, params.row.bookableReviewed)}}                                    
                    variant='outlined'>Leave a review
                </Button>)
         else {
          return (<div className='checkIcon'><CheckIcon style={{ fontSize: 35, color: '#FF5A5F' }} /> </div>)
        }
  }},
  { field : 'complaints', headerName : 'Complaints', width : 190,
    renderCell:(params) => {

      if (!params.row.active && ((!params.row.ownerComplained) || (!params.row.bookableComplained)))
          return ( <Button 
                    sx = {{ 
                      backgroundColor : "#34568B", 
                      color:"white", 
                      '&:hover': {
                      backgroundColor: 'white',
                      color: '#34568B',
                          },
                          }}                       
                    onClick = { () => {params.row.handleComplaintsClicked(params.row.bookableId, params.row.ownerId, params.row.id, params.row.ownerComplained, params.row.bookableComplained)}}                                    
                    variant='outlined'>Leave a complaint
                </Button>)
      else {
        return (<div className='checkIcon'><CheckIcon style={{ fontSize: 35, color: '#34568B' }} /> </div>)
      }
  }}
  ];


