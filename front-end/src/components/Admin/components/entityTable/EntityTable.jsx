import "./entityTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AdventureService from "../../../../services/AdventureService"
import BoatService from "../../../../services/BoatService"
import CottageService from "../../../../services/CottageService"
import Collapse from '@mui/material/Collapse';
import {useNavigate, Navigate} from "react-router-dom";


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 230 },
    { field: 'address', 
      headerName: 'Address', 
      width: 300,
      valueGetter: (params) =>
      `${params.row.address.state || ''}, ${params.row.address.city || ''}, ${params.row.address.street || ''}`
    },
    {
      field: 'capacity',
      headerName: 'Capacity',
      type: 'number',
      width: 100,
    },
    {
      field: 'rating',
      headerName: 'Rating',
      type: 'number',
      width: 100,
    },
    {
      field: 'promotionalDescription',
      headerName: 'Promo description',
      description: 'This column is not sortable.',
      sortable: false,
      width: 580,
    },
  ];
  
  

const EntityTable = (props) => {
  
  const [rows, setRows] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState({
    success: undefined,
    text: ""
  })

  const [redirect, setRedirect] = useState("");

  const showMessage = (returnMessage) => {
    setShowAlert(true);
    setMessage(() => {
        return {
            success: returnMessage[1],
            text: returnMessage[0]
        }
    })
    setTimeout(() => {
        setShowAlert(false);
    }, 2500)
  }

  useEffect(() => {
      if (props.entity === "adventure") {
          AdventureService.getAllAdventuresAdmin().then((response) => {
              setRows(response.data);
          }).catch(err => {
            if (err.response.status == 403)
              showMessage(["You must change your password first and then login again!", false])
          })
      }else if(props.entity === "cottage") {
          CottageService.getAllCottagesAdmin().then((response) => {
              setRows(response.data);
          }).catch(err => {
            if (err.response.status == 403)
              showMessage(["You must change your password first and then login again!", false])
          })
      }else {
          BoatService.getAllBoatsAdmin().then((response) => {
              setRows(response.data);
          }).catch(err => {
            if (err.response.status == 403)
              showMessage(["You must change your password first and then login again!", false])
          })
      }
  }, [props.entity])

  const handleDelete = (id) => {
    if (props.entity === "adventure") {
      AdventureService.deleteAdventure(id)
      .then(() => {
        setRows(rows.filter((item) => item.id !== id));
        setOpenSuccess(true);
      })
      .catch(() => {
        setOpenError(true);
      })
    }else if(props.entity === "cottage") {
      CottageService.deleteCottage(id)
      .then(() => {
        setRows(rows.filter((item) => item.id !== id));
        setOpenSuccess(true);
      })
      .catch(() => {
        setOpenError(true);
      })
    }else {
      BoatService.deleteBoat(id)
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

  function redirectToEntityDetails(id) {
    let heart = "#A8A8A8"
    heart = heart.replace("#", "")
    setRedirect(`/bookableDetails/${id}&${props.entity}&${"admin"}&${heart}`)
  }

  if (redirect) {
    return (
        <Navigate to={redirect}/>
    )
  }

  const actionColumn = [
    {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            return (
            <div className="cellActions">
                <div 
                className="viewButton"
                onClick={() => redirectToEntityDetails(params.row.id)}
                >
                  View
                </div>
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
    <div>
      <Collapse in={showAlert}>
          {message.success ? 
              <Alert variant="filled" severity="success">{message.text}</Alert> :
              <Alert variant="filled" severity="error">{message.text}</Alert>
          }           
      </Collapse>
    
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
    </div>
  );
};

export default EntityTable;