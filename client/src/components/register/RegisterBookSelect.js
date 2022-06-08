import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import Select from 'react-select'

import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/book.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

class RegisterBookSelect extends Component {
    constructor(props) {
        super(props)

        this.state = {
            category: "",
            type:"",
            categoryOptions: [],
            typeOptions: [
                {value: 2, label: "단행본"},
                {value: 1, label: "연재본"},
            ]
        }
    }

    handleCategoryChange = (evt) => {
        var state = this.state
        state.category = evt.value;
        this.setState(state)
    }

    handleTypeChange = (evt) => {
        var state = this.state
        state.type = evt.value;
        this.setState(state)
    }

    handleNext = () => {
        var state = this.state;
        this.props.history.push({
            pathname: URL.service.register.book + state.type,
            state: {
                        type: state.type,
                        category: state.category,
                    }
        })
    }

    async componentDidMount() {
        var state = this.state

        const res = await API.sendGet(URL.api.category.list)
        if(res.status === 200) {
            var data = res.data.categoryList
            var categories = []
            for(var i=0; i < data.length; i++) {
                categories.push({value:data[i].id, label:data[i].name})
            }
            this.state.categoryOptions = categories;
            this.setState(state);
        }
    }

    render() {
        let state = this.state

        const selectStyles = {
            valueContainer: (styles, {  }) => ({
                ...styles,
                height: '50px',
            }),
        }

        return (
            <div id="register-book" className="page3">
                <div className="title-wrap">
                    <h2 className="title">새 작품 등록하기</h2>
                </div>

                <hr/>
                <div className="content">
                    <div className="select-container">
                        <div className="select-wrap">
                            <div className="select-box">
                                <h3 className="header">
                                    카테고리 설정
                                </h3>
                                <Select
                                    options={state.categoryOptions}
                                    onChange={evt => this.handleCategoryChange(evt)}
                                    isSearchable={false}
                                    placeholder={""}
                                    styles={selectStyles}/>
                            </div>

                            <div className="select-box">
                                <h3 className="header">
                                    출간 방식
                                </h3>
                                <Select
                                    options={state.typeOptions}
                                    onChange={evt => this.handleTypeChange(evt)}
                                    isSearchable={false}
                                    placeholder={""}
                                    styles={selectStyles}/>
                            </div>
                        </div>

                        <button className="btn btn-block btn-color-2 next" onClick={this.handleNext}>
                            다음
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RegisterBookSelect);
