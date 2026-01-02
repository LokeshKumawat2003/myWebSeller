import React from 'react';
import { useThemeColors } from '../../AdminContext';

const Table = ({
  headers,
  data,
  className = '',
  onRowClick,
  renderCell,
  actions
}) => {
  const colors = useThemeColors();

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y" style={{ borderColor: colors.border }}>
        <thead style={{ backgroundColor: colors.bgSecondary }}>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                style={{ color: colors.textSecondary }}
              >
                {header}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: colors.textSecondary }}>Actions</th>}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: colors.bgPrimary }}>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              style={{
                borderColor: colors.border,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                backgroundColor: colors.bgPrimary,
              }}
              onMouseEnter={(e) => {
                e.target.closest('tr').style.backgroundColor = colors.bgSecondary;
              }}
              onMouseLeave={(e) => {
                e.target.closest('tr').style.backgroundColor = colors.bgPrimary;
              }}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: colors.textPrimary }}>
                  {renderCell ? renderCell(cell, cellIndex, row) : cell}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {actions(row, rowIndex)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;