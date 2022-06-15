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
import Checkbox from '@mui/material/Checkbox';
import "./reviewTable.scss"


function Row(props) {
    const { row, func } = props;
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [message, setMessage] = React.useState("");   

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
        // if (registration) {
        //     AdminService.registrateUser(row.user.id, row.id, confirmation, rejectingMessage)
        // }
        // else {
        //     AdminService.deleteProfile(row.user.id, row.id, confirmation, rejectingMessage)
        // }
        setOpenDialog(false);
        func(row.id);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleReply = () => {
        setOpenDialog(true);
    }

    function dataToJson() {
        const json = JSON.stringify(message);
        // const dataJson = new Blob([json], {
        //     type: 'application/json'
        // });
        return json;
    }

    let colorType;
    if (row.type === "REQUEST_PENALTY") colorType = "passive";
    else if (row.type === "COMMEND") colorType = "active";
    else colorType = "pending";
  
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
          <TableCell className='clientShowedUp'>{row.showedUp ? "YES" : "NO"}</TableCell>
          <TableCell><div className={"cellWithStatus " + colorType}>
              {row.type.replace("_", " ")}
          </div></TableCell>
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
                <div>{'"' + row.comment + '"'}</div>
                {row.type === "REQUEST_PENALTY" && 
                <div> Give penalty
                    <Checkbox
                        defaultChecked={!row.showedUp}
                        sx={{
                            color: '#FF5A5F',
                            '&.Mui-checked': {
                            color: '#FF5A5F',
                            },
                        }}
                    />
                </div>
                }           
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Answer</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter your answer
                </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="message"
                label="Answer"
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
                <Button onClick={handleAcceptMessage}>Send</Button>
            </DialogActions>
        </Dialog>
      </React.Fragment>
    );
}

export default function ReviewTable() {

    const alertText = "Email with your message successfully sent.";
    const [showAlert, setShowAlert] = React.useState(false);

    const [rows, setRows] = React.useState([
        {id: 1, client: "pero", showedUp: false, type: "REQUEST_PENALTY", comment: "Zahtevam da\
        se korisnku da penal jer je bezobrazannnn!"},
        {id: 2, client: "djuro", showedUp: true, type: "COMMEND", comment: "Svaka caastt!"},
    ])

    // React.useEffect(() => {
    //     ReportService.getAllReports().then((response) => {
    //         setRows(response.data)
    //     })
    // }, []) // props.registration

    const getStateFromRow = (data) => {
      setShowAlert(true);
      setRows(rows.filter((item) => item.id !== data));
      setTimeout(() => {
          setShowAlert(false);
      }, 2500)
    }

    return (
        <div>
            <Collapse in={showAlert}>
                <Alert variant="filled" severity="success">{alertText}</Alert>
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
                        <Row key={row.id} row={row} func={getStateFromRow}/>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
