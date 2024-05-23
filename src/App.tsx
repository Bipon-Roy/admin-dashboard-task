import { useState, useEffect, useMemo } from "react";

import { BookData, fetchBookData } from "./utils/fetchBookData";
import Table from "./components/Table";

const LOCAL_STORAGE_KEY = "bookData";

function App() {
    const [bookData, setBookData] = useState<BookData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (cachedData) {
                setBookData(JSON.parse(cachedData));
                setLoading(false);
            } else {
                try {
                    const bookApiResponse = await fetchBookData();
                    setBookData(bookApiResponse);
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bookApiResponse));
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, []);

    //declaring columns
    const columns = useMemo(
        () => [
            {
                header: "Title",
                accessorKey: "title",
            },

            {
                header: "Author",
                accessorKey: "author_names",
            },
            {
                header: "First Publish Year",
                accessorKey: "first_publish_year",
            },
            {
                header: "Subject",
                accessorKey: "subject",
            },
            {
                header: "Author Birth Date",
                accessorKey: "author_birth_date",
            },
            {
                header: "Author Top Work",
                accessorKey: "author_top_work",
            },
            {
                header: "Rating",
                accessorKey: "rating",
            },
        ],
        []
    );

    //show a message until data fetching is completed
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-blue-500 text-2xl">
                Please wait...
            </div>
        );
    }

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-blue-500 text-center p-1 md:text-xl uppercase font-medium mb-3">
                an admin dashboard table
            </h1>
            <Table data={bookData} columns={columns} />
        </div>
    );
}

export default App;
