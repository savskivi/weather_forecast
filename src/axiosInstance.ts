import axios from "axios";

export const apiKey = '50df9b8aac4fae416bcc41ac292e868b';

export const axiosInstance = axios.create({
    baseURL: 'https://api.openweathermap.org'
})