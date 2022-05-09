import React, {useState, useEffect} from 'react'
import Dropdown from "./Dropdown";

const MenuItems = ({ items }) => {
    const [dropdown, setDropdown] = useState(false);
 return (
  <li className="menu-items">
    <>
     <button type="button" aria-haspopup="menu"
     aria-expanded={dropdown ? "true" : "false"}
     onClick={() => setDropdown((prev) => !prev)}
     >
      {items.title}{" "}
     </button>
     <Dropdown submenus={items.submenu} dropdown={dropdown}/>
    </> 
  </li>
 );
};

export default MenuItems;