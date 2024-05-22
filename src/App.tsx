import { useState, useEffect } from "react";
import axios from "axios";

const fetchBookData = async () => {
    try {
        const res = await axios.get(
            "https://openlibrary.org/people/mekBot/books/already-read.json"
        );

        // Extract relevant data from the response
        const extractedData = res.data.reading_log_entries.map(
            (entry: {
                work: {
                    title: string;
                    key: string;
                    author_names: string[];
                    first_publish_year: number;
                };
            }) => ({
                title: entry.work.title,
                key: entry.work.key.split("/").pop(),
                author_names: entry.work.author_names[0],
                first_publish_year: entry.work.first_publish_year,
            })
        );

        // Return the extracted data
        return extractedData;
    } catch (error) {
        console.error("Error fetching book data:", error);
        return []; // Return an empty array in case of error
    }
};

function App() {
    const [bookData, setBookData] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const bookApiResponse = await fetchBookData();
            setBookData(bookApiResponse);
        };

        fetchData();
    }, []); // Empty dependency array to run only once on mount

    console.log(bookData);

    return (
        <>
            <h1 className="text-4xl">Hello</h1>
        </>
    );
}

export default App;
