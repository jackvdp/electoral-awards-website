// components/admin/DataTable.tsx
import React from 'react';
import NextLink from 'components/reuseable/links/NextLink';

export interface PaginationProps {
    page: number;
    totalCount: number;
    perPage: number;
    baseUrl: string;
}

interface DataTableProps<T> {
    headers: string[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    pagination?: PaginationProps;
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

const DataTable = <T, >({headers, data, renderRow, pagination}: DataTableProps<T>) => {
    return (
        <div className="card">
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