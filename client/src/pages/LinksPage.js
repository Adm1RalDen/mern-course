import React, {useEffect, useState} from 'react'
import {useLink} from "../hooks/link.hook";
import {Link} from "react-router-dom";

export const LinksPage = () => {
    const [links, setLinks] = useState(null)
    const {getLinkList} = useLink()

    useEffect(() => {
        getLinkList().then(e => {
            setLinks(e)
        })
    }, [])

    if (!links) {
        return <div>Loading Links ...</div>
    }
    return (
        <div className="row">
            <table>
                <thead>
                <tr>
                    <th>Оригинал</th>
                    <th>Сокращенная</th>
                    <th>Подробности</th>
                </tr>
                </thead>
                <tbody>
                {
                    links.map(e => (
                        <tr>
                            <td>
                                <a href={e.from}>{e.from}</a>
                            </td>
                            <td>
                                <a href={e.to}>{e.to}</a>
                            </td>
                            <td>
                                <Link to={`/detail/${e._id}`}>Детали</Link>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

        </div>
    )
}
