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
import "./complaintTable.scss"


function Row(props) {
    const { row, func } = props;
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [penalty, setPenalty] = React.useState(false);

    const handleMessageChange = (event) => {
        const {value} = event.target;
        setMessage(value);
    }

    const handlePenaltyChange = (event) => {
        setPenalty(current => !current);
    }

    const handleAcceptMessage = () => {
        if(message === "") {
            return;
        }
        ReportService.reviewReport(row.id, penalty, message);
        setOpenDialog(false);
        func(row.id);
    }

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleReply = () => {
        setOpenDialog(true);
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
          <TableCell>{row.ownerUsername}</TableCell>
          <TableCell>{row.clientUsername}</TableCell>
          <TableCell>
              <div className={"cellWithStatus " + (row.showedUp ? "active" : "passive")}>
                {row.showedUp ? "YES" : "NO"}
              </div>
          </TableCell>    
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
                <div> Give penalty
                    <Checkbox
                        defaultChecked={!row.showedUp}
                        onChange={handlePenaltyChange}
                        value={penalty}
                        sx={{
                            color: '#FF5A5F',
                            '&.Mui-checked': {
                            color: '#FF5A5F',
                            },
                        }}
                    />
                </div>
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

export default function ComplaintTable(props) {

    const alertText = "Email with your message successfully sent.";
    const [showAlert, setShowAlert] = React.useState(false);

    const [rows, setRows] = React.useState([]);

    //{id: 1, clientUsername: "pero", showedUp: false, comment: "Zahtevam da\
    // se korisnku da penal jer je bezobrazannnn!", ownerUsername: "banz"},
    // {id: 2, clientUsername: "djuro", showedUp: true, comment: "Svaka caastt!",
    //  ownerUsername: "banz"},

    const [showMessageAlert, setShowMessageAlert] = React.useState(false);
    const [message, setMessage] = React.useState({
        success: undefined,
        text: ""
    })

    const showMessage = (returnMessage) => {
        setShowMessageAlert(true);
        setMessage(() => {
            return {
                success: returnMessage[1],
                text: returnMessage[0]
            }
        })
        setTimeout(() => {
            setShowMessageAlert(false);
        }, 2500)
    }

    React.useEffect(() => {
        ReportService.getAllReports().then((response) => {
            setRows(response.data)
        }).catch(err => {
            if (err.response.status == 403) {
              showMessage(["You must change your password first and then login again!", false])
            }
        })
    }, [])

    const getStateFromRow = (data) => {
      setShowAlert(true);
      setRows(rows.filter((item) => item.id !== data));
      setTimeout(() => {
          setShowAlert(false);
      }, 2500)
    }

    return (
        <div>
            <Collapse in={showMessageAlert}>
                {message.success ? 
                    <Alert variant="filled" severity="success">{message.text}</Alert> :
                    <Alert variant="filled" severity="error">{message.text}</Alert>
                }           
            </Collapse>
            
            <Collapse in={showAlert}>
                <Alert variant="filled" severity="success">{alertText}</Alert>
            </Collapse>
            
            <TableContainer component={Paper} className="datatable">
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell className="datatableHeader">ID</TableCell>
                        <TableCell className="datatableHeader">Owner</TableCell>
                        <TableCell className="datatableHeader">Client</TableCell>
                        <TableCell className="datatableHeader">Client showed up</TableCell>
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
