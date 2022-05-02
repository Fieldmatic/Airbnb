import React from 'react'
import './Cottage.css'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";

export default function Cottage() {
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

  const [files, setFiles] = React.useState([]);

  const [imageSrc, setImageSrc] = React.useState(undefined);

  const updateFiles = (incommingFiles) => {
    console.log("incomming files", incommingFiles);
    setFiles(incommingFiles);
  };

  const onDelete = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };

  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  const handleClean = (files) => {
    console.log("list cleaned", files);
  };

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
    let data = new FormData()
    const json = JSON.stringify(formData)
    const cottageJson = new Blob([json], {
      type: 'application/json'
    });
    data.append("cottage", cottageJson)
    files.map((file) => {
      data.append("files", file.file)
    })
    CottageService.addCottage(data)
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
        <Dropzone
      style={{ minWidth: "100%", margin:"20px", fontSize:"18px" }}
      onChange={updateFiles}
      minHeight="10%"
      onClean={handleClean}
      value={files}
      maxFiles={10}
      header={true}
      maxFileSize={5000000}
    >
      {files.map((file) => (
        <FileItem
          {...file}
          key={file.id}
          onDelete={onDelete}
          onSee={handleSee}
          resultOnTooltip
          preview
          info
          hd
        />
      ))}
      <FullScreenPreview
        imgSource={imageSrc}
        openImage={imageSrc}
        onClose={(e) => handleSee(undefined)}
      />
    </Dropzone>
        <button className="form--submit">Submit</button>
      </form>
    </div>
  )
}
