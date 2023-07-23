import React from 'react';
import './hotServicesNew.css';
const HotServicesNew: React.FC = () => {
    const datas = [
        {
            name: 'Dịch vụ 1',
            value: '65,000.000',
            color: '#FFC700',
            bgColor: '#FFF8DD'
        },
        {
            name: 'Dịch vụ 2',
            value: '65,000.000',
            color: '#7C3367',
            bgColor: '#F2EBF0'
        },
        {
            name: 'Dịch vụ 3',
            value: '65,000.000',
            color: '#009EF7',
            bgColor: '#F1FAFF'
        },
        {
            name: 'Dịch vụ 4',
            value: '65,000.000',
            color: '#F1416C',
            bgColor: '#FFF5F8'
        },
        {
            name: 'Dịch vụ 5',
            value: '65,000.000',
            color: '#50CD89',
            bgColor: '#E8FFF3'
        }
    ];
    const ServicesElement = datas.map((data) => (
        <div className="service-item" key={data.name.replace(/\s/g, '')}>
            <div className="service-row-1">
                <div className="service-name">{data.name}</div>
                <div className="service-value" style={{ color: data.color }}>
                    {data.value}
                </div>
            </div>
            <div className="service-progress" style={{ background: data.bgColor }}>
                <div className="service-progressBar" style={{ background: data.color }}></div>
            </div>
        </div>
    ));
    return <div className="services">{ServicesElement}</div>;
};
export default HotServicesNew;
