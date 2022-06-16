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


export default function ClientReservationHistory() {

    let {entityType} = useParams();
    
    const [rows, setRows] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [reservations, setReservations] = useState([])
    const [showReportDialog, setShowReportDialog] = useState(false)
    const [email, setEmail] = useState("")
    const [id, setId] = useState("")

    useEffect(() => {
        ReservationService.getReservations().then(response => 
            {
                setReservations(response.data)
                setRowData()
            },
            
        )             
    }, [dataLoaded])

    function setRowData(){
        setRows([])
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour:'numeric', minute:'numeric' };
        reservations.map ((item) => {
            //ovde ces dodati proveru && (!item.active)
            if (item.bookableType === entityType) {
                var row = {}
                BookableService.getProfilePicture(item.bookableId).then(response => {
                    row.img = response.data
                    row.id = item.id
                    row.name = item.bookableName
                    row.price = item.price + " €"

                    row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
                    row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
                    row.address = item.bookableAddress.street + ", " + item.bookableAddress.city + ", " + item.bookableAddress.state
                    row.phoneNumber = item.ownerPhoneNumber
                    row.capacity = item.personLimit
                }).then(() => {
                    setRows(prevRows => [...prevRows, row])
                })
        }});
        setDataLoaded(true)
    }

    return (
        <div>
            <Header />
        <div>
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
            {showReportDialog && <ReservationReport handleReportSubmit = {handleReportSubmit} id = {id.toString()} email = {email} handleOpen = {handleReportClicked} handleClose = {handleReportClose}/>}
            </div>
        </div>

    )

}

const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'entity', headerName: 'Name', width: 230,
      renderCell:(params) => {
          return (
              <div className = "clientWithImg">
                  {params.row.img &&<img className="clientAvatar" src = {URL.createObjectURL(params.row.img)} alt="avatar"/>}
                  {params.row.name} 
              </div>
          )
      } },
    { field: 'address', headerName: 'Address', width: 180},
    { field: 'price', headerName: 'Price', width: 110 },
    { field: 'phoneNumber', headerName: 'Phone number', width: 180 },
    { field: 'capacity', headerName: 'Guests number', width: 120 },
    { field: 'startDateTime', headerName: 'Start', width: 260 },
    { field: 'endDateTime', headerName: 'End', width: 260 },

  ];

