import React from 'react'
import { useParams } from 'react-router-dom'
import Action from './ActionPanel';
import Header from '../../Header';

function Availability(){
    let {id} = useParams();
    console.log(id)

    return (
        <div>
            <Header/>
            <Action bookableId = {id}/>
            //
        </div>
    )


}

export default Availability