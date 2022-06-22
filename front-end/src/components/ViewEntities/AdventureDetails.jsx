import React from "react"


export default function EntityDetails(props) {

    return(
        <>
            <div className="paragraphs">
                    <h3>Equipment</h3>
                    <div className="services">
                        {props.eq.map((service, i) =>(
                            <div className="service" key={i}>
                                <p> {service}</p>
                            </div>
                        ))}
                </div>
            </div>     
        </>
    )
}