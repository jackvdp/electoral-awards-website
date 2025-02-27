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

interface DataTableProps<T> {
    headerTitle?: string;
    headerAction?: React.ReactNode;
    headers: string[];
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
                            data,
                            renderRow,
                            pagination,
                            searchable
                        }: DataTableProps<T>) => {
    const router = useRouter();
    // Get the current search term from the query or use an empty string.
    const {search: searchQuery} = router.query;
    const [searchInput, setSearchInput] = useState((searchQuery as string) || '');

    const handleSearch = () => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                search: searchInput,
                page: 1, // Reset to first page on new search.
            },
        });
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
                            {headers.map((header, index) => (
                                <th key={index} scope="col">{header}</th>
                            ))}
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