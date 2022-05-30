import "./entityTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AdventureService from "../../../../services/AdventureService"
import BoatService from "../../../../services/BoatService"
import CottageService from "../../../../services/CottageService"


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
    { field: 'address', 
      headerName: 'Address', 
      width: 180,
      valueGetter: (params) =>
      `${params.row.address.state || ''}, ${params.row.address.city || ''}, ${params.row.address.street || ''}`
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      type: 'number',
      width: 90,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      width: 90,
    },
    {
      field: 'promotionalDescription',
      headerName: 'Promo description',
      description: 'This column is not sortable.',
      sortable: false,
      width: 250,
    },
  ];
  
  

const EntityTable = (props) => {
  
  const [rows, setRows] = useState([]);

  useEffect(() => {
      if (props.type === 1) {
          AdventureService.getAllAdventures().then((response) => {
              setRows(response.data);
          })
      }else if(props.type === 2) {
          CottageService.getAllCottages().then((response) => {
              setRows(response.data);
          })
      }else {
          BoatService.getAllBoats().then((response) => {
              setRows(response.data);
          })
      }
  }, [props.type])

  const handleDelete = (id) => {
    if (props.type === 1) {
      AdventureService.deleteAdventure(id)
      .then(() => {
        setRows(rows.filter((item) => item.id !== id));
        setOpenSuccess(true);
      })
      .catch(() => {
        setOpenError(true);
      })
    }else if(props.type === 2) {
      CottageService.getAllCottages(id)
      .then(() => {
        setRows(rows.filter((item) => item.id !== id));
        setOpenSuccess(true);
      })
      .catch(() => {
        setOpenError(true);
      })
    }else {
      BoatService.getAllBoats(id)
      .then(() => {
        setRows(rows.filter((item) => item.id !== id));
        setOpenSuccess(true);
      })
      .catch(() => {
        setOpenError(true);
      })
    }
  };

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleClose = () => {
    setOpenSuccess(false);
    setOpenError(false);
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
            rows={rows}
            columns={columns.concat(actionColumn)}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
        />
        <Snackbar open={openSuccess} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
              Entity successfully deleted!
            </Alert>
        </Snackbar>
        <Snackbar open={openError} autoHideDuration={5000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: '100%' }}>
              Cannot delete entity because it is rented!
            </Alert>
        </Snackbar>
    </div>
  );
};

export default EntityTable;