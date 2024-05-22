import axios from "axios";

interface Work {
    work: {
        title: string;
        key: string;
        author_names: string[];
        first_publish_year: number;
    };
}

export interface BookData {
    title: string;
    key: string;
    author_names: string;
    first_publish_year: number;
    subject?: string;
    author_birth_date?: string;
    author_top_work?: string;
    rating?: string;
}

export const fetchBookData = async (): Promise<BookData[]> => {
    try {
        const res = await axios.get(
            "https://openlibrary.org/people/mekBot/books/already-read.json"
        );

        // Extract relevant data from the response
        const extractedData: BookData[] = res.data.reading_log_entries.map((entry: Work) => ({
            title: entry.work.title,
            key: entry.work.key.split("/").pop(),
            author_names: entry.work.author_names[0],
            first_publish_year: entry.work.first_publish_year,
        }));

        // Fetch additional data for each author
        const bookInfoPromises = extractedData.map(async (data) => {
            try {
                // Getting book author information
                const authorRes = await axios.get(
                    `https://openlibrary.org/search/authors.json?q=${data.author_names}`
                );
                // Getting average rating information
                const averageRatingRes = await axios.get(
                    `https://openlibrary.org/works/${data.key}/ratings.json`
                );

                const authorData = authorRes.data.docs[0];
                const averageRatingData = averageRatingRes.data.summary;

                return {
                    ...data,
                    subject: authorData?.top_subjects?.[0] || "Not Available",
                    author_birth_date: authorData?.birth_date || "Not Available",
                    author_top_work: authorData?.top_work || "Not Available",
                    rating: averageRatingData?.average?.toFixed(2) || "Not Available",
                };
            } catch (error) {
                console.error(`Error fetching author data for ${data.author_names}:`, error);
                return {
                    ...data,
                    subject: "N/A",
                    author_birth_date: "N/A",
                    author_top_work: "N/A",
                    rating: "N/A",
                };
            }
        });

        const bookInfo = await Promise.all(bookInfoPromises);

        // Return the combined data
        return bookInfo;
    } catch (error) {
        console.error("Error fetching book data:", error);
        return []; // Return an empty array in case of error
    }
};
