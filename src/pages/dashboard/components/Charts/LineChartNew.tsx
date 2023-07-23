import React from 'react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import './lineChartNew.css';

const LineChartNew: React.FC = () => {
    const data = [
        { name: 'Thứ 2', 'Tháng này': 20, 'Tháng trước': 0 },
        { name: 'Thứ 3', 'Tháng này': 28, 'Tháng trước': 23 },
        { name: 'Thứ 4', 'Tháng này': 31, 'Tháng trước': 22 },
        { name: 'Thứ 5', 'Tháng này': 34, 'Tháng trước': 21 },
        { name: 'Thứ 6', 'Tháng này': 47, 'Tháng trước': 38 },
        { name: 'Thứ 7', 'Tháng này': 28, 'Tháng trước': 39 },
        { name: 'Chủ nhật', 'Tháng này': 30, 'Tháng trước': 19 }
    ];

    const hideZeroFormatter = (value: any) => (value === 0 ? '' : value);
    const renderLineChart = (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 8, right: 35, bottom: 24, left: 0 }}>
                <Line
                    type="monotone"
                    dataKey="Tháng này"
                    stroke="var(--color-main)"
                    dot={false}
                    activeDot={{ r: 4 }}
                    animationDuration={8000}
                />
                <Line
                    type="monotone"
                    dataKey="Tháng trước"
                    stroke="#ff9900"
                    dot={false}
                    activeDot={{ r: 4 }}
                    animationDuration={8000}
                />
                <CartesianGrid stroke="#E6E1E6" strokeDasharray="0 0 " />
                <XAxis
                    dataKey="name"
                    tickSize={0}
                    tick={{ fontSize: 12, fill: '#666466' }}
                    axisLine={{ stroke: '#E6E1E6' }}
                    tickMargin={15}
                    tickLine={{ stroke: '#E6E1E6' }}
                    interval={0}
                />
                <YAxis
                    type="number"
                    tickCount={6}
                    tick={{ fontSize: 12, fill: '#666466' }}
                    axisLine={{ stroke: '#E6E1E6' }}
                    tickSize={0}
                    tickMargin={18}
                    tickFormatter={hideZeroFormatter}
                />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
    return (
        <div className="chart">
            <div className="tooltips">
                <div className="tooltip-item">
                    <div className="tooltip-dot current"></div>
                    <div className="tooltip-text">Tháng này</div>
                </div>
                <div className="tooltip-item">
                    <div className="tooltip-dot before"></div>
                    <div className="tooltip-text">Tháng trước</div>
                </div>
            </div>
            {renderLineChart}
        </div>
    );
};

export default LineChartNew;
