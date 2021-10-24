import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { LineChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import moment from 'moment';

import User from '../../utils/user';
import '../../scss/author/payment.scss';
import '../../scss/common/button.scss';
import '../../scss/common/common.scss';
import '../../scss/common/tab.scss';

import date from '../../helper/date';
import parse from '../../helper/parse';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import Modal from '../../components/modal/Modal';

class Payment extends Component {
    constructor(props) {
        super(props)

        this.periodOptions = [
            {value: 0, label: "1년"},
            {value: 1, label: "6개월"},
            {value: 2, label: "3개월"},
            {value: 3, label: "1개월"},
        ]

        this.user = User.getInfo();
        this.state = {
            type: 0,
            bank: null,
            account: null,
            profile: null,
            name: null,
            data: [],
            period: {value: 0, label: "1년"},
            ticks: [],
            remitted: 0,
            balance: 0,
            is_waiting: false,
        }
    }

    async componentDidMount() {
        var state = this.state;
        try {
            const authorRes = await API.sendGet(URL.api.author.get, {id: this.user.id})
            if(authorRes.status === 200) {
                var author = authorRes.data.author;
                state.bank = author.bank_bank.label;
                state.account = author.account;
                state.name = author.name;
                state.profile = author.profile;
                state.is_waiting = author.is_waiting;

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }
        try {
            const amountRes = await API.sendGet(URL.api.purchase.sales_amount_author, {author_id: this.user.id})

            if(amountRes.status === 200) {
                var amount = amountRes.data.amount;
                var a = []
                a.push(amount.filter(item => item.remit_status === 0)[0])
                a.push(amount.filter(item => item.remit_status === 1)[0])
                a.push(amount.filter(item => item.remit_status === 2)[0])

                state.balance = (!!a[0] ? parseInt(a[0].amount) : 0) + (!!a[1] ? parseInt(a[1].amount) : 0);
                state.remitted = (!!a[2] ? parseInt(a[2].amount) : 0)

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }
        this.makeTicks();
    }

    handlePeriodChange = (value) => {
        var state = this.state;
        state.period = value;
        this.makeTicks();
        this.setState(state)
    }

    makeTicks = async() => {
        var state = this.state;

        try {
            const salesRes = await API.sendGet(URL.api.purchase.sales, {author_id: this.user.id, period: state.period.value})
            if(salesRes.status === 200) {
                var sales = salesRes.data.sales;
                sales.forEach(sale => {
                    var date = new Date(sale.date)
                    sale.date = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
                });
                state.data = sales;
                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }

        var now = new Date()
        var base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        state.ticks = [base.getTime()]

        for(var i = 0; i < 11; i++) {
            if(state.period.value === 0) {
                state.ticks.push(date.subtract(base, 'm', 1*(i+1)).getTime())
            } else if(state.period.value === 1) {
                state.ticks.push(date.subtract(base, 'd', 15*(i+1)).getTime())
            } else if(state.period.value === 2) {
                state.ticks.push(date.subtract(base, 'd', 7*(i+1)).getTime())
            } else if(state.period.value === 3) {
                state.ticks.push(date.subtract(base, 'd', 3*(i+1)).getTime())
            }
        }

        this.setState(state);
    }

    handleFilterChange = (type) => {
        var state = this.state;
        if(state.type === type) {
            return;
        }
        state.type = type;
        state.period = {value:0, label:"1년"}

        if(type === 0) {
            this.makeTicks();
        }
        this.setState(state);
    }

    handleWithdraw = async(status) => {
        var state = this.state;
        if(state.balance === 0) {
            alert('출금 가능한 잔액이 없습니다.')
            return 0;
        }
        try {
            const res = await API.sendPost(URL.api.withdrawal.create, {amount: state.balance})
            if(res.status === 201) {
                alert("출금 신청이 완료되었습니다.")
            }
        }
        catch(e) {
            console.error(e)
            alert("출금 신청이 실패하였습니다.")
        }
    }

    dateFormatAxis = (tick) => {
        var state = this.state;
        if (state.period.value === 0) {
            return moment(tick).format('MMM YY');
        } else {
            return moment(tick).format('MM.D');
        }

    }
    render() {
        var state = this.state;

        const selectStyles = {
            control: (styles, { isFocused }) => ({
                ...styles,
                border: isFocused ? '2px solid var(--color-1)' : '2px solid #ddd',
                transition: '0.5s',
                boxShadow: '0',
                ':hover': {
                    border: '2px solid var(--color-1)',
                },
            }),
            valueContainer: (styles, {  }) => ({
                ...styles,
                width: '60px',
                height: '36px',
            }),
        }

        return (
            <div className="payment">
                <div className="information">
                    <div className="author">
                        <div className="profile">
                            <img src={!!state.profile ? state.profile : "blank.jpg"}/>
                        </div>

                        <div className="info">
                            <h3 className="nickname"> {state.name} </h3>
                            <span className="account"> 출금계좌: {state.bank} {state.account}</span>
                        </div>

                    </div>

                    <div className="stats">
                        <div className="box">
                            <h4 className="header">총 판매량</h4>
                            <div className="value">150</div>
                        </div>
                        {/*<div className="box">
                            <h4 className="header">오늘의 방문자</h4>
                            <div className="value">97</div>
                        </div>*/}
                        <div className="box">
                            <h4 className="header">오늘의 주문수</h4>
                            <div className="value">15</div>
                        </div>

                    </div>
                </div>

                <div className="revenue">
                    <div className="withdraw">
                        <div className="box">
                            <div className="header">출금가능 수익금</div>
                            <div className="value">{parse.numberWithCommas(state.balance)}</div>
                            {
                                state.is_waiting ?
                                <button className="btn btn-color-2" disabled>출금 중</button>
                                :
                                <button className="btn btn-color-2" onClick={this.handleWithdraw}>출금 신청</button>
                            }

                        </div>
                        <hr/>
                        <div className="box">
                            <div className="header">출금완료 수익금</div>
                            <div className="value">{parse.numberWithCommas(state.remitted)}</div>
                        </div>
                    </div>
                    <div className="chart">
                        <div className="menu">
                            <ul className="filter">
                                <li>
                                    <button className={state.type === 0 && "active"} onClick={() => this.handleFilterChange(0)}>전체</button>
                                </li>
                                <li>
                                    <button className={state.type === 1 && "active"} onClick={() => this.handleFilterChange(1)}>제품별</button>
                                </li>
                                <li>
                                    <button className={state.type === 2 && "active"} onClick={() => this.handleFilterChange(2)}>판매비율</button>
                                </li>
                            </ul>
                            <Select
                                value={state.period}
                                options={this.periodOptions}
                                onChange={value => this.handlePeriodChange(value)}
                                styles={selectStyles}
                                isSearchable={false}
                                placeholder={""}/>
                        </div>
                        <div className="canvas">
                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >
                                {
                                    state.type === 0 ?
                                    <AreaChart data={state.data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5
                                    }}>
                                        <XAxis type="number" dataKey="date" ticks={state.ticks} domain={[state.ticks[11], state.ticks[0]]} tickCount={12} tickFormatter={this.dateFormatAxis} interval={0}/>
                                        <YAxis dataKey="revenue" />
                                        <Tooltip labelFormatter={t => moment(t).format('YYYY.M.D')}/>
                                        <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                    :
                                    state.type === 1 ?
                                    <LineChart data={state.data}>
                                        <XAxis dataKey="name" />
                                        <YAxis orientation="right"/>
                                        <Tooltip />
                                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                    </LineChart>
                                    :
                                    <AreaChart data={state.data}>
                                        <XAxis dataKey="name" />
                                        <YAxis orientation="right"/>
                                        <Tooltip/>
                                        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                                    </AreaChart>
                                }
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="history">
                </div>
            </div>
        )
    }
}

export default Payment;
