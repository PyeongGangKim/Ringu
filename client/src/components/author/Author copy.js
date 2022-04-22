import React, { Component, Fragment } from 'react';

import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/common/common.scss';
import '../../scss/common/input.scss';
import '../../scss/common/tab.scss';
import '../../scss/author/author.scss';
import '../../scss/book/book.scss';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import AuthorNavbar from '../../components/author/AuthorNavbar';

import Helmet from 'react-helmet';
import string from '../../config/str';

class Author extends Component {
    constructor(props) {
        super(props)

        //this.introRef = React.createRef();
        //this.bookRef = React.createRef();
        //this.reviewRef = React.createRef();

        this.state = {
            bookList: {},
            selectedBook: {},

            user: {
                id: -1,
                description: '',
            },

            //
            display:false,
            modify: false,
            modifyDetail: -1,
            modifyDetailId: -1,
            upload: false,

            modalPos:{},
            host: false,
            book: {title:"", filename:"선택 파일 없음", file:null},
        }
    }

    async componentDidMount() {
        var state = this.state;

        try {
            const userRes = await API.sendGet(URL.api.member.getById + this.props.authorId)
            if(userRes.status === 200) {
                var user = userRes.data.user

                state.user = user
                this.setState(state)
            }

            this.setState(state)

        } catch (e) {
            console.log(e)
        }
    }

    handleDescriptionChange = (evt) => {
        var state = this.state;
        state.user.description = evt.target.value;
        this.setState(state)
    }

    handleDetailDelete = async(detail) => {
        var state = this.state;

        if(window.confirm(`${detail.title}을 삭제하시겠습니까?`)) {
            const res = await API.sendDelete(URL.api.book_detail.delete + detail.id)
            if(res.status === 200) {
                state.detailList = state.detailList.filter(item => {
                    return item.id !== detail.id
                })
                this.setState(state)
            } else {
                alert("삭제하지 못 했습니다.")
            }
        }
    }

    render() {
        var state = this.state;
        return (
            <div id="author-page" className="page2">
                <Helmet title={`${state.user.nickname} `+ string.author + string.postfix}/>
                
                <AuthorNavbar
                    user={state.user}
                    isHost={this.props.isHost}
                    authorId={this.props.authorId}
                />
            </div>
        )
    }
}

export default Author;
