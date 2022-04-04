import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';
import URL from '../../helper/helper_url';

import '../../scss/common/footer.scss'


class Footer extends Component{
    inPreparation = () => {
        alert("준비 중입니다.")
    }
    render(){
        return (
            <footer>
                <div id = "footer-wrap">
                    <div className = "vertical-div">
                        <div className = "left">
                            <div className="logo-img"/>
                            <div className = "info-tag">
                                <div onClick = {this.inPreparation} >
                                    <span>회사소개 | </span>
                                </div>
                                <Link to ={URL.service.terms + "using"}>
                                    <span>이용약관 | </span>
                                </Link>
                                <Link to ={URL.service.terms + "personal"}>
                                    <span>개인정보취급방침 </span>
                                </Link>
                            </div>                        
                            <div className = "copyright">
                                COPYRIGHT ⓒ RINGU.ALL Right reserved
                            </div>
                        </div>
                        <div className = "right">
                            <div className = "information">
                                <div className = "header-tag">
                                    Information
                                </div>
                                <div className = "body-tag">
                                    <div className= "each-content">
                                        상호명: 링구
                                    </div>
                                    <div className= "each-content">
                                        대표자명: 김진호
                                    </div>
                                    <div className= "each-content">
                                        사업자 등록번호: 607-37-04967
                                    </div>
                                    <div className= "each-content">
                                        통신판매 사업자: 2022-서울구로-0474
                                    </div>
                                </div>
                                
                            </div>
                            <div className = "contact">
                                <div className = "header-tag">
                                    Contact us
                                </div>
                                <div className = "body-tag">
                                    <div className= "each-content">
                                        ringu.music@gmail.com
                                    </div>
                                    <div className= "each-content">
                                        02-2689-6658
                                    </div>
                                    <div className= "each-content">
                                        서울시 구로구 고척로 52라길 11-11
                                    </div>
                                </div>
                            </div>
                            <div className = "visit">
                                <div className = "header-tag">
                                    Visit us on
                                </div>
                                <div className = "body-tag">
                                    <button type="button"  className="visit-button" onClick={() => window.open('https://www.instagram.com/ringu_content/')}>
                                        <div className = "button-content">
                                            <div className= "instagram img"/>
                                            <div className = "content">
                                                ringu_contents
                                            </div>
                                        </div>
                                    </button>
                                    <button type="button" className="visit-button" onClick={() =>window.open('https://www.youtube.com/channel/UC3KKrCe27zoG9JRnSjIMinQ')}>
                                        <div className = "button-content">
                                            <div className= "youtube img"/>
                                            <div className = "content">
                                                Ringu Play
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
    
}

export default Footer;