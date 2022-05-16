import React from 'react'
import './SearchPopup.css'

export default function SearchPopup(props) {

    console.log(props.trigger)

    return (props.trigger) ? (
        <div className='searchPopup'>
          <h3> Alo </h3>
          
        </div>
      ) : "";
}
