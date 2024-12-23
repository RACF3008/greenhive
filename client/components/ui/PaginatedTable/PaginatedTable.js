import React, { useState, useEffect } from 'react';

import styles from './PaginatedTable.module.css';

const PaginatedTable = ({ data, itemsPerPage }) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(null);

  useEffect(() => {
    if (totalPages > 0) {
      setCurrentPage(totalPages); // Start on the last page
    }
  }, [totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const headers = Object.keys(data[0] || {});

  return (
    <div className={styles.paginatedTableContainer}>
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        className={styles.paginatedTable}
      >
        <thead className={styles.thead}>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {currentData.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{item[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tableNav} style={{ marginTop: '10px' }}>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={styles.button}
        >
          &lt;
        </button>
        <span className={styles.label} style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={styles.button}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
