import React, { useState, useEffect } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import { BookData } from "../utils/fetchBookData";

// Define the props for your Table component
interface TableProps {
    data: BookData[];
    columns: ColumnDef<BookData>[];
}

// Define a custom cell component
const EditableCell: React.FC<{
    getValue: () => any;
    index: number;
    id: string;
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}> = ({ getValue, index, id, updateData }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const onBlur = () => {
        updateData(index, id, value);
    };

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <input
            className="focus:outline-none focus:border border-blue-400 rounded px-1"
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
        />
    );
};

const Table: React.FC<TableProps> = ({ data, columns }) => {
    const [sortedData, setSortedData] = useState<BookData[]>(data); // State to hold sorted data
    const [sortOption, setSortOption] = useState<string>(""); // State to hold selected sorting option

    //sorting logic
    useEffect(() => {
        const sortData = (option: string) => {
            let sorted: BookData[] = [];
            if (option === "Ascending") {
                sorted = [...data].sort((a, b) => {
                    if (a.rating !== b.rating) return a.rating - b.rating;
                    return a.first_publish_year - b.first_publish_year;
                });
            } else if (option === "Descending") {
                sorted = [...data].sort((a, b) => {
                    if (a.rating !== b.rating) return b.rating - a.rating;
                    return b.first_publish_year - a.first_publish_year;
                });
            } else {
                sorted = data; // If no sort option selected, use the initial data
            }
            setSortedData(sorted);
        };
        sortData(sortOption);
    }, [sortOption, data]); // Re-sort data when sortOption changes
    // Declare essential modules from tanstack table
    const table = useReactTable<BookData>({
        columns,
        data: sortedData, // Use sorted data for rendering
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        meta: {
            updateData: (rowIndex: number, columnId: string, value: unknown) => {
                console.log("Update data logic:", rowIndex, columnId, value);
            },
        },
    });

    return (
        <div className="overflow-x-auto mx-4">
            {/* Ascending & Descending sorting menu*/}
            <div className="flex items-center gap-2 mb-3">
                <span>Sort by:</span>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="border border-blue-400 px-4 py-2 rounded focus:outline-none"
                >
                    <option value="">Select an option</option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                </select>
            </div>
            <table className="table-auto min-w-full">
                {/* render table head with editable rows functionality */}
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr
                            className="bg-gray-200 text-left text-xs md:text-base"
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} colSpan={header.colSpan} className="p-2 border">
                                    {header.isPlaceholder ? null : (
                                        <div>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                {/* render table rows with editable rows functionality */}
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="bg-white text-xs md:text-base">
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-2 border">
                                    {/* Use the custom cell component */}
                                    <EditableCell
                                        getValue={cell.getValue}
                                        index={row.index}
                                        id={cell.column.id}
                                        updateData={table.options.meta?.updateData}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination functionality */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 mt-3 text-xs md:text-base">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page:
                        <input
                            type="number"
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="border px-4 w-16 py-2 rounded focus:outline-none"
                        />
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        className="border border-blue-400 px-4 py-2 rounded"
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Pagination buttons e.g: start, prev, next, end */}
                <div className="flex items-center gap-2">
                    <button
                        className="rounded py-1 px-2 border border-blue-400"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Start
                    </button>
                    <button
                        className="rounded py-1 px-2 text-white bg-blue-500 font-medium border border-blue-500"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Prev
                    </button>
                    <button
                        className="rounded py-1 px-2 text-white bg-blue-500 font-medium border border-blue-500"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </button>
                    <button
                        className="rounded py-1 px-2 border border-blue-400"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        End
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;
