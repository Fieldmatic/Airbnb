import * as React from 'react';
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
import "./reviewTable.scss"
import ReviewService from '../../../../services/ReviewService';


function Row(props) {
    const { row, func } = props;
    const [open, setOpen] = React.useState(false);

    const handleApprove = () => {
        ReviewService.approveReview(row.id);
        func([row.id, "Review successfully approved."]);
    }

    const handleDeny = () => {
        ReviewService.denyReview(row.id);
        func([row.id, "Review successfully denied."]);
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
          <TableCell>{row.bookableName}</TableCell>  
          <TableCell className='cellAction'>
              <Button variant="outlined" color="error" onClick={handleDeny}>Deny</Button>
              <Button variant="contained" color="success" onClick={handleApprove}>Approve</Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Comment for owner/instructor
                </Typography>
                <div>{'"' + row.ownerComment + '"'}</div>
                <br /><br />
                <Typography variant="h6" gutterBottom component="div">
                  Comment for {row.bookableName}
                </Typography>
                <div>{'"' + row.bookableComment + '"'}</div>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
}

export default function ReviewTable() {

    const [alertText, setAlertText] = React.useState("");
    const [showAlert, setShowAlert] = React.useState(false);

    const [rows, setRows] = React.useState([ ]);

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
        ReviewService.getAllReviews().then((response) => {
            setRows(response.data)
        }).catch(err => {
            if (err.response.status == 403) {
              showMessage(["You must change your password first and then login again!", false])
            }
        })
    }, [])

    const getStateFromRow = (data) => {
      setShowAlert(true);
      setAlertText(data[1]);
      setRows(rows.filter((item) => item.id !== data[0]));
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
                        <TableCell className="datatableHeader">Entity</TableCell>
                        <TableCell className="datatableHeader">Options</TableCell>
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
