import axios from "axios";
import { getCookie } from "typescript-cookie";

const axiosPrivateBusiness = axios.create({
    baseURL: import.meta.env.VITE_H2O_URL,
    withCredentials: true,
});

axiosPrivateBusiness.interceptors.request.use(
    (config) => {
        const token = getCookie("token");
        if(token){
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join('')
            );
    
            const decodedToken = JSON.parse(jsonPayload);
            const role = decodedToken.role

            if (!role) {
                return Promise.reject(new Error('Unauthorized: Token or role is missing'));
            }
    
            if (role !== 'business') {
                return Promise.reject(new Error('Unauthorized: Business role required'));
            }
            
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosPrivateBusiness;
