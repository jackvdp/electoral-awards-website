// components/admin/DataTable.tsx
import React, {useState} from 'react';
import NextLink from 'components/reuseable/links/NextLink';
import {useRouter} from "next/router";

export interface PaginationProps {
    page: number;
    totalCount: number;
    perPage: number;
    baseUrl: string;
}

export interface ColumnDef {
    key: string;
    label: string;
    sortable?: boolean;
}

interface DataTableProps<T> {
    headerTitle?: string;
    headerAction?: React.ReactNode;
    headers?: string[];
    columns?: ColumnDef[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    pagination?: PaginationProps;
    searchable?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({page, totalCount, perPage, baseUrl}) => {
    const totalPages = Math.ceil(totalCount / perPage);
    return (
        <nav className="d-flex justify-content-center mt-6" aria-label="pagination">
            <ul className="pagination">
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                    <NextLink
                        title={<i className="uil uil-arrow-left"></i>}
                        href={`${baseUrl}&page=${page - 1}`}
                        className="page-link"
                        aria-label="Previous"
                    />
                </li>
                {Array.from({length: totalPages}).map((_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                        <NextLink
                            title={`${i + 1}`}
                            href={`${baseUrl}&page=${i + 1}`}
                            className="page-link"
                        />
                    </li>
                ))}
                <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                    <NextLink
                        title={<i className="uil uil-arrow-right"></i>}
                        href={`${baseUrl}&page=${page + 1}`}
                        className="page-link"
                        aria-label="Next"
                    />
                </li>
            </ul>
        </nav>
    );
};

const DataTable = <T, >({
                            headerTitle,
                            headerAction,
                            headers,
                            columns,
                            data,
                            renderRow,
                            pagination,
                            searchable
                        }: DataTableProps<T>) => {
    const router = useRouter();
    // Get the current search term and sort parameters from the query
    const {search: searchQuery, sortBy, sortOrder} = router.query;
    const [searchInput, setSearchInput] = useState((searchQuery as string) || '');

    const handleSearch = () => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                search: searchInput,
                page: 1, // Reset to first page on new search
            },
        });
    };

    const handleSort = (columnKey: string) => {
        let newSortOrder = 'asc';

        // If already sorting by this column, toggle the sort order
        if (sortBy === columnKey) {
            newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        }

        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                sortBy: columnKey,
                sortOrder: newSortOrder,
                page: 1, // Reset to first page on sort change
            },
        });
    };

    // Render a sortable header cell
    const renderHeaderCell = (column: ColumnDef) => {
        if (column.sortable) {
            const isSorted = sortBy === column.key;
            const sortIcon = !isSorted
                ? <i className="uil uil-sort text-muted ms-1"></i>
                : sortOrder === 'asc'
                    ? <i className="uil uil-sort-amount-up ms-1"></i>
                    : <i className="uil uil-sort-amount-down ms-1"></i>;

            return (
                <th key={column.key} scope="col" onClick={() => handleSort(column.key)} style={{cursor: 'pointer'}}>
                    <div className="d-flex align-items-center">
                        {column.label}
                        {sortIcon}
                    </div>
                </th>
            );
        }

        return <th key={column.key} scope="col">{column.label}</th>;
    };

    return (
        <div className="card">
            {(headerTitle || headerAction) && (
                <div className="card-header d-flex align-items-center">
                    {headerTitle && <h4 className="card-title mb-0">{headerTitle}</h4>}
                    {searchable &&
                        <div className="ms-auto">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                    }
                    {searchable &&
                        <div className="ms-2">
                            <button className="btn btn-soft-primary btn-sm rounded-pill" onClick={handleSearch}>Search
                            </button>
                        </div>
                    }
                    {headerAction && <div className={`ms-2 ${!searchable && "ms-auto"}`}>
                        {headerAction}
                    </div>}
                </div>
            )}
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            {columns ? (
                                // Use column definitions with sort functionality
                                columns.map(column => renderHeaderCell(column))
                            ) : (
                                // Fallback to simple headers without sorting
                                headers?.map((header, index) => (
                                    <th key={index} scope="col">{header}</th>
                                ))
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <React.Fragment key={index}>{renderRow(item)}</React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
                {pagination && <Pagination {...pagination} />}
            </div>
        </div>
    );
};

export default DataTable;