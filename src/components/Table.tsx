import React, { useState, useEffect } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";

// Define the props for your Table component
interface TableProps {
    data: Data[];
    columns: ColumnDef<Data>[];
}

// Define the shape of your data
interface Data {
    title: string;
    key: string;
    author_names: string;
    first_publish_year: number;
    subject?: string;
    author_birth_date?: string;
    author_top_work?: string;
    rating?: string;
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
    const table = useReactTable<Data>(
        {
            columns,
            data,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            autoResetPageIndex: false,
            meta: {
                updateData: (rowIndex: number, columnId: string, value: unknown) => {
                    console.log("Update data logic:", rowIndex, columnId, value);
                },
            },
        },
        []
    );

    return (
        <div className="overflow-x-auto mx-4">
            <table className="table-auto min-w-full">
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
                            className="border  px-4 w-16 py-2 rounded"
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
