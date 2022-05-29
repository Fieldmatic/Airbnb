import "./entityTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'address', headerName: 'Address', width: 180 },
    {
      field: 'capacity',
      headerName: 'Capacity',
      type: 'number',
      width: 90,
    },
    {
      field: 'hourlyRate',
      headerName: 'Hourly rate',
      type: 'number',
      width: 90,
    },
    {
      field: 'promoDescription',
      headerName: 'Promo description',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 250,
    },
  ];
  
  const rows = [
    { id: 1, name: 'Snow', address: 'Jon Lenon 12', capacity: 35, promoDescription: 'asASdasd asdas', hourlyRate: '15' },
    { id: 2, name: 'Lannister', address: 'Cersei asd 12', capacity: 42, promoDescription: 'sdadsada', hourlyRate: '15' },
    { id: 3, name: 'Lannister', address: 'Jaime Oliver 6', capacity: 45, promoDescription: 'asdasd', hourlyRate: '15' },
    { id: 4, name: 'Stark', address: 'Arya Nek 3', capacity: 16, promoDescription: 'asdasdas', hourlyRate: '15' },
    { id: 5, name: 'Targaryen', address: 'Daenerys 4', capacity: 43, promoDescription: 'asdsadsadsadasd', hourlyRate: '15' },
    { id: 6, name: 'Melisandre', address: 'Arse teodorovica 2', capacity: 150, promoDescription: 'asd', hourlyRate: '15' },
    { id: 7, name: 'Clifford', address: 'Ferrara 5', capacity: 44, promoDescription: 'asdasdasd', hourlyRate: '15' },
    { id: 8, name: 'Frances', address: 'Rossini Gilberto 22', capacity: 36, promoDescription: 'asdasda', hourlyRate: '15' },
    { id: 9, name: 'Roxie', address: 'Harvey Steve 13', capacity: 65, promoDescription: 'asdsad', hourlyRate: '15' },
    { id: 10, name: 'Roxie', address: 'Harvey Bejl 7', capacity: 6, promoDescription: 'asdassa', hourlyRate: '15' },
    { id: 11, name: 'Roxie', address: 'Dyon 5', capacity: 65, promoDescription: 'dasdsad', hourlyRate: '15' },
    { id: 12, name: 'Roxie', address: 'Jack Black 55', capacity: 612, promoDescription: 'asdsadas', hourlyRate: '15' },
  ];

const EntityTable = (props) => {
  const [data, setData] = useState(rows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
    setOpen(true);
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  const actionColumn = [
    {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            return (
            <div className="cellActions">
                <Link to="/users/test" style={{ textDecoration: "none" }}>
                    <div className="viewButton">View</div>
                </Link>
                <div
                className="deleteBtn"
                onClick={() => handleDelete(params.row.id)}
                >
                Delete
                </div>
            </div>
            );
        },
    },
  ];
  return (
    <div className="entityTable">
        <div className="entityTableTitle">
            {props.title}
        </div>
        <DataGrid
            className="datagrid"
            rows={data}
            columns={columns.concat(actionColumn)}
            pageSize={10}
            rowsPerPageOptions={[10]}
        />
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
              Entity successfully deleted!
            </Alert>
        </Snackbar>
    </div>
  );
};

export default EntityTable;