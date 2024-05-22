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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-blue-500 text-2xl">
                Please wait...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto flex justify-center mt-8 h-screen">
            <Table data={bookData} columns={columns} />
        </div>
    );
}

export default App;
