import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import Modal from '../../components/modal/Modal';
import Paging from '../../components/common/Paging'

import API from '../../utils/apiutils';

class SeriesListModal extends Component {
    constructor(props) {
        super(props)
        this.book = this.props.book;

        this.state = {
            detailList: [],
            detailTotal: 0,
            detailPage: 1,

            modifyDetailIdx: -1,
            modifyDetailId: -1,
            oldIdx: -1,
            oldTitle: '',

            book: {},
            upload: false,
        }
    }

    async componentDidMount() {

    }

    handleTitleChange = (evt, idx) => {
        var state = this.state;
        if(idx < 0) {
            state.book.title = evt.target.value;
        } else {
            state.detailList[idx].title = evt.target.value;
        }

        this.setState(state);
    }

    handleCloseClick = () => {
        this.props.closeModal();
    }

    handleModifyFileClick = async(evt, idx) => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.book.filename = '선택 파일 없음';
            state.book.file = null;
            this.setState(state);
            return;
        }

        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        state.book.filename = file.name;
        state.book.file = file;

        this.setState(state);
    }

    handleBookFileChange = evt => {
        var state = this.state
        var file = evt.target.files[0]

        if(!file) {
            state.book.filename = "선택 파일 없음"
            state.book.file = null
            this.setState(state)
            return;
        }
        var token = file.name.split('.')
        var fieldName = token[token.length - 1]

        if(fieldName.toLowerCase() !== 'pdf') {
            alert('PDF 파일만 업로드 해주세요.')
            return;
        }

        state.book.filename = file.name
        state.book.file = file

        this.setState(state)
    }

    handleUploadClick = (value) => {
        var state = this.state
        state.upload = value
        if(value === false) {
            if(state.oldIdx >= 0) {
                state.detailList[state.oldIdx].title = state.oldTitle;
            }
            state.modifyDetail = -1;
            state.modifyDetailId = -1;
            state.oldIdx = -1;
            state.oldTitle = '';
            state.book = {title:"", name:"선택 파일 없음", file:null}
        }
        this.setState(state)
    }

    downloadAction = async(book_detail_id) => {
        const res = await API.sendGet(URL.api.book.download+ "/" + book_detail_id + "?type=" + "file");
        let downloadUrl = res.data.url;
        window.open(downloadUrl);
    }

    handleRegister = async() => {
        var state = this.state;
        if(state.upload) {
            if(state.book.title === "") {
                alert("제목을 입력해주세요")
                return;
            }

            if(state.book.file === null) {
                alert("등록할 파일을 선택해주세요")
                return;
            }

            const data = new FormData()

            var file = state.book.file
            var blob = file.slice(0, file.size, file.type)
            var newFile = new File([blob], state.selectedBook.title + "_" +(state.detailTotal+1) + ".pdf", {type: file.type})

            data.append("page_number", null)
            data.append("file", newFile)
            data.append("book_id", state.selectedBook.id)
            data.append("title", state.book.title)
            data.append("round", state.detailTotal+1)

            try {
                const res = await API.sendData(URL.api.register.bookDetail, data)
                if(res.status === 201) {
                    var detail = res.data.detail
                    state.book = {title:"", name:"선택 파일 없음", file:null}
                    state.detailTotal = state.detailTotal + 1
                    state.upload = false;
                    this.handlePageChange(1);
                    alert("작품을 등록하였습니다!")
                    this.setState(state);
                }
            } catch(e) {
                alert("등록 실패하였습니다.")
            }
        }
        else {
            var idx = state.modifyDetail;
            var selectedDetail = state.detailList[idx]

            if(state.book.file === null && state.oldTitle === selectedDetail.title) {
                state.modifyDetail = -1;
                state.modifyDetailId = -1;
                state.oldIdx = -1;
                state.oldTitle = '';
                this.setState(state);
                return;
            }

            if(selectedDetail.title === "") {
                alert("제목을 입력해주세요")
                return;
            }

            const data = new FormData()
            data.append("id", state.modifyDetailId)

            if(state.book.file !== null) {
                var file = state.book.file;
                var blob = file.slice(0, file.size, file.type);
                var newFile = new File([blob], state.selectedBook.title + "_" + (selectedDetail.round) + "." + ".pdf", {type: file.type})
                data.append("file", newFile)
            }

            if(state.oldTitle !== selectedDetail.title) {
                data.append("title", selectedDetail.title)
            }

            try {
                const res = await API.sendPut(URL.api.book_detail.modify, data, 'multipart/form-data')
                if(res.status === 200) {
                    state.modifyDetail = -1;
                    state.modifyDetailId = -1;
                    state.oldIdx = -1;
                    state.oldTitle = '';
                    alert("수정을 완료하였습니다!")

                    this.setState(state);
                }
            } catch(e) {
                console.error(e)
                alert("수정을 완료하지 못했습니다. 잠시 후에 다시 시도해주세요.")
            }
        }
    }

    handleFinishClick = async(book_id) => {
        var state = this.state;
        
        var params = {
            is_finished_serialization: 1,
            book_id: book_id
        }

        if(window.confirm('연재를 종료하시겠습니까?')) {
            try {
                const res = await API.sendPut(URL.api.book.put, params, 'application/json')
                if(res.status === 200) {
                    if(typeof state.bookList['ser-ed'] === 'undefined') {
                        state.bookList['ser-ed'] = [this.book]
                    } else {
                        state.bookList['ser-ed'].push(this.book)
                    }

                    var newArray = state.bookList['ser'].filter(item => item.id !== this.book.id)
                    state.bookList['ser'] = newArray
                    this.setState(state)
                }
            } catch(e) {
                console.error(e)
                alert("작업을 완료하지 못 했습니다. 잠시 후에 다시 시도해주세요.")
            }
        }
    }

    handleModifyDetailClick = (idx, detail_id) => {
        var state = this.state;
        if(state.oldIdx >= 0) {
            state.detailList[state.oldIdx].title = state.oldTitle;
        }
        state.upload = false;
        state.modifyDetail = idx;
        state.modifyDetailId = detail_id;
        state.oldIdx = idx;
        state.oldTitle = state.detailList[idx].title;
        state.book = {title:"", name:"선택 파일 없음", file:null};

        this.setState(state);
    }

    handlePageChange = async(page) => {
        var state = this.state;
        var params = {
            member_id : this.props.authorId,
            offset: (page - 1) * 5,
            limit: 5,
        }

        try {
            const res = await API.sendGet(URL.api.book.getDetailList + state.selectedBook.id, params)
            if(res.status === 200) {
                var detailList = res.data.detailList
                state.detailList = detailList
                state.modifyDetail = -1;
                state.modifyDetailId = -1;
                state.oldIdx = -1;
                state.oldTitle = '';
                state.detailPage = page;
                this.setState(state)
            }
        } catch(e) {
            console.error(e)
            alert("오류가 발생했습니다. 잠시 후에 다시 시도해주세요.");
        }
    }

    render() {
        var state = this.state;

        return (
            <Modal
                onClose={this.handleCloseClick}
                pos={this.props.modalCoord}
            >
                <div className="book-detail-modal">
                    <div className="book-detail-header">
                        <h3>{this.book.title}</h3>
                    </div>

                    <em className="close" onClick={this.handleCloseClick}> &times; </em>

                    <div className="table-wrap">
                        <table className="book-detail-table">
                            <tbody>
                                {
                                    state.detailList.map((detail, idx) => {
                                        return (
                                            <tr key={idx} className="book-detail">
                                                <td className="book-detail-idx"> <span> {detail.round}회차. </span> </td>
                                                {
                                                    state.modifyDetailIdx === idx ?
                                                    <td colSpan={3}>
                                                        <div className="upload-info">
                                                            <input className="title box" value={detail.title} onChange={(evt) => this.handleTitleChange(evt, idx)} placeholder={"제목을 입력해주세요"}/>

                                                            <input type="file" id={"book" + idx} onChange={(evt) => this.handleModifyFileClick(evt, idx)} accept=".pdf"/>
                                                            <label htmlFor={"book" + idx}>
                                                                <div className="file-upload box">
                                                                    {state.modifyDetailIdx === idx && this.book.file !== null ? this.book.filename : detail.file}
                                                                </div>
                                                                <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                                            </label>
                                                        </div>
                                                    </td>
                                                    :
                                                    <td className="book-detail-title"> <span> {detail.title} </span></td>
                                                }
                                                {
                                                    parseInt(this.props.authorId) === this.props.user.id && state.modifyDetailIdx !== idx &&
                                                    <td className="icon">
                                                        <em className="modify" onClick={() => this.handleModifyDetailClick(idx, detail.id)}/>
                                                    </td>
                                                }
                                                {
                                                    state.modifyDetailIdx !== idx && (
                                                        parseInt(this.props.authorId) === this.props.user.id ?
                                                        <td className="icon">
                                                            <em className="download"  onClick={() => this.downloadAction(detail.id)}/>
                                                        </td>
                                                        :
                                                        !!detail.purchased_id ?
                                                        <td className="icon"> <em className="download"/> </td>
                                                        :
                                                        <td className="icon"> <em className="lock"/> </td>
                                                    )
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <Paging
                            count={state.detailTotal}
                            page={state.detailPage}
                            perPage={5}
                            onChange={this.handlePageChange}
                        />
                    </div>
                    {
                        this.book.is_finished_serialization === 0 && state.upload &&
                        <div className="upload">
                            <div className="header">
                                <h2>업로드</h2>
                            </div>

                            <span>
                                {state.detailTotal+1}회차.
                            </span>
                            <div className="upload-info">
                                <input className="title box" value={this.book.title} onChange={(evt) => this.handleTitleChange(evt, -1)} placeholder={"제목을 입력해주세요"}/>

                                <input type="file" id="book" onChange={this.handleBookFileChange} accept=".pdf"/>
                                <label htmlFor="book">
                                    <div className="file-upload box">
                                        {this.book.filename}
                                    </div>
                                    <div className="btn btn-color-2 upload-btn">파일 업로드</div>
                                </label>
                            </div>
                        </div>
                    }
                    {
                        this.book.is_finished_serialization === 0 &&
                        (state.upload === true || state.modifyDetailIdx >= 0 ?
                            <div className="btn-wrap">
                                <button className="btn btn-color-2" onClick={this.handleRegister}>
                                    완료
                                    </button>
                                    <button className="btn" onClick={() => this.handleUploadClick(false)}>
                                    취소
                                    </button>
                            </div>
                            :
                            <div className="btn-wrap">
                                {
                                    this.book.is_finished_serialization === 0 &&
                                    <button className="btn end-btn" onClick={() => this.handleFinishClick(this.book.id)}>연재완료</button>
                                }
                                <button className="btn btn-block btn-bottom" onClick={() => this.handleUploadClick(true)}>
                                    + 새로운 회차 등록하기
                                </button>
                            </div>
                        )
                    }

                </div>
            </Modal>
        )
    }
}

export default SeriesListModal;