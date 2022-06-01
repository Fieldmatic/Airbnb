import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Tag, X } from "react-feather";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import "./Tags.css";

export default function Tags(props){

    return (
        <div className="TagsContainer">
            <div className="Tags">
                <div className="TagForm">
                <LocalOfferIcon sx = {{color:"#FF5A5F", marginLeft:"6px"}}/>
                <input
                    className="tagInput"
                    type="text"
                    placeholder="Add a tag..."
                    onKeyPress={event => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        props.setTags([...props.tags, event.target.value]);
                        event.target.value = "";
                    }
                    }}
                    autofocus
                />
                </div>
                <ul className="TagList">
                {props.tags.map(tag => (
                    <li className="Tag">
                    {tag}
                    <X
                        className="TagIcon"
                        size="16"
                        onClick={() => {
                        props.setTags([...props.tags.filter(word => word !== tag)]);
                        }}
                    />
                    </li>
                ))}
                </ul>
            </div>
        </div>
    )
}