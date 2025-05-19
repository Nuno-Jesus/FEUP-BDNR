import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

function useBackend(uri: string, init?: RequestInit) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${uri}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    ...init,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [uri, init?.body]);

    return { data, loading, error };
}

export default useBackend;
