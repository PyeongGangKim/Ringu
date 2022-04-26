import React, { Component, Fragment } from 'react';

import '../../scss/main/main.scss'
import '../../scss/common/common.scss'
import '../../scss/common/button.scss'
import '../../scss/common/slick.scss'

import GuideModal from '../../components/home/GuideModal'
import CategoryItem from '../../components/home/CategoryItem'
import BookSlider from '../../components/home/BookSlider'
import IntroductionSlider from '../../components/home/IntroductionSlider'

import User from '../../utils/user';
import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class Main extends Component {
    user = User.getInfo();
    guide = localStorage.getItem("guide");
    
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            keyword: "",
            recommendBookList: [],
            latestBookList: [],
            categories: [],
        };
    }

    async componentDidMount() {
        let state = this.state;
        let params = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_picked: 1,
        }
        let latestBookParams = {
            member_id: User.getInfo() ? User.getInfo().id : null,
            is_approved: 1,
        }

        try {
            const res = await API.sendGet(URL.api.category.list)
            if(res.status === 200) {
                state.categories = res.data.categoryList;
                this.setState(state);
            }
        } catch(e) {
            console.error(e)
        }

        try {
            const res = await API.sendGet(URL.api.book.list, params);
            const latestRes = await API.sendGet(URL.api.book.list, latestBookParams);

            if(res.status === 200) state.recommendBookList = res.data.bookList;
            if(latestRes.status === 200) state.latestBookList = latestRes.data.bookList;
            if(res.status === 200 || latestRes.status === 200) this.setState(state);

        } catch(e) {
            console.error(e)
        }
    }

    handleKeywordChange = (evt) => {
        var state = this.state; 
        state.keyword = evt.target.value;
        
        this.setState(state);
    }

    render() {
        var state = this.state;

        return (
            <div id="wrap">
                {
                    this.guide !== '1' &&
                    <GuideModal/>
                }
                
                <IntroductionSlider
                    user={this.user}
                />

                <div id="home" className="page1">
                    <div className="category-wrap">
                        {
                            state.categories.map((category, idx) => {
                                return(
                                    <CategoryItem
                                        category={category}
                                        idx={idx}
                                        key={category.id}
                                    />
                                )
                            })
                        }
                    </div>
                    {
                        state.latestBookList.length > 0 &&
                        <BookSlider
                            title = {"NEW"}
                            bookList = {state.latestBookList}
                        />
                    }

                    {
                        state.recommendBookList.length > 0 &&
                        <BookSlider
                            title = {"MD's Pick"}
                            bookList = {state.recommendBookList}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default Main;
