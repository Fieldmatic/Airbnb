import React from 'react'
import './Popup.css'

export default function Popup(props) {
  //const [reason, setReason] = React.useState(props.reason)

  return (props.trigger) ? (
    <div className='popup'>
      <h3 className='popup-header'> {props.title} </h3>
      <textarea className='textAreaReason'
        value={props.reason}
        placeholder={props.placeHolder}
        onChange={props.popupChange}
        name="comments"
      />
      <div className='popup--buttons'> 
        <button className='close-btn' onClick={() => {
          props.handleChange()
          props.setTrigger(false)}}>{props.leftButtonContent}
        </button>
        <button className='saveReasonButton' onClick={() => {
          props.handleChange()
          props.saveReason()
          props.setTrigger(false)}}> {props.rightButtonContent} </button>
          {props.children}
      </div>  
    </div>
  ) : "";
}
