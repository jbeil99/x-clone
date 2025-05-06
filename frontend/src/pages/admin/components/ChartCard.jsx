import React from 'react';

const ChartCard = ({ title, chart }) => {
    return (
        <div className="bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            {chart}
        </div>
    );
};

export default ChartCard;