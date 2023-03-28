import axios from 'axios';
import { useMemo } from 'react';
function useApi() {
    const api = useMemo(() => {
        const api = axios.create({
            baseURL: 'https://randomuser.me/api/',
        });
        return api;
    }, []);

    return api;
}

export default useApi;