import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';

import helper_url from '../../helper/helper_url';
import User from '../../utils/user';
import '../../scss/buy/buy.scss';
import '../../scss/common/button.scss';

class BuyComplete extends Component {
    constructor(props) {
        super(props)
        let userInfo = User.getInfo();
    }

    render() {
        return (
            <div className="page1">
                <div className="complete-container">
                    <h3>결제/주문완료</h3>
                    <div className="complete-box">
                        <div style={{textAlign:"center", margin:"0 auto", fontSize:"18px", lineHeight:"1.6", width: "450px"}}>
                            <span className="color-2" style={{fontWeight:"700"}}>고은혜</span>님, 주문하신 상품의 결제가 완료되었습니다.
                            <br/>
                            지금 바로 책을 펴보실 수 있어요!

                            <div style={{width:"200px", height:"200px", margin: "40px auto"}}>
                                <img src="/buy-complete.png" style={{width:"100%", height:"100%"}}/>
                            </div>

                            <a href={helper_url.service.home}>
                                <div className="btn btn-outline" style={{fontSize:"20px", width: "100%"}}>
                                    계속 둘러보기
                                </div>
                            </a>

                            <div style={{marginTop:"10px"}}>
                                <img src="/download.png" style={{width:"20px", height:"20px", verticalAlign:"middle"}}/>
                                <span style={{fontSize:"13px", verticalAlign:"middle"}}> 구매내역에서 결제하신 상품을 다운로드 받으실 수 있습니다 </span>
                            </div>
                        </div>

                    </div>

                    <h3>구매정보 ({"3"}건)</h3>
                    <table>
                        <tbody>
                            <tr>
                                <th>이미지</th>
                                <th>상품정보</th>
                                <th>판매가</th>
                                <th>적립금</th>
                                <th>다운로드</th>
                            </tr>
                            <tr>
                                <td style={{padding:"5px 20px", textAlign:"center"}}><img style={{borderRadius:"4px"}} src="/travel.jpg"/></td>
                                <td>
                                    <div style={{fontSize: "15px", lineHeight: "25px"}}>
                                        <span style={{fontSize:"16px"}}>알면 알수록 도움되는 주식투자 노하우 </span><br/>
                                        저자: 리미 <br/>
                                        페이지수: 60p <br/>
                                        연재형식: 단행본
                                    </div>
                                </td>
                                <td><span style={{fontSize:"23px"}}>15,000</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><span style={{fontSize:"23px"}}>20</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><div className="btn btn-color-2" style={{fontSize: "15px", width: "95%"}}>PDF 다운받기 <img style={{marginLeft: "5px"}} src="/download.png" width="15px" height="15px"/></div></td>
                            </tr>
                            <tr>
                                <td style={{padding:"5px 20px", textAlign:"center"}}><img style={{borderRadius:"4px"}} src="/travel.jpg"/></td>
                                <td>
                                    <div style={{fontSize: "15px", lineHeight: "25px"}}>
                                        <span style={{fontSize:"16px"}}>알면 알수록 도움되는 주식투자 노하우 </span><br/>
                                        저자: 리미 <br/>
                                        페이지수: 60p <br/>
                                        연재형식: 단행본
                                    </div>
                                </td>
                                <td><span style={{fontSize:"23px"}}>15,000</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><span style={{fontSize:"23px"}}>20</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><div className="btn btn-color-2" style={{fontSize: "15px", width: "95%"}}>PDF 다운받기 <img style={{marginLeft: "5px"}} src="/download.png" width="15px" height="15px"/></div></td>
                            </tr>
                            <tr>
                                <td style={{padding:"5px 20px", textAlign:"center"}}><img style={{borderRadius:"4px"}} src="/travel.jpg"/></td>
                                <td>
                                    <div style={{fontSize: "15px", lineHeight: "25px"}}>
                                        <span style={{fontSize:"16px"}}>알면 알수록 도움되는 주식투자 노하우 </span><br/>
                                        저자: 리미 <br/>
                                        페이지수: 60p <br/>
                                        연재형식: 단행본
                                    </div>
                                </td>
                                <td><span style={{fontSize:"23px"}}>15,000</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><span style={{fontSize:"23px"}}>20</span><span style={{fontWeight:"100", fontSize:"15px"}}>원</span></td>
                                <td><div className="btn btn-color-2" style={{fontSize: "15px", width: "95%"}}>PDF 다운받기 <img style={{marginLeft: "5px"}} src="/download.png" width="15px" height="15px"/></div></td>
                            </tr>

                        </tbody>

                    </table>

                    <h3>결제정보</h3>
                    <table className="summary">
                        <tbody>
                            <tr style={{width:"100%"}}>
                                <td style={{padding:"15px", width: "180px"}}>결제금액</td>
                                <td style={{padding:"15px 30px", width: "1020px"}}><span style={{fontSize: "23px", fontWeight: "700"}}>{"42,750"}</span>원</td>
                            </tr>
                            <tr>
                                <td style={{padding:"15px"}}>결제수단</td>
                                <td style={{padding:"15px 30px"}}>
                                    <div style={{fontSize:"15px", lineHeight:"26px"}}>
                                        신용카드 (IBK 기업은행) <br/>
                                        현금 영수증 발행 (소득 공제용) 010-1234-5678
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>

            </div>

        )
    }
}

export default BuyComplete;
