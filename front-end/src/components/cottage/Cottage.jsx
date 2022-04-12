import React from 'react'
import './Cottage.css'
import CottageService from '../../services/CottageService'

export default function Cottage() {
  const [formData, setFormData] = React.useState (
      {
        name : "",
        address: "",
        promotionalDescription : "",
        rules : "",
        hourlyRate : "",
        dailyRate : "",
        cancellationConditions: ""

      }

  )

  function handleChange(event) {
    const {name, value} = event.target
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    CottageService.addCottage(formData)
    console.log(formData)
  }

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className='form--header'>Vikendica</h1>
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
          placeholder = "Address"
          onChange = {handleChange}
          name = "address"
          value = {formData.address}          
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
          placeholder = "PromotionalDescription"
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
        <button className="form--submit">Submit</button>
      </form>
    </div>
  )
}
