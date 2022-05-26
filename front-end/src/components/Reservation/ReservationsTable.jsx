import "./ReservationsTable.css"
import React,{useEffect,useState} from 'react';
import ReservationService from "../../services/ReservationService"
import ClientService from "../../services/ClientService";
import { DataGrid } from '@mui/x-data-grid';

function ReservationsTable() {
    const [rows, setRows] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [reservations, setReservations] = useState([])

    useEffect(() => {
        ReservationService.getReservations().then(response => 
            {
                setReservations(response.data)
                setRowData()
            },
            
        )             
    }, [dataLoaded])

    function setRowData(){
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour:'numeric', minute:'numeric' };
        reservations.map ((item) => {
            var row = {}
            ClientService.getClientProfilePicture(item.clientId).then(response => {
                row.img = response.data
            }).then
            (ClientService.getClientBasicInfo(item.clientId).then(response => {
                row.name = response.data.name
                row.surname = response.data.surname
                row.email = response.data.email
                row.phoneNumber = response.data.phoneNumber
                row.id = item.id
                row.price = item.price
                row.active = item.active
                row.bookableId = item.bookableId
                row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
                row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
            })).then(() => {
                setRows(prevRows => [...prevRows, row])
            })
        });
        setDataLoaded(true)


    }
    return (
        <div className="reservations--table">
            {dataLoaded && <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
        />}
        </div>
    )

}

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'client', headerName: 'Client', width: 230,
      renderCell:(params) => {
          return (
              <div className = "clientWithImg">
                  {params.row.img &&<img className="clientAvatar" src = {URL.createObjectURL(params.row.img)} alt="avatar"/>}
                  {params.row.email} 
              </div>
          )
      } },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'surname', headerName: 'Surname', width: 160 },
    { field: 'phoneNumber', headerName: 'Phone number', width: 200 },
    { field: 'price', headerName: 'Price', width: 160 },
    { field: 'active', headerName: 'Status', width: 160,},
    { field: 'startDateTime', headerName: 'Started', width: 260 },
    { field: 'endDateTime', headerName: 'Ended', width: 260 },
  ];


export default ReservationsTable