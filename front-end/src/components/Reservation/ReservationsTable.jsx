import "./ReservationsTable.css"
import React,{useEffect,useState} from 'react';
import ReservationService from "../../services/ReservationService"
import ClientService from "../../services/ClientService";
import { DataGrid } from '@mui/x-data-grid';

function ReservationsTable(props) {
    const [rows, setRows] = useState([])
    const [loaded, setLoaded] = useState (false)

    useEffect(() => {
        setRowData()           
    }, [loaded])


    function setRowData(){
        let rows = []
        props.reservations.map (item => {
            let row = {}
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit', hour:'numeric', minute:'numeric' };
            ClientService.getClientProfilePicture(item.clientId).then(response => {
                row.img = response.data
            })
            ClientService.getClientBasicInfo(item.clientId).then(response => {
                row.name = response.data.name
                row.surname = response.data.surname
                row.email = response.data.email
                row.phoneNumber = response.data.phoneNumber
            })
            row.id = item.id
            row.price = item.price
            row.active = item.active
            row.bookableId = item.bookableId
            row.startDateTime = new Date(item.startDateTime).toLocaleDateString("en-US",options)
            row.endDateTime = new Date(item.endDateTime).toLocaleDateString("en-US",options)
            rows.push(row)   
        });
        setRows(rows)
        setLoaded(true)

    }
    return (
        <div className="reservations--table">
            {loaded && <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
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