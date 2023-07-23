import React from 'react';
import avatar from '../../../../images/avatar.png';
import clockIcon from '../../../../images/clock.svg';
import './appointmentsNew.css';
const AppoimentsNew: React.FC = () => {
    const datas = [
        {
            id: 1,
            avatar: avatar,
            name: 'Đinh Tuấn Tài',
            time: '9h00 - 12h30',
            job: 'Uốn nhuộm ',
            state: 'Đang chờ',
            price: '1,000,000'
        },
        {
            id: 2,
            avatar: avatar,
            name: 'Đinh Tuấn em',
            time: '9h00 - 12h30',
            job: 'Uốn nhuộm ',
            state: 'Đang chờ',
            price: '1,000,000'
        },
        {
            id: 3,
            avatar: avatar,
            name: 'Đinh Tuấn Anh',
            time: '9h00 - 12h30',
            job: 'Uốn nhuộm ',
            state: 'Đang chờ',
            price: '1,000,000'
        }
    ];

    return (
        <div className="todo-lists">
            {datas.map((data) => {
                return (
                    <div className="todo-item" key={data.id}>
                        <div className="todo-item_col-1">
                            <div className="avatar">
                                <img src={data.avatar} alt="" />
                            </div>
                            <div className="todo-content">
                                <div className="todo-name">{data.name}</div>
                                <div className="times">
                                    <div className="time-icon">
                                        <img src={clockIcon} alt="clock" />
                                    </div>
                                    <div className="time-text">{data.time}</div>
                                </div>
                                <div className="job">{data.job}</div>
                            </div>
                        </div>
                        <div className="todo-item_col-2">
                            <div className="state">{data.state}</div>
                            <div className="price">{data.price}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AppoimentsNew;
