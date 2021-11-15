import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import jQuery from "jquery";
import Cookies from 'js-cookie';

import '../../scss/common/footer.scss'


class Footer extends Component{
  
    render(){
        return (
            <footer>
                <div id = "footer">
                    <div className = "vertical-div">
                        <div className = "left">
                            <div className="logo-img"/>
                            <div className = "info-tag">
                                회사소개 | 이용약관 | 개인정보취급방침
                            </div>
                            <div className = "copyright">
                                COPYRIGHT(C)LOGO.ALL Rightreserved
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
                                    <div>
                                        010-1234-5678
                                    </div>
                                </div>
                                <div className = "visit">
                                    <div>
                                        <button type="button"  className="visit-button" onClick={() => window.open('https://www.instagram.com/ringu_content/')}>
                                            <div className = "button-content">
                                                <div className= "instagram-img"/>
                                                <div className = "content">
                                                    ringu_contents
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div>
                                        <button type="button" className="visit-button" onClick={() =>window.open('https://www.youtube.com/channel/UC3KKrCe27zoG9JRnSjIMinQ')}>
                                            <div className = "button-content">
                                                <div className= "youtube-img"/>
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