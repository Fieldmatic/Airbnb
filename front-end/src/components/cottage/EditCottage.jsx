import React from 'react'
import './Cottage.css'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { useParams } from 'react-router-dom'

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
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className='form--header'> {formData.name}</h1>
        <input
          className="form--input"
          type = "text"
          placeholder = "Name"
          onChange = {handleChange}
          name = "name"
          value = {formData.name}   
        />
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
        <input 
          className="form--input"
          type = "text"
          placeholder = "Daily rate"
          onChange = {handleChange}
          name = "dailyRate"
          value = {formData.dailyRate}          
        />
        <input 
          className="form--input"
          type = "text"
          placeholder = "Hourly rate"
          onChange = {handleChange}
          name = "hourlyRate"
          value = {formData.hourlyRate}          
        />
        <textarea 
          className="form--input-area"
          placeholder = "Promotional description"
          onChange = {handleChange}
          value = {formData.promotionalDescription}
          name = "promotionalDescription"
        />
        <textarea 
          className="form--input-area"
          placeholder = "Rules"
          onChange = {handleChange}
          value = {formData.rules}
          name = "rules"
        />
        <textarea 
          className="form--input-area"
          placeholder = "Cancellation conditions"
          onChange = {handleChange}
          value = {formData.cancellationConditions}
          name = "cancellationConditions"
        />
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
        <button className="form--save">Save</button>
      </form>
    </div>
  )
}
