import axios from "axios";
import { useEffect, useState } from "react";

const useFetchData = <T extends unknown>(URL: string) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await axios.get(URL, {
                    headers: { Authorization: `Bearer ${process.env.EXPO_PUBLIC_TEMP_TOKEN}` },
                });
                setData(res.data.data);
            } catch (e: any) {
                console.log(e);
                setError(e.response?.data?.reason || "An error occurred while fetching data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [URL]);

    return { data, isLoading, error };
};

export default useFetchData;
