import React, {useState} from 'react'
import {useLink} from "../hooks/link.hook";
import { useHistory } from "react-router-dom";

export const CreatePage = () => {
    const [text, setText] = useState('')
    const {generateLink} = useLink()
    const history = useHistory()
    const handleChangeInput = (event) => {
        setText(event.target.value)
    }

    const onsubmit = () => {
        setText('')
        generateLink(text).then(e => {
            history.push('/detail/' + e.link._id)
        }).catch(e => console.error(e))
    }

    return (
        <div className="row">
            <div className="row">
                <div className="input-field s12">
                    <input id="links" type="text" className="links-input" value={text} onChange={handleChangeInput}/>
                    <label htmlFor="password">Ориганальная ссылка</label>
                </div>
            </div>
            <div className='center-align' onClick={onsubmit}>
                <a className="waves-effect waves-light btn-small">Сократить</a>
            </div>
        </div>
    )
}
