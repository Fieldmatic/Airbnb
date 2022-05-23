import React from 'react'
import './EditCottage.css'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { useParams } from 'react-router-dom'
import Header from "../../Header";
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';

export default function EditCottage(props) {
  let {id} = useParams();
  const [formData, setFormData] = React.useState (
      {
        name : "",
        address: {
          street: "",
          city: "",
          state: "",
          zipCode: ""
        },
        promotionalDescription : "",
        rules : "",
        hourlyRate : "",
        dailyRate : "",
        cancellationConditions: "",
        singleRooms : 0,
        doubleRooms : 0,
        tripleRooms : 0,
        quadRooms : 0
      }
  )
    React.useEffect(() => {
      CottageService.getCottage(id).then((result) => {
          let cottage = result.data;
          setFormData({
              name : cottage.name, 
              address : cottage.address,
              promotionalDescription : cottage.promotionalDescription,
              rules : cottage.rules,
              hourlyRate : cottage.hourlyRate,
              dailyRate : cottage.dailyRate,
              cancellationConditions : cottage.cancellationConditions,
              singleRooms : cottage.singleRooms,
              doubleRooms : cottage.doubleRooms,
              tripleRooms : cottage.tripleRooms,
              quadRooms : cottage.quadRooms
          })
      })
    },[])
    

  function handleChange(event) {
    const {name, value} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
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

  function handleRoomChange(name, value) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    CottageService.updateCottage(formData, id)
    .then(response => {
      alert(response.data);
      window.location.reload();
    });
  }

  return (
    <div>
      <Header />
      <div className='edit-cottage-container'>
        <div className="edit-cottage-form-container">
          <form className="edit-cottage-form" onSubmit={handleSubmit}>
            <h1 className='edit-cottage-form--header'> {formData.name}</h1>
            <div className='form--pair'>
                <TextField
                  sx={muiStyles.style} 
                  label = "Name"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  type = "text"           
                  onChange = {handleChange}
                  name = "name"
                  value = {formData.name}   
                />
               <TextField
                  sx={muiStyles.style} 
                  label = "Cancellation conditions"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  placeholder = "Cancellation conditions"
                  onChange = {handleChange}
                  value = {formData.cancellationConditions}
                  name = "cancellationConditions"
                />
            </div>
            <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "Country"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "state"
                  value = {formData.address.state}          
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Zip"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "zipCode"
                  value = {formData.address.zipCode}          
              />
          </div>
          <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "City"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "city"
                  value = {formData.address.city}          
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Street"
                  variant='outlined'
                  id="standard-basic"
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "street"
                  value = {formData.address.street}          
              />
          </div>
          <div className='form--pair'>
            <TextField
              sx={muiStyles.style} 
              label = "Daily rate"
              variant='outlined'
              id="standard-basic" 
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "dailyRate"
              value = {formData.dailyRate}          
            />
            <TextField
              sx={muiStyles.style} 
              label = "Hourly rate"
              variant='outlined'
              id="standard-basic"
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "hourlyRate"
              value = {formData.hourlyRate}          
            />
          </div>
          <div className='form--pair'>
              <TextField
                  id="outlined-multiline-flexible"
                  label="Promotional description"
                  className="form--input-area"
                  sx = {muiStyles.style}
                  multiline
                  maxRows={6}
                  name = "promotionalDescription"
                  value={formData.promotionalDescription}
                  onChange={handleChange}
              />
          </div>
          <div className='form--pair'>
              <TextField
                  id="outlined-multiline-flexible"
                  label="Rules"
                  className="form--input-area"
                  sx = {muiStyles.style}
                  multiline
                  maxRows={6}
                  name = "rules"
                  value={formData.rules}
                  onChange={handleChange}
              />
          </div>
          <div className='form--bedrooms'>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Single rooms: </label>  
              <Counter name = "singleRooms" value = {formData.singleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
            <label className='bedRoom--label'>Double rooms: </label>  
              <Counter name = "doubleRooms" value = {formData.doubleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Triple rooms: </label>  
              <Counter name = "tripleRooms" value = {formData.tripleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Quad rooms: </label>  
              <Counter name = "quadRooms" value = {formData.quadRooms} handleChange = {handleRoomChange}/>
            </div>
          </div>
          <div className='form--pair'>
            <button className="edit-cottage-form--save">Save</button>
          </div>
          </form>
        </div>      
      </div>
    </div>
  )
}
