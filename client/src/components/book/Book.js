import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/book/book.scss';

class Book extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        this.state = {
            hash: props.hash ? props.hash.substring(1, props.hash.length) : "",
        }
    }

    render() {
        var state = this.state;

        return (
            <div className="container book" >
                <div className="header">
                    <div>
                        <div style={{width: "300px", margin:"auto", paddingBottom:"30px"}}>
                            <img src="" style={{width: "100%", height: "200px", margin:"auto", display:"block", borderRadius: "4px", marginBottom: "4px"}}/>
                            <span style={{color:"var(--color-1)", fontSize:"11px"}}>저자 : 리미 &nbsp; &nbsp;&nbsp; 페이지수 60페이지</span>
                            <br/><br/>
                            <span style={{fontSize:"18px", fontWeight:"700"}}>한 달만에 -8kg 성공하는 법</span>
                        </div>
                    </div>


                </div>
                <div className="book-nav">
                    <div className="navlist">
                        <a href="#book" className={state.hash == "book" ? "navitem active" : "navitem"}>책소개</a>
                        <a href="#contents" className={state.hash == "contents" ? "navitem active" : "navitem"}>목차</a>
                        <a href="#author" className={state.hash == "author" ? "navitem active" : "navitem"}>작가소개</a>
                        <a href="#review" className={state.hash == "review" ? "navitem active" : "navitem"}>리뷰</a>
                    </div>
                </div>

                <div className="content">
                    <a name="book">
                        <div className="content-box" >
                            <div className="content-header"> 책소개</div>
                            <div className="content-value book">
                                책 소개창입니다
                            </div>
                        </div>
                    </a>

                    <a name="contents">
                        <div className="content-box" >
                            <div className="content-header"> 목차</div>
                            <div className="content-value contents">
                                <div>프롤로그</div>
                                <div>1.설탕 대체 식품 찾기</div>
                                <div>2.밀가루 대체 식품 찾기</div>
                            </div>
                        </div>
                    </a>

                    <a name="author">
                        <div className="content-box" >
                            <div className="content-header"> 작가 소개</div>
                            <div className="content-value author">
                                <div>
                                    <div style={{display:"inline-block", textAlign:"center"}}>
                                        <div><img src="blank.jpg" style={{width:"100px", height:"100px", textAlign:"center", borderRadius:"50%"}}/></div>
                                        <div className="btn btn-color-2" style={{textAlign: "center", fontSize:"10px"}}>작업 공간</div>
                                    </div>

                                    <div style={{display:"inline-block", verticalAlign: "top", marginLeft:"20px"}}>
                                        반갑읍니다...
                                        작가 소개입니다..
                                    </div>

                                </div>
                            </div>
                        </div>
                    </a>

                    <a name="review">
                        <div className="content-box" >
                            <div className="content-header">
                                <span> 리뷰 </span>
                            </div>

                            <div className="content-value review">
                                <div style={{backgroundColor:"var(--color-4)", borderRadius:"4px", width:"100%"}}>
                                    <div style={{textAlign:"center"}}>
                                        <div style={{display:"inline-block", verticalAlign:"middle", fontSize: "32px", fontWeight: "700", padding: "30px"}}>5.0</div>
                                        <div style={{verticalAlign:"middle", display:"inline-block", textAlign: "left"}}>
                                            <div style={{fontSize:"24px", fontWeight:"700", color: "#fff539"}}>★★★★★</div>
                                            <span style={{fontSize:"12px"}}>100 개의 후기</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-container" style={{marginLeft:"10px"}}>
                                    <div className="review-item" style={{borderBottom: "1px solid #ccc", padding: "15px 0 25px 0"}}>
                                        <div style={{marginBottom: "15px"}}>
                                            <span style={{fontSize:"12px"}}> jih* </span>
                                            <span style={{fontSize:"12px", color:"#ccc"}}> | </span>
                                            <span style={{fontSize:"14px", color:"yellow"}}> ★ ★ ★ ★ ★ </span>
                                        </div>
                                        <span>
                                            리뷰입니당
                                        </span>
                                    </div>

                                    <div className="review-item" style={{borderBottom: "1px solid #ccc", padding: "15px 0 25px 0"}}>
                                        <div style={{marginBottom: "15px"}}>
                                            <span style={{fontSize:"12px"}}> jih* </span>
                                            <span style={{fontSize:"12px", color:"#ccc"}}> | </span>
                                            <span style={{fontSize:"14px", color:"yellow"}}> ★ ★ ★ ★ ★ </span>
                                        </div>
                                        <span>
                                            리뷰입니당
                                        </span>
                                    </div>
                                </div>

                                <div style={{textAlign:"center", margin: "30px 0", fontSize: "12px", fontWeight: "700"}}>
                                    <span style={{cursor:"pointer"}}>+ 더보기</span>
                                </div>

                            </div>
                        </div>
                    </a>
                </div>

            </div>
        )
    }
}

export default Book;
