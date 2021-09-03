import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';


import User from '../../utils/user';
import '../../scss/common/page.scss';
import '../../scss/common/button.scss';
import '../../scss/register/author.scss';

class AuthorInfo extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
        this.state = {
            display: this.props.display === 2 ? true : false,
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            display: nextProps.display === 2 ? true : false,
        })
    }

    render() {
        let state = this.state

        return (
            <div className="container" style={{width: "100%", display: state.display ? "" : "none"}}>
                <div className="page-header">
                    <span>작가 등록</span>
                </div>

                <hr/>

                <div className="content" style={{width:"800px", margin:"50px auto"}}>

                    <div>
                        <div className="input-wrapper input2">
                            <div className="label">
                                작가명
                            </div>
                            <input style={{borderColor:"#ccc", backgroundColor:"white"}} type="text"/>
                        </div>

                        <div className="input-wrapper textarea">
                            <div className="label">
                                작가님의 소개글을 적어주세요
                            </div>
                            <textarea style={{border:"2px solid #ccc", backgroundColor:"white"}} rows="10" type="text"/>
                        </div>

                        <div>
                            <img src="" style={{width:"50px", height:"50px", verticalAlign:"middle"}}/>
                            <div style={{display:"inline-block", borderRadius:"4px", fontSize:"12px", padding:"10px", backgroundColor: "#eee", width:"750px"}}>
                                    허위 정보나 불건전한 내용 또는 개인정보 유출 등이 포함되어 있을 시 서비스 이용에 불이익이 있을 수 있습니다.
                            </div>
                        </div>

                        <div style={{width:"100%", margin:"50px auto auto auto"}}>
                            {/*<div className="btn btn-outline" style={{margin: "10px", padding: "10px 15px", width:"45%", fontSize:"16px"}}>
                                임시 저장
                            </div>*/}
                            <div className="btn btn-color-2" style={{margin: "10px", padding: "10px 15px", width:"45%", fontSize:"16px"}} onClick={this.moveNext}>
                                완료
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthorInfo;
