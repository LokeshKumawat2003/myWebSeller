import React from 'react';

const SizeGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeData = {
    headers: ['Size', 'Chest (inches)', 'Waist (inches)', 'Hip (inches)', 'Length (inches)'],
    rows: [
      ['XS', '32-34', '24-26', '34-36', '32'],
      ['S', '34-36', '26-28', '36-38', '33'],
      ['M', '36-38', '28-30', '38-40', '34'],
      ['L', '38-40', '30-32', '40-42', '35'],
      ['XL', '40-42', '32-34', '42-44', '36'],
      ['XXL', '42-44', '34-36', '44-46', '37']
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#fbf7f2] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-[#e6ddd2]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-medium text-[#9c7c3a] tracking-[1px]">Size Guide</h2>
            <button
              onClick={onClose}
              className="text-[#3b3b3b] hover:text-[#9c7c3a] text-2xl font-sans"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p className="text-[#3b3b3b] font-sans mb-4">
              Please note that these measurements are approximate and may vary slightly depending on the style and fit of the garment.
            </p>
            <p className="text-[#3b3b3b] font-sans">
              For the most accurate fit, we recommend measuring a similar garment you own and comparing it to our size chart.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-[#e6ddd2]">
              <thead>
                <tr className="bg-[#e6ddd2]">
                  {sizeData.headers.map((header, index) => (
                    <th key={index} className="border border-[#e6ddd2] px-4 py-3 text-left text-sm font-serif font-medium text-[#9c7c3a]">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData.rows.map((row, index) => (
                  <tr key={index} className="hover:bg-[#e6ddd2]">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="border border-[#e6ddd2] px-4 py-3 text-sm text-[#3b3b3b] font-sans">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-serif font-medium text-[#9c7c3a] mb-3 tracking-[1px]">How to Measure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-[#3b3b3b] font-sans">
              <div>
                <p className="font-serif font-medium text-[#9c7c3a] mb-2">Chest:</p>
                <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div>
                <p className="font-serif font-medium text-[#9c7c3a] mb-2">Waist:</p>
                <p>Measure around your natural waistline, typically the narrowest part of your torso.</p>
              </div>
              <div>
                <p className="font-serif font-medium text-[#9c7c3a] mb-2">Hip:</p>
                <p>Measure around the widest part of your hips, about 8 inches below your waist.</p>
              </div>
              <div>
                <p className="font-serif font-medium text-[#9c7c3a] mb-2">Length:</p>
                <p>Measure from the highest point of the shoulder to the desired hemline.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#9c7c3a] hover:bg-[#8a6a2f] text-[#fbf7f2] px-6 py-2 rounded font-serif font-medium transition-colors tracking-[0.5px]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;