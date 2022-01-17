import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom';
import Select from 'react-select'
import { BarChart, LineChart, AreaChart, PieChart, Area, Cell, Bar, Pie, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
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

        this.user = User.getInfo();
        this.currentYear = new Date().getFullYear();
        this.state = {
            modal: false,
            type: 0,
            bank: null,
            account: null,
            profile: null,
            name: null,
            data: [],
            year: {value: this.currentYear, label: `${this.currentYear}`},
            remitted: 0,
            balance: 0,
            balance2: 0,
            withdrawal: 0,
            is_waiting: false,
            tabIndex: 0,
            sales: [],
            total: [],
            state: [],
            withdrawals: [],
            yearOptions: [{value: this.currentYear, label: `${this.currentYear}`}],
            books: [],
        }
    }

    onTabSelect = (idx) => {var state = this.state; state.tabIndex = idx; this.setState(state) }

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

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }
        try {
            const salesRes = await API.sendGet(URL.api.purchase.sales_author, {author_id: this.user.id})

            if(salesRes.status === 200) {
                state.sales = salesRes.data.sales;

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
                state.balance = amount.amount_available_withdrawal;
                state.balance2 = amount.amount_available_withdrawal;
                state.remitted = amount.total_withdrawal_amount;
                //state.is_waiting = amount.request_withdrawal_amount !== 0;

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }

        try {
            const withdrawalsRes = await API.sendGet(URL.api.withdrawal.get, {author_id: this.user.id})
            if(withdrawalsRes.status === 200) {
                state.withdrawals = withdrawalsRes.data.withdrawals;

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }
        this.filter0(this.currentYear, true);
    }

    handleYearChange = (value) => {
        var state = this.state;
        state.year = value;
        this.filter0(state.year.value);
        this.setState(state)
    }

    filter0 = async(year, init=false) => {
        var state = this.state;
        var params = {
            author_id: this.user.id,
            year: year
        }

        try {
            const salesRes = await API.sendGet(URL.api.purchase.sales, params)
            console.log(salesRes)
            if(salesRes.status === 200) {
                var sales = salesRes.data.sales;
                var data = []

                for(var i = 0; i < 12; i++) {
                    data.push({
                        y: year,
                        m: i+1,
                        revenue: 0,
                        count: 0})
                }

                for(var i = 0; i < sales.length; i++) {
                    var m = sales[i].m;
                    data[m-1] = sales[i];
                }

                if(init) {
                    var years = salesRes.data.years;
                    if(years.length ===0) {

                    } else {
                        var year = []
                        for(var i = 0; i < years.length; i++) {
                            year.push({value: years[i].y, label: `${years[i].y}년`})
                        }

                        state.yearOptions = year;
                        state.year = year[0];
                    }
                }

                state.data = data;
                this.setState(state)
            } else if(salesRes.status === 204) {
                state.data = [];
                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }

        this.setState(state);
    }

    filter1 = async(year, init=false) => {
        var state = this.state;
        var params = {
            author_id: this.user.id,
            year: year
        }
        console.log()
        try {
            const salesRes = await API.sendGet(URL.api.purchase.sales_book, params)
            if(salesRes.status === 200) {
                var sales = salesRes.data.sales;
                var stats = salesRes.data.stats;
                var books = salesRes.data.books;

                var data = []
                var map = {}
                for(var i = 0; i < 12; i++) {
                    var d = {y: year, m:i+1}
                    for(var j=0; j < books.length; j++){
                        d[books[j].book_title] = 0
                    }
                    d['etc.'] = 0
                    data.push(d)
                }

                for(var i = 0; i < sales.length; i++) {
                    var m = sales[i].m;
                    data[m-1][sales[i].book_title] = sales[i].revenue;
                }

                state.books = books;
                state.stats = stats;
                state.data = data;

                this.setState(state)
            } else if(salesRes.status === 204){
                state.data = [];

                this.setState(state)
            }
        }
        catch(e) {
            console.error(e)
        }

        this.setState(state);
    }

    filter2 = async() => {
        var state = this.state;
        var params = {
            author_id: this.user.id,
        }

        try {
            const salesRes = await API.sendGet(URL.api.purchase.sales_ratio, params)
            if(salesRes.status === 200) {
                var sales = salesRes.data.sales;
                state.data = sales
                state.total = salesRes.data.total[0];
                for(var i = 0; i < sales.length; i++) {
                    sales[i].value = parseInt(sales[i].value)
                }
                this.setState(state)
            } else if(salesRes.status === 204) {
                state.data = []
            }
        }
        catch(e) {
            console.error(e)
        }

        this.setState(state);
    }

    handleFilterChange = (type) => {
        var state = this.state;
        if(state.type === type) {
            return;
        }
        state.type = type;

        if(type === 0) {
            this.filter0(this.currentYear);
        } else if(type === 1) {
            this.filter1(this.currentYear);
        } else {
            this.filter2();
        }

        this.setState(state);
    }

    handleWithdrawalChange = (e) => {
        var state = this.state;
        var value  = e.target.value;
        state.balance2 = state.balance;

        if(value > state.balance2) {
            state.withdrawal = state.balance2;
            state.balance2 = 0;
        } else {
            state.balance2 -= value;
            state.withdrawal = value
        }

        this.setState(state)
    }

    handleWithdraw = async() => {
        var state = this.state;
        if(state.withdrawal === 0) {
            alert('출금할 금액을 입력해주세요.')
            return 0;
        }
        try {
            const res = await API.sendPost(URL.api.withdrawal.create, {amount: state.withdrawal})
            if(res.status === 201) {
                alert("출금 신청이 완료되었습니다.")
                state.modal = false;
                state.balance -= state.withdrawal;
                state.is_waiting = true;
                this.setState(state);
            }
        }
        catch(e) {
            console.error(e)
            alert("출금 신청이 실패하였습니다.")
        }
    }

    showModal = () => { var state = this.state; state.modal = true; this.setState(state); }

    handleCloseClick = () => { var state = this.state; state.modal = false; this.setState(state) }

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

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7C51F0', '#F9ED0F'];

        return (
            <div className="payment">
                {
                    state.modal > 0 &&
                    <Modal
                        onClose={this.handleCloseClick}
                        overlay={true}
                        fixed={true}
                    >
                        <div className="withdraw-modal">
                            <div className="header"> 출금 신청 </div>
                            <em className="close" onClick={this.handleCloseClick}> &times; </em>
                            <div className="box">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>출금 가능 금액</td>
                                            <td><input type="text"autoComplete="off" disabled={true} className="input" value={parse.numberWithCommas(state.balance2)}/></td>
                                            <td>원</td>
                                        </tr>
                                        <tr>
                                            <td>출금 신청 금액</td>
                                            <td>
                                                <input type="number"autoComplete="off" className="input" value={state.withdrawal} onChange={this.handleWithdrawalChange}/>
                                            </td>
                                            <td>원</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button className="btn btn-color-2" onClick={this.handleWithdraw}>
                                    출금 신청
                                </button>
                            </div>
                        </div>
                    </Modal>
                }
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
                            <div className="value">0</div>
                        </div>
                        {/*<div className="box">
                            <h4 className="header">오늘의 방문자</h4>
                            <div className="value">97</div>
                        </div>*/}
                        <div className="box">
                            <h4 className="header">오늘의 주문수</h4>
                            <div className="value">0</div>
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
                                <button className="btn btn-color-2" onClick={this.showModal}>출금 신청</button>
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
                                value={state.year}
                                options={state.yearOptions}
                                onChange={value => this.handleYearChange(value)}
                                styles={selectStyles}
                                isSearchable={false}
                                placeholder={""}/>
                        </div>
                        <div className="canvas">
                            {
                                state.type === 0 ?
                                state.data.length === 0 ?
                                <div className="no-content">
                                    판매 내역이 없습니다.
                                </div>
                                :
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart data={state.data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5
                                    }}>
                                        <XAxis dataKey="m"/>
                                        <YAxis dataKey="revenue" />
                                        <Tooltip/>
                                        <Bar dataKey='revenue' fill='#5c4ce5'/>
                                    </BarChart>
                                </ResponsiveContainer>
                                :
                                state.type === 1 ?
                                state.data.length === 0 ?
                                <div className="no-content">
                                    판매 내역이 없습니다.
                                </div>
                                :
                                <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                >
                                    <BarChart data={state.data}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5
                                    }}>
                                        <XAxis dataKey="m"/>
                                        <YAxis />
                                        <Tooltip/>
                                        {
                                            state.books.map((item, idx) => {
                                                return (
                                                    <Bar dataKey={item.book_title} stackId="a" fill={COLORS[idx % COLORS.length]}/>
                                                )
                                            })
                                        }

                                    </BarChart>
                                </ResponsiveContainer>
                                :
                                state.data.length === 0 ?
                                <div className="no-content">
                                    판매 내역이 없습니다.
                                </div>
                                :
                                <div className="container">
                                    <div className="content">
                                        <div className="header">
                                            <div className="total">{parse.numberWithCommas(state.total.value)} 원</div>
                                            <div className="sub">총 판매량</div>
                                        </div>
                                        <table>
                                            <tbody>
                                                {
                                                    state.data.map((data, idx)=>{
                                                        return (
                                                            <tr className="row">
                                                                <td>{parse.numberWithCommas(data.value) + " 원"}</td>
                                                                <td ><div className="circle" style={{"backgroundColor" : COLORS[idx]}}/></td>
                                                                <td>{data.book_title}</td>
                                                                <td>{Math.round(data.value / state.total.value * 100, 0)}%</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart width={400} height={400}>
                                            <Pie
                                                data={state.data}
                                                dataKey="value"
                                                nameKey="book_title"
                                                cx="800"
                                                cy="50%"
                                                outerRadius={100}
                                                fill='#5c4ce5'
                                                label
                                            >
                                                {state.data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="history">
                    <Tabs defaultIndex={0} onSelect={idx => this.onTabSelect(idx)}>
                        <TabList>
                            <Tab>수익금 내역</Tab>
                            <Tab>출금 내역</Tab>
                        </TabList>

                        <TabPanel>
                            {
                                state.sales.length === 0 ?
                                <div className="no-content">
                                    수익금 내역이 없습니다.
                                </div>
                                :
                                <div className="table-box">
                                    <table>
                                        <tbody>
                                            {
                                                state.sales.map(item => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td>완료</td>
                                                            <td>
                                                                <div className="price">{parse.numberWithCommas(Math.ceil(item.price * (1 - item.charge / 100)))}원</div>
                                                                <div className="order">
                                                                    <span>주문번호 : {item.id}</span>
                                                                    <span>주문 접수일 : {date.fullFormat(item.created_date_time)}</span>
                                                                    <span>주문자 : {item.buyer}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            }
                        </TabPanel>
                        <TabPanel>
                            {
                                state.withdrawals.length === 0 ?
                                <div className="no-content">
                                    출금 내역이 없습니다
                                </div>
                                :
                                <div className="table-box">
                                    <table>
                                        {
                                            state.withdrawals.map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.is_remittance === 1 ? "완료" : "출금 준비 중"}</td>
                                                        <td>
                                                            <div className="price">{parse.numberWithCommas(item.amount)}원</div>
                                                            <div className="order">
                                                                <span>출금번호 : {item.id}</span>
                                                                <span>출금일 : {date.fullFormat(item.remitted_date_time)}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </table>
                                </div>
                            }
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default Payment;
