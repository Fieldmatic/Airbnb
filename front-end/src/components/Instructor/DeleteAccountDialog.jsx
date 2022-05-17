import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AdminService from "../../services/AdminService"

export default function DeletionAccountDialog(props) {
  const [open, setOpen] = React.useState(false);

  const [deletionData, setDeletionData] = React.useState({
      reason: "",
      password: ""
  });

  const handleDataChange = (event) => {
    const {name, value} = event.target;
    setDeletionData(prevData => ({
        ...prevData,
        [name]: value
    }));
}

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    let data = new FormData()
    const dataJson = dataToJson();
    data.append("data", dataJson)
    AdminService.deleteInstructor(props.id, data)
    .then(response => {
        alert(response.data);
    })
    .catch(response => {
        alert(response.data);
    })
    setOpen(false);
  }

  function dataToJson() {
    const json = JSON.stringify(deletionData);
    const dataJson = new Blob([json], {
        type: 'application/json'
    });
    return dataJson;
  }

  return (
    <div>
      <button className="form--submit" onClick={handleClickOpen} type="button">
        Delete account
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete account, please enter your reason and confirm with password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Reason for deleting"
            type="text"
            fullWidth
            variant="standard"
            value={deletionData.reason}
            name="reason"
            onChange={handleDataChange}
          />
          <TextField
            margin="dense"
            id="password"
            label="Confirm with password"
            type="password"
            fullWidth
            variant="standard"
            value={deletionData.password}
            name="password"
            onChange={handleDataChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
