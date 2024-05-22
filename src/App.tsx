import { useState, useEffect } from "react";
import { BookData, fetchBookData } from "./utils/fetchBookData";

function App() {
    const [bookData, setBookData] = useState<BookData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bookApiResponse = await fetchBookData();
                setBookData(bookApiResponse);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run only once on mount

    if (loading) {
        return <h1>Please wait...</h1>;
    }
    console.log(bookData);

    return (
        <>
            <h1 className="text-4xl">Hello</h1>
            <pre>{JSON.stringify(bookData, null, 2)}</pre>
        </>
    );
}

export default App;
