import React from "react";
import clsx from "clsx";
const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.total_pages <= 1) {
        return null;
    }

    const { current_page, total_pages } = pagination;

    const handlePageClick = (page) => {
        if (page >= 1 && page <= total_pages && page !== current_page) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfPagesToShow = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, current_page - halfPagesToShow);
        let endPage = Math.min(total_pages, current_page + halfPagesToShow);

        if (current_page - halfPagesToShow <= 0) {
            endPage = Math.min(total_pages, maxPagesToShow);
        }

        if (current_page + halfPagesToShow >= total_pages) {
            startPage = Math.max(1, total_pages - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(<li key={1}><button onClick={() => handlePageClick(1)} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">1</button></li>);
            if (startPage > 2) {
                pageNumbers.push(<li key="start-ellipsis" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</li>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i}>
                    <button
                        onClick={() => handlePageClick(i)}
                        className={clsx("px-3 py-2 leading-tight border border-gray-300", {
                            'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700': current_page === i,
                            'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700': current_page !== i,
                        })}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (endPage < total_pages) {
            if (endPage < total_pages - 1) {
                pageNumbers.push(<li key="end-ellipsis" className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</li>);
            }
            pageNumbers.push(<li key={total_pages}><button onClick={() => handlePageClick(total_pages)} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">{total_pages}</button></li>);
        }

        return pageNumbers;
    };


    return (
        <nav aria-label="Page navigation" className="flex justify-center">
            <ul className="inline-flex items-center -space-x-px">
                <li>
                    <button
                        onClick={() => handlePageClick(current_page - 1)}
                        disabled={current_page === 1}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                </li>
                {renderPageNumbers()}
                <li>
                    <button
                        onClick={() => handlePageClick(current_page + 1)}
                        disabled={current_page === total_pages}
                        className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;