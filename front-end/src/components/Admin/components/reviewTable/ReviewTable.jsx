import * as React from 'react';
import ReportService from "../../../../services/ReportService"
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
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { pink } from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import "./reviewTable.scss"


function Row(props) {
    const { row, registration, func } = props;
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
        if (registration) {
            AdminService.registrateUser(row.user.id, row.id, confirmation, rejectingMessage)
        }
        else {
            AdminService.deleteProfile(row.user.id, row.id, confirmation, rejectingMessage)
        }
        setOpenDialog(false);
        func([false, row.id]);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleReply = () => {
        setConfirmation("true");
        setMessage("");
        // let accpetingMessage = new FormData();
        // const dataJson = dataToJson();
        // accpetingMessage.append("message", dataJson)
        // if (registration) {
        //     AdminService.registrateUser(row.user.id, row.id, confirmation, accpetingMessage)
        // }
        // else {
        //     AdminService.deleteProfile(row.user.id, row.id, confirmation, accpetingMessage)
        // }
        func([true, row.id]);
    }

    const handleDeny = () => {
        setConfirmation("false");
        setOpenDialog(true);
    }

    function dataToJson() {
        const json = JSON.stringify(message);
        // const dataJson = new Blob([json], {
        //     type: 'application/json'
        // });
        return json;
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
            {row.id}
          </TableCell>
          <TableCell>{row.client}</TableCell>
          <TableCell>{row.showedUp}</TableCell>
          <TableCell>{row.type}</TableCell>
          <TableCell className='cellAction'>
              <Button variant="contained" color="success" onClick={handleReply}>Reply</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Comment
                </Typography>
                <div>{row.comment}</div>
                <div> Give penalty
                    <Checkbox
                        {...label}
                        defaultChecked
                        sx={{
                            color: pink[800],
                            '&.Mui-checked': {
                            color: pink[600],
                            },
                        }}
                    />
                </div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Deletion rejection</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your reason for rejecting
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

export default function Datatable(props) {

    const alertText = {
        accept: props.registration ? "User successfully registrated!" : "Account successfully deleted!",
        deny: props.registration ? "Request for account registration denied!" : "Request for account deletion denied!"
    }

    const [accept, setAccept] = React.useState(true);
    const [showAlert, setShowAlert] = React.useState(false);

    const [rows, setRows] = React.useState([])

    React.useEffect(() => {
        ReportService.getAllReports().then((response) => {
            setRows(response.data)
        })
    }, []) // props.registration

    const getStateFromRow = (data) => {
      setAccept(data[0]);
      setShowAlert(true);
      setRows(rows.filter((item) => item.id !== data[1]));
      setTimeout(() => {
          setShowAlert(false);
      }, 2500)
    }

    return (
        <div>
            <Collapse in={showAlert}>
                <Alert variant="filled" severity="success">{accept ? alertText.accept : alertText.deny}</Alert>
            </Collapse>
            
            <TableContainer component={Paper} className="datatable">
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell className="datatableHeader">ID</TableCell>
                        <TableCell className="datatableHeader">Client</TableCell>
                        <TableCell className="datatableHeader">Client showed up</TableCell>
                        <TableCell className="datatableHeader">Report type</TableCell>
                        <TableCell className="datatableHeader">Option</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <Row key={row.id} row={row} registration={props?.registration} func={getStateFromRow}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}