import React from "react"
import AdminService from "../../services/AdminService"
import DeletionReasonCard from "./DeletionReasonCard"
import Header from "../../Header";


export default function UserRegistration() {
    const [allCards, setAllCards] = React.useState([])

    React.useEffect(() => {
        AdminService.getUserRegistrationRequests().then((response) => {
            setAllCards(response.data)
        })
    }, [])

    const cards = allCards.map(item => {
        return (
            <DeletionReasonCard
                key={item.id}
                id={item.id}
                user={item.user}
                reason={item.reason}
            />
        )
    })        

    return (
        <div>
            <Header />
            <br /><br />
            <div className="entities-view">
                {cards}
            </div>
        </div>
    )
}