/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║              NEBULA TABLE COMPONENT                               ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

import React from 'react';
import './Table.css';

const Table = ({ children, className = '', ...props }) => (
    <div className={`nebula-table-wrapper ${className}`}>
        <table className="nebula-table" {...props}>
            {children}
        </table>
    </div>
);

Table.Head = ({ children, className = '' }) => (
    <thead className={`nebula-table__head ${className}`}>
        {children}
    </thead>
);

Table.Body = ({ children, className = '' }) => (
    <tbody className={`nebula-table__body ${className}`}>
        {children}
    </tbody>
);

Table.Row = ({ children, className = '', onClick, selected = false }) => (
    <tr
        className={`nebula-table__row ${selected ? 'nebula-table__row--selected' : ''} ${className}`}
        onClick={onClick}
    >
        {children}
    </tr>
);

Table.Header = ({ children, className = '', sortable = false, sorted, onSort }) => (
    <th
        className={`nebula-table__header ${sortable ? 'nebula-table__header--sortable' : ''} ${className}`}
        onClick={sortable ? onSort : undefined}
    >
        <span className="nebula-table__header-content">
            {children}
            {sortable && (
                <span className="nebula-table__sort-icon">
                    {sorted === 'asc' && '↑'}
                    {sorted === 'desc' && '↓'}
                    {!sorted && '↕'}
                </span>
            )}
        </span>
    </th>
);

Table.Cell = ({ children, className = '', align = 'left' }) => (
    <td className={`nebula-table__cell nebula-table__cell--${align} ${className}`}>
        {children}
    </td>
);

export default Table;
