import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';
import {Oval} from 'react-loader-spinner'

import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/loading.scss'
import '../../scss/search/search.scss'

import Book from '../../components/book/Book'

import User from '../../utils/user';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import string from '../../config/str';

import Modal from '../../components/modal/Modal';


class Search extends Component {
    constructor(props) {
        super(props);

        this.search = props.search

        this.state = {
            searchList: [],
            count: 0,
            categoryList: [],
            category: "카테고리",
            selected: new Set([]),
            newSelected: new Set([]),
            filter: 1,
            display: 0,
            keyword: this.search.get('keyword'),
            order: [],
            isCategorySearch: false,
            isLoading: true,
        };
    }

    async componentDidMount() {
        var state = this.state;        

        if(this.search.has('keyword') || this.search.has('category')) {
            try {
                state.isLoading = true;
                if(!this.search.has('keyword') && this.search.has('category')) {
                    state.isCategorySearch = true;
                    state.selected = [parseInt(this.search.get('category'))]
                    state.newSelected = [parseInt(this.search.get('category'))]
                }
                else {
                    if (this.search.has('category')) {
                        var selectedCategories = this.search.get('category').split('|').map((x) => parseInt(x))
                        state.selected = new Set(selectedCategories);
                        state.newSelected = new Set(selectedCategories);
                        if(selectedCategories.length !== 0) {
                            state.category = "선택됨"
                        }
                    }
                }

                const categoryRes = await API.sendGet(URL.api.category.list)
                    if(categoryRes.status === 200){
                        state.categoryList = categoryRes.data.categoryList
                    }

                if (this.search.has('filter') && this.search.has('order')) {
                    var filter = this.search.get('filter')
                    var order = this.search.get('order')
                    state.order = [filter, order]
    
                    if(filter === 'recent') {
                        state.filter = 1
                    }
                    else if(filter === 'score') {
                        state.filter = 2
                    }
                    else if(filter === 'title') {
                        if(order === 'asc') {
                            state.filter = 3
                        }
                        else {
                            state.filter = 4
                        }
                    }
                }

                this.handleSearch(false)
            }
            catch(e) {
                console.log(e)
                state.isLoading = false;
            }
        }

        this.setState(state);
    }

    handleDisplayClick = (value) => {
        var state = this.state;
        state.display = value;
        this.setState(state)
    }

    handleCloseClick = () => {
        var state = this.state;
        state.newSelected = state.selected;
        state.display = 0;
        this.setState(state)
    }

    handleCategoryClick = (id) => {
        var state = this.state;
        var newSelected = new Set([...state.newSelected])

        if(newSelected.has(id)){
            newSelected.delete(id)
        }
        else {
            newSelected.add(id)
        }
        
        state.newSelected = newSelected;

        this.setState(state)
    }

    handleCategoryCompleteClick = async() => {
        var state = this.state;

        state.selected = state.newSelected;
        state.display = false;
        this.setState(state)

        this.handleUpdateSearch()
    }

    handleFilterChange = (e, filter) => {
        var state = this.state;
        state.filter = parseInt(e.target.value);
        state.order = filter
        this.setState(state)
        this.handleUpdateSearch()
    }

    handleSearch = async(mounted) => {
        var state = this.state;
        var params = {
            member_id: (User.getInfo() !== null ? User.getInfo().id : null),
            is_approved: 1,
            keyword: state.keyword,
        }

        if (Array.from(state.selected).length !== 0) {
            params['categories'] = Array.from(state.selected)
        }

        if (state.order.length !== 0) {
            params['order'] = state.order[0]
            params['orderBy'] = state.order[1]
        }
        
        try {
            const res = await API.sendGet(URL.api.book.list, params = params)
            if(res.status === 200) {
                state.searchList = res.data.bookList;
                if(mounted) {
                    this.handleUpdateSearch()
                }
            }
            state.isLoading = false;
        } catch(e) {
            state.isLoading = false;
            console.error(e)
            alert("검색에 실패하였습니다.")
        }
        
        this.setState(state);
    }

    handleUpdateSearch = () => {
        var state = this.state;
        var search = '?'
        if(!state.isCategorySearch) {
            search += `keyword=${encodeURIComponent(state.keyword)}&`
        }

        var categories = Array.from(state.selected)
        if (categories.length !== 0){
            search += `category=${encodeURIComponent(Array.from(state.selected).join('|'))}`
        }

        if (state.order.length !== 0) {
            search += `&filter=${encodeURIComponent(state.order[0])}&order=${encodeURIComponent(state.order[1])}`
        }

        window.location = URL.service.search + search
    }

    render() {
        var searchList = this.state.searchList
        var state = this.state;
        
        return (
            state.isLoading ?
            <div className="loading-container">
                <Oval
                    ariaLabel="loading-indicator"
                    width={100}
                    height={100}
                    strokeWidth={3}
                    color="#c2c2c2"
                    secondaryColor="#d5d5d5"
                />
            </div>
            :
            <div id="wrap">
                <Helmet title={`${!this.search.has('keyword') && state.categoryList.length > 0 ? state.categoryList.filter(x => x.id === parseInt(this.search.get('category')))[0].name : this.search.get('keyword')}` + string.search + string.postfix}/>
                <div id="search" className="page1">
                    {
                        state.display > 0 &&
                        <Modal
                            onClose={this.handleCloseClick}
                            overlay={true}
                        >
                            {
                                state.display === 1 &&
                                <div className="search-modal">
                                    <div className="header"> 카테고리 </div>
                                    <em className="close" onClick={this.handleCloseClick}> &times; </em>
                                    <ul className="category-box">
                                        {
                                            state.categoryList.map((item, idx) => {
                                                return (
                                                    <li key={item.id} className={state.newSelected.has(item.id) ? "category selected" : "category"} onClick={() => this.handleCategoryClick(item.id)}>
                                                        {item.name}
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <button className="btn btn-block btn-bottom btn-outline-1" onClick={this.handleCategoryCompleteClick}>
                                        완료
                                    </button>
                                </div>
                            }
                            {
                                state.display === 2 &&
                                <div className="search-modal">
                                    <div className="header"> 정렬 </div>
                                    <em className="close" onClick={this.handleCloseClick}> &times; </em>
                                    <div className="filter-box">
                                        <label htmlFor="recent" className="radio-container">
                                            최신순
                                            <input type="radio" id="recent" name="recent" value="1" checked={state.filter === 1 ? true : false} onChange={(e) => this.handleFilterChange(e, ['created_date_time', 'desc'])}/>
                                            <span className="checkmark"/>
                                        </label>
                                        <label htmlFor="score" className="radio-container">
                                            평점순
                                            <input type="radio" id="score" name="score" value="2" checked={state.filter === 2 ? true : false} onChange={(e) => this.handleFilterChange(e, ['score', 'desc'])}/>
                                            <span className="checkmark"/>
                                        </label>
                                        <label htmlFor="titleAsc" className="radio-container">
                                            제목순 (오름차순)
                                            <input type="radio" id="titleAsc" name="titleAsc" value="3" checked={state.filter === 3 ? true : false} onChange={(e) => this.handleFilterChange(e, ['title', 'asc'])}/>
                                            <span className="checkmark"/>
                                        </label>
                                        <label htmlFor="titleDesc" className="radio-container">
                                        <input type="radio" id="titleDesc" name="titleDesc" value="4" checked={state.filter === 4 ? true : false} onChange={(e) => this.handleFilterChange(e, ['title', 'desc'])}/>
                                            제목순 (내림차순)
                                            <span className="checkmark"/>
                                        </label>
                                    </div>
                                </div>
                            }
                        </Modal>
                    }

                    <div className="title-wrap">
                        {
                            state.isCategorySearch ?
                            <h2 className="title">{`카테고리 '${state.categoryList.filter(x => x.id === parseInt(this.search.get('category')) )[0].name}'`} 검색 결과 ({state.searchList.length} 건)</h2>
                            :
                            <h2 className="title">{`'${this.search.get('keyword')}'`} 검색 결과 ({state.searchList.length} 건)</h2>
                        }
                    </div>

                    <div className="filter-area">
                        {
                            !state.isCategorySearch &&
                            <div className="filter" onClick={() => this.handleDisplayClick(1)}>
                                <span> {state.category}</span>
                                <em/>
                            </div>
                        }
                        
                        {
                            state.searchList.length !== 0 &&
                            <div className="filter" onClick={() => this.handleDisplayClick(2)}>
                                <span> 정렬</span>
                                <em/>
                            </div>
                        }
                    </div>

                    {
                        state.searchList.length === 0 ?
                        <div className="no-content">
                            검색 결과가 없습니다.
                        </div>
                        :
                        <div id="search-list" className="book-area">
                            <div className="container">
                                {
                                    searchList.map(item => {
                                        var status = ""
                                        if (item.type === 2) {
                                            status = "pub"
                                        }
                                        else if (item.is_finished) {
                                            status = "ser-ed"
                                        }
                                        else {
                                            status = "ser"
                                        }
                                        return (
                                            <Book
                                                key={item.id}
                                                book={item}
                                                status={status}
                                                favorite
                                            />
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Search;
