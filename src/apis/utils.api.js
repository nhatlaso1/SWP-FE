import axios from "axios"
const apiUrl = "https://66fe3cf02b9aac9c997aef84.mockapi.io/api/v1/QuynhNTNSS170152"

export const getAllUsers = async() => {
    
    try{
        const response = axios.get(apiUrl) 
        return (await response).data;
    }catch(e){
        console.log(e.toString())
    }
}

export const getUserById = async (id) => {
    try{
        const response = await axios.get(`${apiUrl}/${id}`)
        return response.data;
    }catch(e){
        console.log(e.toString())
    }
}