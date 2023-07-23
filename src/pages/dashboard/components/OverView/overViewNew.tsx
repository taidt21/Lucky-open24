import React from 'react';
import sinhnhat from '../../../../images/sn.svg';
import userIcon from '../../../../images/user1.svg';
import calendarIcon from '../../../../images/calendar-add.svg';
import walletIcon from '../../../../images/wallet.svg';
import incrementIcon from '../../../../images/tang.svg';
import decrementIcon from '../../../../images/giam.svg';
import './overViewNew.css';

const OverViewNew: React.FC = () => {
    const grids = [
        {
            icon: sinhnhat,
            title: 'Khách hàng sinh nhật',
            number: '5'
        },
        {
            icon: userIcon,
            title: 'Tổng số khách hàng ',
            number: '100',
            ratioText: '+11.01%',
            ratioIcon: incrementIcon
        },
        {
            icon: calendarIcon,
            title: 'Tổng cuộc hẹn',
            number: '150',
            ratioText: '-5.01%',
            ratioIcon: decrementIcon
        },
        {
            icon: walletIcon,
            title: 'Tổng doanh thu ',
            number: '10,000',
            ratioText: '+11.01%',
            ratioIcon: incrementIcon
        }
    ];

    return (
        <div className="overView">
            {grids.map((grid) => {
                return (
                    <div className="grid-item" key={grid.title.replace(/\s/g, '')}>
                        <div className="grid-item-icon">
                            <img src={grid.icon} alt="icon" />
                        </div>
                        <div className="grid-item-text">
                            <h3>{grid.title}</h3>
                            <div className="flex-bottom">
                                <span className="number">{grid.number}</span>
                                <span
                                    className="ratio"
                                    style={{
                                        backgroundColor: grid.ratioText?.includes('-')
                                            ? '#FFF5F8'
                                            : '#E8FFF3'
                                    }}>
                                    <span className="ratio-icon">
                                        <img
                                            src={
                                                grid.ratioText?.includes('-')
                                                    ? decrementIcon
                                                    : incrementIcon
                                            }
                                            alt="ratio"
                                        />
                                    </span>
                                    <span
                                        className="ratio-text"
                                        style={{
                                            color: grid.ratioText?.includes('-')
                                                ? '#F1416C'
                                                : '#50CD89'
                                        }}>
                                        {grid.ratioText}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OverViewNew;
