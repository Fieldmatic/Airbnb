import * as React from 'react';
import AdminService from "../../../../services/AdminService"
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./datatable.scss"

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
  };
}



const rows = [
  createData('bane-gg@hotmail.com', 'Miladin', 'Miladinovic', "milance", 4.0, 3.99),
  createData('bane-gg@hotmail.com', 237, 9.0, 37, 4.3, 4.99),
  createData('bane-gg@hotmail.com', 262, 16.0, 24, 6.0, 3.79),
  createData('bane-gg@hotmail.com', 305, 3.7, 67, 4.3, 2.5),
  createData('bane-gg@hotmail.com', 356, 16.0, 49, 3.9, 1.5),
];

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [message, setMessage] = React.useState("");   
    const [confirmation, setConfirmation] = React.useState("true");

    const handleMessageChange = (event) => {
        const {value} = event.target;
        setMessage(value);
    }

    const handleAcceptMessage = () => {
        if(message === "") {
            return;
        }
        let rejectingMessage = new FormData()
        const dataJson = dataToJson();
        rejectingMessage.append("message", dataJson)
        AdminService.deleteProfile(props.user.id, props.id, confirmation, rejectingMessage)
        alert("Request for account deletion denied!")
        window.location.reload();
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleAccept = () => {
        setConfirmation("true");
        setMessage("");
        let accpetingMessage = new FormData();
        const dataJson = dataToJson();
        accpetingMessage.append("message", dataJson)
        AdminService.deleteProfile(props.user.id, props.id, confirmation, accpetingMessage)
        alert("Account successfully deleted!")
        window.location.reload();
    }

    const handleDeny = () => {
        setConfirmation("false");
        setOpenDialog(true);
    }

    function dataToJson() {
        const json = JSON.stringify(message);
        const dataJson = new Blob([json], {
            type: 'application/json'
        });
        return dataJson;
    }
  
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell>{row.calories}</TableCell>
          <TableCell>{row.fat}</TableCell>
          <TableCell>{row.carbs}</TableCell>
          <TableCell className='cellAction'>
              <Button variant="outlined" color="error" onClick={handleDeny}>Deny</Button>
              <Button variant="contained" color="success" onClick={handleAccept}>Accept</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Explanation
                </Typography>
                <div>User registration explanation</div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Deletion rejection</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your reasons for rejecting account deletion
                </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="message"
                label="Reason for rejecting"
                type="text"
                fullWidth
                variant="standard"
                value={message}
                name="reason"
                onChange={handleMessageChange}
            />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAcceptMessage}>Accept</Button>
            </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}

export default function Datatable() {

  return (
    <TableContainer component={Paper} className="datatable">
        <Table>
            <TableHead>
            <TableRow>
                <TableCell />
                <TableCell className="datatableHeader">E-mail</TableCell>
                <TableCell className="datatableHeader">Name</TableCell>
                <TableCell className="datatableHeader">Surname</TableCell>
                <TableCell className="datatableHeader">Username</TableCell>
                <TableCell className="datatableHeader">Option</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <Row key={row.name} row={row} />
            ))}
            </TableBody>
        </Table>
    </TableContainer>
  );
}
