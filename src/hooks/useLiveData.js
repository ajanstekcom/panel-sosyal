import { useState, useEffect } from 'react';
import axios from 'axios';

export const useLiveData = (intervalMilli = 10000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const res = await axios.get('https://topalogdata.com/api/all');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, intervalMilli);
        return () => clearInterval(interval);
    }, [intervalMilli]);

    return { data, loading, error, refetch: fetchData };
};
