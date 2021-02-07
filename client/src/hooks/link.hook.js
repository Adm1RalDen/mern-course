import {useContext, useState} from 'react'
import {useHttp} from "./http.hook";
import {AuthContext} from "../context/AuthContext";

export const useLink = () => {
    const {request} = useHttp()
    const {token} = useContext(AuthContext)
    const [isLoading, setIsLoading] = useState(false)

    const generateLink = async (link) => {
        setIsLoading(true)
        try {
            const res = await request('/api/link/generate', 'POST', {from: link}, {
                Authorization: 'Bearer ' + token
            })
            setIsLoading(false)
            return res
        } catch (e) {
            setIsLoading(false)
            console.error(e)
        }
    }

    const getLinkList = async () => {
        setIsLoading(true)
        try {
            const res = await request('/api/link/', 'GET', null, {
                Authorization: 'Bearer ' + token
            })
            setIsLoading(false)
            return res
        } catch (e) {
            setIsLoading(false)
            console.error(e)
        }
    }

    const getLinkById = async (id) => {
        setIsLoading(true)
        try {
            const res = await request(`/api/link/${id}`, 'GET', null, {
                Authorization: 'Bearer ' + token
            })
            setIsLoading(false)
            return  res
        } catch (e) {
            setIsLoading(false)
            console.error(e)
        }
    }


    return {generateLink, isLoading, getLinkList, getLinkById}
}
