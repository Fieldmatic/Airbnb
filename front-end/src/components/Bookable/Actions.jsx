import React from 'react'
import { useParams } from 'react-router-dom'
import ActionPanel from './ActionPanel';
import Header from '../../Header';

function Availability(){
    let {id} = useParams();
    console.log(id)

    return (
        <div>
            <Header/>
            <ActionPanel bookableId = {id}/>
            //
        </div>
    )


}

export default Availability