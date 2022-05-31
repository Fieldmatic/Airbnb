import React, { useEffect } from 'react'
import './FilterPopup.css'
import CloseIcon from '@mui/icons-material/Close';

export default function SearchPopup(props) {
  const [priceValue, setPriceValue] = React.useState(0)
  const [rating, setRating] = React.useState("anyRate")
  const [bedroomNum, setBedroomNum] = React.useState("anyRooms")
  const [bedsNum, setBedsNum] = React.useState("anyBeds")
  const [maxSpeed, setMaxSpeed] = React.useState("anyMaxSpeed")
  const [capacity, setCapacity] = React.useState("anyCapacity")
  const [boatType, setBoatType] = React.useState([])

  var bedroomButtons = [];
  for (var i = 1; i <= 7; i++) {
    bedroomButtons.push(<button id = {`room${i}`} onClick={changeBedroomsNum}>{i}</button>);
  }

  var bedsButtons = [];
  for (var i = 1; i <= 4; i++) {
    bedsButtons.push(<button id = {`bed${i}`} onClick={changeBedsNum}>{i}</button>);
  }

  var ratingButtons = [];
  for (var i = 5; i < 10; i++) {
    ratingButtons.push(<button id = {`${i}-${i+1}`} onClick={changeRating}>{i}-{i+1}</button>);
  }

  function updateTextInput() {
    setPriceValue(document.getElementById('selectedRange').value)
  }

  function changeRating(event) {
    event.preventDefault()
    undoButtonColor(rating)
    const {innerText} = event.target
    let newRating = innerText === "Any" ? "anyRate" : innerText
    setRating(newRating)
  }

  function changeBedroomsNum(event) {
    event.preventDefault()
    undoButtonColor(bedroomNum)
    const {innerText} = event.target
    let newBedroomNum = innerText === "Any" ? "anyRooms" : 'room' + innerText
    setBedroomNum(newBedroomNum)
  }

  function changeBedsNum(event) {
    event.preventDefault()
    undoButtonColor(bedsNum)
    const {innerText} = event.target
    let newBedsNum = innerText === "Any" ? "anyBeds" : 'bed' + innerText
    setBedsNum(newBedsNum)
  }

  function changeMaxSpeed(event) {
    event.preventDefault()
    undoButtonColor(maxSpeed)
    const {innerText} = event.target
    let newMaxSpeed = innerText === "Any" ? "anyMaxSpeed" : innerText
    setMaxSpeed(newMaxSpeed)
  }

  function changeCapacity(event) {
    event.preventDefault()
    undoButtonColor(capacity)
    const {innerText} = event.target
    let newCapacity = innerText === "Any" ? "anyCapacity" : innerText
    setCapacity(newCapacity)
  }

   function changeBoatType(event) {
     event.preventDefault()
     const {name, checked} = event.target;
     document.getElementsByName(name).selected = true;
     boatType.push(name)

   }

  function undoButtonColor(elementType) {
    let element = document.getElementById(elementType)
    element.style.backgroundColor = "white";
    element.style.color = "black";
  }

  React.useEffect(() => {
    let elements;
    if (props.value === "cottage") {
      elements = [document.getElementById(rating), document.getElementById(bedroomNum), document.getElementById(bedsNum)]
    } else if (props.value === "boat") {
      elements = [document.getElementById(rating), document.getElementById(maxSpeed), document.getElementById(capacity)]

    } else {
      //avanture
      elements = [document.getElementById(rating), document.getElementById(capacity)]
    }
    for (i = 0; i < elements.length; i++) {
      elements[i].style.backgroundColor = "black";
      elements[i].style.color = "white";
  }
  //dodaj ovde obavezno u listu
  }, [rating, bedroomNum, bedsNum, maxSpeed, capacity]);


  function showResults(event) {
    event.preventDefault()
    if (rating != "anyRate") {
      rating.split("-")
      setRating([rating[0], rating[2]])
    }
    if (capacity != "anyCapacity" && capacity != "7+") {
      capacity.split("-")
      setCapacity([capacity[0], capacity[2]])
    }
    props.getFilters({
      priceValue: priceValue,
      rating: rating,
      bedroomNum: bedroomNum.replace("room", ""),
      bedsNum: bedsNum.replace("bed", ""),
      maxSpeed: maxSpeed,
      capacity: capacity,
      boatType: boatType
    })
    props.setTrigger(false)
  }

  function deleteFilters(event) {
    event.preventDefault()
    setPriceValue(0)
    setBedroomNum("anyRooms")
    setBedsNum("anyBeds")
    setRating("anyRate")
    setMaxSpeed("anyMaxSpeed")
    setCapacity("anyCapacity")
    props.setTrigger(false)
  }

    return (props.trigger) ? (
        <div className='searchPopup'>
          <form>
           <div className="filterPopupHeader">
              <CloseIcon className='closeIcon' onClick={deleteFilters}/>
              <h4> Filters</h4>
           </div>
           <div className="param">
             <div className="parameters">
               <h3>Price range</h3>
               <div className="choosenRange">
                <span>Choosen range: </span>
                <label>0-{priceValue}</label>
               </div>
                <div className="priceField">
                  <div className="valueLeft">0</div>
                  <input type="range" min="0" max={props.maxPrice} value={priceValue} steps="1" onChange={updateTextInput} id="selectedRange"></input>
                  <div className="valueRight">{props.maxPrice}</div>
                  </div>
              </div>
              <div className="parameters">
                <h3>Rating</h3>
                <div className="paramButtons">
                <button id="anyRate" onClick={changeRating}>Any</button>
                {ratingButtons}
               </div>
              </div>
             {props.value === "cottage" && 
              <div className="parameters">
                <h3>Rooms and beds</h3>
                <span>Bedrooms</span>
                <div className="paramButtons">
                  <button id="anyRooms" onClick={changeBedroomsNum}>Any</button>
                  {bedroomButtons}
                  <button id="room8+" onClick={changeBedroomsNum}>8+ </button>
                </div>
                <span>Beds</span>
                <div className="paramButtons">
                  <button id="anyBeds" onClick={changeBedsNum}>Any</button>
                  {bedsButtons}
                </div>
              </div>}
             {props.value === "boat" && 
              <div className="parameters">
                <h3>Type of boat</h3>
                <div className="paramSelects">
                  <div className="paramSelects1">
                    <label>
                      <input type="checkbox" defaultChecked="true" name="any"/>
                      Any
                    </label>
                    <label>
                      <input type="checkbox"  name="bowrider"/>
                      Bowrider
                    </label>
                    <label>
                      <input type="checkbox" name="cruiser"/>
                      Cruiser
                    </label>
                    <label>
                      <input type="checkbox" onClick={changeBoatType}/>
                      Fishing boat
                    </label>
                    <label>
                      <input type="checkbox" onClick={changeBoatType}/>
                      Runaboat
                    </label>
                  </div>
                  <div className="paramSelects2">
                  <label>
                      <input type="checkbox" onClick={changeBoatType}/>
                      Sailboat
                    </label>
                  <label>
                    <input type="checkbox" onClick={changeBoatType}/>
                    Speedboat
                  </label>
                  <label>
                    <input type="checkbox" onClick={changeBoatType}/>
                    Trawler
                  </label>
                  <label>
                    <input type="checkbox" onClick={changeBoatType}/>
                    Jetski
                  </label>
                  <label>
                    <input type="checkbox" onClick={changeBoatType}/>
                    Yacht
                  </label>
                  </div>
                </div>
              </div>}
             {props.value === "boat" && 
              <div className="parameters">
                <h3>Maximum speed</h3>
                <div className="paramButtons">
                  <button id="anyMaxSpeed" onClick={changeMaxSpeed}>Any</button>
                  <button id="30+" onClick={changeMaxSpeed}>30+</button>
                  <button id="50+" onClick={changeMaxSpeed}>50+</button>
                  <button id="80+" onClick={changeMaxSpeed}>80+</button>
                </div>
            </div>}
            {(props.value === "boat" || props.value === "adventure") && 
              <div className="parameters">
                <h3>Number of persons</h3>
                <div className="paramButtons">
                  <button id="anyCapacity" onClick={changeCapacity}>Any</button>
                  <button id="1-3" onClick={changeCapacity}>1-3</button>
                  <button id="3-6" onClick={changeCapacity}>3-6</button>
                  <button id="7+" onClick={changeCapacity}>7+</button>
                </div>
            </div>}
           </div>
           <div className="filterPopupFooter">
              <button className='delete' onClick={deleteFilters}>Delete everything</button>
              <button className='show' onClick={showResults}>Show results</button>
           </div>
          </form>
        </div>
      ) : "";
}
