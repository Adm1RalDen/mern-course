import React, {useEffect, useState} from 'react'
import {LinkDetail} from "../components/DetailLink";
import {useLink} from "../hooks/link.hook";
import {useParams} from 'react-router-dom'

export const DetailPage = () => {
    const {getLinkById} = useLink()
    const {id} = useParams()
    const [state, setState] = useState(null)

    useEffect(() => {
        if (id) {
            getLinkById(id).then(e => {
                setState({...e})
            })
        }
    }, [])

    if (!state) {
        return <div>Loading link data ...</div>
    }
    return (
        <div className="row">
            <LinkDetail data={state}/>
        </div>
    )
}
