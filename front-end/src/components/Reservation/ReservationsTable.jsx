import "./ReservationsTable.css"
import React,{useEffect,useState} from 'react';
import ReservationService from "../../services/ReservationService"
import ClientService from "../../services/ClientService";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import ReportService from "../../services/ReportService"
import ReservationReport from "./ReservationReport";
import {useNavigate} from 'react-router-dom';
import { gridNumberComparator } from "@mui/x-data-grid/hooks";

function ReservationsTable() {

    const navigate = useNavigate();
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
            var row = {}
            row.id = item.id
            row.price = item.price + " €"
                if (item.active ==false && item.reportId != null) row.active ="Finished & Reported";
                else if (item.active === true) row.active = "Pending"
                else row.active = "Finished"
                row.bookableId = item.bookableId
                row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
                row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
                row.handleReportClicked = handleReportClicked
                row.handleReserveAgain = handleReserveAgain
            ClientService.getClientProfilePicture(item.clientId).then(response => {
                row.img = response.data
            }).then(
            ClientService.getClientBasicInfo(item.clientId).then(response => {       
                row.name = response.data.name
                row.surname = response.data.surname
                row.email = response.data.email
                row.phoneNumber = response.data.phoneNumber
            })).then(() => {
                setRows(prevRows => [...prevRows, row])
            })
        });
        setDataLoaded(true)
    }

    function handleReportClicked(id, email){
        setId(id)
        setEmail(email)
        setShowReportDialog(true)
    }

    function handleReserveAgain(email, bookableId){
        navigate('/reserveAgain/' + bookableId + "&" + email);
    }

    function handleReportClose(){
        setShowReportDialog(false)
    }

    function refreshPage(){
        window.location.reload();
      }

    function handleReportSubmit(data) {
        ReportService.addReport(data).then(response => {
            alert(response.data)
            refreshPage()
        })
    }
    return (
        <div>
            <div className="reservations--table" style={{ display: 'flex', height: '70vh' }}>
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
         {showReportDialog && <ReservationReport handleReportSubmit = {handleReportSubmit} id = {id.toString()} email = {email} handleOpen = {handleReportClicked} handleClose = {handleReportClose}/>}
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


const columns = [
    { field: 'id', headerName: 'ID', width: 65, sortable: true, sortComparator: gridNumberComparator },
    { field: 'client', headerName: 'Client', width: 230,
      renderCell:(params) => {
          return (
              <div className = "clientWithImg">
                  {params.row.img &&<img className="clientAvatar" src = {URL.createObjectURL(params.row.img)} alt="avatar"/>}
                  {params.row.email} 
              </div>
          )
      } },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'surname', headerName: 'Surname', width: 160 },
    { field: 'phoneNumber', headerName: 'Phone number', width: 180 },
    { field: 'price', headerName: 'Price', width: 110,sortable: true, sortComparator: doubleCustomComparator},
    { field: 'active', headerName: 'Status', width: 140,
        renderCell:(params) => {
            if (params.row.active === "Pending") return (<div className="cellPending"> Pending </div>)
            else if (params.row.active === "Finished") return (<div className="cellFinished"> Finished </div>)
            else return (<div className = "cellFinished">Finished & Reported</div>)
        }
    
    },
    { field: 'startDateTime', headerName: 'Start', width: 260, sortComparator: dateCustomComparator },
    { field: 'endDateTime', headerName: 'End', width: 260, sortComparator: dateCustomComparator },
    { field : 'optional', headerName : 'Optional', width : 190,
        renderCell:(params) => {
            if (params.row.active === "Pending") return ( <Button 
                                                            sx = {{ 
                                                            backgroundColor : "#FF5A5F", 
                                                            color:"white", 
                                                            '&:hover': {
                                                                backgroundColor: 'white',
                                                                color: '#FF5A5F',
                                                                    },
                                                                  }}                       
                                                            onClick = { () => {params.row.handleReserveAgain(params.row.email, params.row.bookableId)}}                                    
                                                            variant='outlined'>Reserve again
                                                </Button>)
            else if (params.row.active === "Finished") return ( <Button sx = {{ 
                                        backgroundColor : "#34568B", 
                                        color:"white", 
                                        '&:hover': {
                                        backgroundColor: 'white',
                                        color: '#34568B',
                                            },
                                    }}
                            onClick = { () => {params.row.handleReportClicked(params.row.id, params.row.email)}} 
                            variant='outlined'>Report
                    </Button>)
            else return (<div></div>)
                                        }
    }
  ];


export default ReservationsTable