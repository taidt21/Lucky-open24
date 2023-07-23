import { Component, ReactNode } from 'react';
import cake from '../../../../images/cake.png';
import { AiOutlineUser } from 'react-icons/ai';
import { FaRegCalendarPlus, FaRegMoneyBillAlt } from 'react-icons/fa';
import { Grid } from '@mui/material';
class OverView extends Component {
    render(): ReactNode {
        return (
            <div className="mt-3">
                <Grid container style={{ maxHeight: '120px' }}>
                    <Grid item xs={3}>
                        <div
                            className="row text-center"
                            style={{
                                background: '#FFF5F8',
                                borderRadius: 8,
                                height: 120,
                                margin: '12px'
                            }}>
                            <div className="col-4">
                                <img
                                    width={86}
                                    height={86}
                                    src={cake}
                                    style={{ marginLeft: 14, marginBottom: 15, marginTop: 19 }}
                                />
                            </div>

                            <div className="col text-center">
                                <div className="mx-auto my-auto text-center mt-5">
                                    <div
                                        style={{
                                            color: 'var(--color-main)',
                                            height: '42px',
                                            lineHeight: '42px',
                                            fontSize: '32px',
                                            fontWeight: '700',
                                            fontFamily: 'roboto'
                                        }}>
                                        5
                                    </div>
                                    <div style={{ color: '#4C4B4C', height: '20px' }}>
                                        Khách hàng sinh nhật
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            className="ovver-view-item"
                            style={{
                                background: '#FFF5F8',
                                borderRadius: 8,
                                height: 120,
                                margin: '12px'
                            }}>
                            <div className="ovver-view-item-icon">
                                <div
                                    className="card"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: '#009EF7',
                                        borderRadius: '18px'
                                    }}>
                                    <div className="card-body text-center">
                                        <AiOutlineUser size={18} color="#FFFFFF" />
                                    </div>
                                </div>
                            </div>
                            <div className="ovver-view-item-content text-center">
                                <div className="title-overview">Tổng số khách hàng</div>
                                <div className="row text-center">
                                    <div className="col text-center">
                                        <h4 className="amount-ovverview">100</h4>
                                    </div>
                                    <div className="col percen-increase-overview text-center">
                                        +11%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            className="ovver-view-item"
                            style={{
                                background: '#FFF5F8',
                                borderRadius: 8,
                                height: 120,
                                margin: '12px'
                            }}>
                            <div className="ovver-view-item-icon">
                                <div
                                    className="card"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: '#FFC700',
                                        borderRadius: '18px'
                                    }}>
                                    <div className="card-body text-center">
                                        <FaRegCalendarPlus size={18} color="#FFFFFF" />
                                    </div>
                                </div>
                            </div>
                            <div className="ovver-view-item-content text-center">
                                <div className="title-overview">Tổng cuộc hẹn</div>
                                <div className="row text-center">
                                    <div className="col text-center">
                                        <h4 className="amount-ovverview">150</h4>
                                    </div>
                                    <div className="col text-center">
                                        <div
                                            className="percen-reduced-overview text-center"
                                            style={{ textAlign: 'center' }}>
                                            <span className="text-center">-11%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={3}>
                        <div
                            className="ovver-view-item"
                            style={{
                                background: '#FFF5F8',
                                borderRadius: 8,
                                height: 120,
                                margin: '12px'
                            }}>
                            <div className="ovver-view-item-icon">
                                <div
                                    className="card"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: '#50CD89',
                                        borderRadius: '18px'
                                    }}>
                                    <div className="card-body text-center">
                                        <FaRegMoneyBillAlt size={18} color="#FFFFFF" />
                                    </div>
                                </div>
                            </div>
                            <div className="ovver-view-item-content text-center">
                                <div className="title-overview">Tổng doanh thu</div>
                                <div className="row text-center">
                                    <div className="col text-center">
                                        <h4 className="amount-ovverview">100000</h4>
                                    </div>
                                    <div className="col percen-increase-overview text-center">
                                        +11%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
export default OverView;
