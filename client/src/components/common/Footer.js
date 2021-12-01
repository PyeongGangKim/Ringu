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
                <div id = "footer">
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
                            <div className = "header-tag">
                                <div className = "contact">
                                    Contact us
                                </div>
                                <div className = "visit">
                                    Visit us on
                                </div>
                            </div>
                            <div className = "body-tag">
                                <div className = "contact">
                                    <div>
                                        ringu9999@gmail.com
                                    </div>
                                </div>
                                <div className = "visit">
                                    <div>
                                        <button type="button"  className="visit-button" onClick={() => window.open('https://www.instagram.com/ringu_content/')}>
                                            <div className = "button-content">
                                                <div className= "instagram img"/>
                                                <div className = "content">
                                                    ringu_contents
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div>
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
                </div>
            </footer>
        );
    }
    
}

export default Footer;