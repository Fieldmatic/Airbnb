import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../Header';
import PeriodPanel from './PeriodPanel';

function Periods(){
    let {id} = useParams();

    return (
        <div>
            <Header/>
            <PeriodPanel bookableId = {id}/>
            
        </div>
    )


}

export default Periods