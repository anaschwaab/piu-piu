import axios from 'axios';

export const Api = axios.create({ 
    baseURL: 'https://piupiu-api.onrender.com/'
})
