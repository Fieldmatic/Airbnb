import React from 'react'
import AdventureService from '../../services/AdventureService'
import { useParams } from 'react-router-dom'
import Header from '../../Header'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import './Adventure.css';
import { TimePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { LocalizationProvider } from '@mui/lab';
import { TextField } from '@mui/material';
import moment from 'moment'


export default function UpdateAdventureForm(props) {
    const [formData, setFormData] = React.useState({
        name: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
        },
        promoDescription: "",
        capacity: "",
        rules: "",
        equipment: "",
        cancellationConditions: "",
        hourlyRate: "",
        inputPictures: "",
        startDateTime: "",
        endDateTime: ""
    });

    let {id} = useParams();

    React.useEffect(() => {
        AdventureService.getAdventure(id).then((result) => {
            let adventure = result.data;
            console.log(adventure)
            setFormData({
                name: adventure.name || "", 
                address: adventure.address || "",
                promoDescription: adventure.promoDescription || "",
                rules: adventure.rules || "",
                hourlyRate: adventure.hourlyRate || "",
                dailyRate: adventure.dailyRate || "",
                cancellationConditions: adventure.cancellationConditions || "",
                capacity: adventure.capacity || "",
                equipment: adventure.equipment.toString() || ""
            })
        })
      },[])

    var errorMessages = {
        nameError: "",
        addressError: "",
        capacityError: "",
        hourlyRateError: ""
    };

    const errors = {
        name: "You must enter adventure name",
        address: "You must enter address",
        number: "This field must be a number"
      };

    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection'
    }
    
    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(event){
        event.preventDefault();         
        let data = new FormData()
        const adventureJson = adventureToJson();
        console.log(adventureJson)
        data.append("adventure", adventureJson)
        AdventureService.updateAdventure(data, id)
        .then(response => {
            alert(response.data);
            window.location.reload();
        });
        
    }

    function handleAddressChange(event) {
        const {name, value} = event.target
        const address = formData.address
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                address: {
                    ...address,
                    [name]:value
                }
            }
        })
    }

    function adventureToJson() {
        let formDataCopy = { ...formData };
        const offset = startDate.getTimezoneOffset();
        let startDateTemp = new Date(startDate.getTime() - (offset*60*1000))
        let endDateTemp = new Date(endDate.getTime() - (offset*60*1000))

        formDataCopy.equipment = formDataCopy.equipment.trim().split(",");
        formDataCopy.startDateTime = startDateTemp.toISOString().split('T')[0] + "T" + startTime.toString().split(" ")[4];
        formDataCopy.endDateTime = endDateTemp.toISOString().split('T')[0] + "T" + endTime.toString().split(" ")[4];
        
        console.log(formDataCopy);
        const json = JSON.stringify(formDataCopy);
        const adventureJson = new Blob([json], {
            type: 'application/json'
        });
        return adventureJson;
    }

    const handleDateChange = (ranges) => {
        setStartDate(ranges.selection.startDate);
        setEndDate(ranges.selection.endDate);
    }

    const [pickDate, setPickDate] = React.useState(false);

    const pickDateClicked = (event) => {
        event.preventDefault();
        setPickDate(true);
    }
    
    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <h2 className="form--title">Update adventure</h2>
                    <input 
                        type="text"
                        placeholder="Name"
                        className="form--input"
                        name="name"
                        onChange={handleChange}
                        value={formData.name}
                    />
                    {/* {renderErrorMessage(errorMessages.nameError)} */}
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "State"
                        onChange = {handleAddressChange}
                        name = "state"
                        value = {formData.address.state}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "City"
                        onChange = {handleAddressChange}
                        name = "city"
                        value = {formData.address.city}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "Zip"
                        onChange = {handleAddressChange}
                        name = "zipCode"
                        value = {formData.address.zipCode}          
                    />
                    <input 
                        className="form--input"
                        type = "text"
                        placeholder = "Street"
                        onChange = {handleAddressChange}
                        name = "street"
                        value = {formData.address.street}          
                    />
                    {/* {renderErrorMessage(errorMessages.addressError)} */}
                    <input 
                        type="text" 
                        placeholder="Capacity"
                        className="form--input"
                        name="capacity"
                        onChange={handleChange}
                        value={formData.capacity}
                    />
                    {/* {renderErrorMessage(errorMessages.capacityError)} */}
                    <input 
                        type="text" 
                        placeholder="Hourly rate"
                        className="form--input"
                        name="hourlyRate"
                        onChange={handleChange}
                        value={formData.hourlyRate}
                    />
                    {/* {renderErrorMessage(errorMessages.hourlyRateError)} */}
                    <textarea 
                        placeholder="Promo description"
                        className="form--input-area"
                        name="promoDescription"
                        onChange={handleChange}
                        value={formData.promoDescription}
                    />
                    <textarea 
                        placeholder="Behaviour rules"
                        className="form--input-area"
                        name="rules"
                        onChange={handleChange}
                        value={formData.rules}
                    />
                    <textarea 
                        placeholder="Equipment(separate with ',')"
                        className="form--input-area"
                        name="equipment"
                        onChange={handleChange}
                        value={formData.equipment}
                    />
                    <textarea 
                        placeholder="Cancelation conditions"
                        className="form--input-area"
                        name="cancellationConditions"
                        onChange={handleChange}
                        value={formData.cancellationConditions}
                    />
                    <button className="form--submit pick-button" onClick={pickDateClicked}>Pick date</button>
                    {pickDate && 
                    <DateRangePicker 
                        ranges={[selectionRange]}
                        minDate={new Date()}
                        rangeColors={["#FD5B61"]}
                        onChange={handleDateChange}
                    />}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker 
                            label="Start time"
                            onChange={(newValue) => {
                                setStartTime(newValue);
                                console.log(newValue.toString().split(" ")[4]);
                            }} 
                            value={startTime}
                            renderInput={(params) => <TextField {...params} />}
                            minTime={startDate}
                            ampm={false}
                        />
                    </LocalizationProvider>
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker 
                            label="End time"
                            onChange={(newValue) => {
                                setEndTime(newValue);
                            }}
                            value={endTime}
                            renderInput={(params) => <TextField {...params} />}
                            minTime={startTime}
                            ampm={false}
                        />
                    </LocalizationProvider>
                    <br />
                    <button
                        className="form--submit"
                    >
                        Update adventure
                    </button>
                </form>
            </div>
        </div>
        
    )
}