import React, { Component, Fragment, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
let GOOGLE = require('../../config/google_auth')[process.env.REACT_APP_ENV];


const GoogleCallback = ({location, history, ...props}) => {
    useEffect(()=>{
        let code = location.search.substring(6, location.search.length);

        getUserProfile(code);
    
    }, []);


    const getUserProfile = async (code) => {
        try {
            
            var params = {
                grant_type:"authorization_code",
            	client_id:GOOGLE.CLIENT_ID,
            	redirect_uri: GOOGLE.BASE_URL + GOOGLE.CALLBACK_URL,
            	code:code,
            }
            let BasciProfile ;
            let email;
            let id;
            await window.gapi.load('auth2', async () => {
                await window.gapi.auth2.init({
                    client_id: GOOGLE.CLIENT_ID,
                    scope: 'email'
                });
                let gauth = window.gapi.auth2.getAuthInstance();
                BasciProfile = gauth.currentUser.get().getBasicProfile();
                email = BasciProfile.getEmail();
                id = BasciProfile.getId();
                if (!email) {
                    alert("이메일 정보 제공에 동의하지 않았습니다")
                    history.replace(URL.service.accounts.signup);
                }
                else{
                    try{
                        const res = await API.sendGet(URL.api.auth.email.duplicate, params = {email:email})
        
                                // 중복없는 경우
                                // 회원가입 페이지로 넘어가기
                        if(res.status === 200) {
                            if(res.data.message == "OK"){
                                history.push({
                                    pathname:   URL.service.accounts.signup_step,
                                    search:     `?sns=google&email=${email}&id=${id}`,
                                });
                            }
                            else if(res.data.message === "duplicate"){
                                const res = await API.sendGet(URL.api.auth.sns.google, params = {id:id, email:email, sns: 'google'})
                                if(res.status === 200) {
                                   
                                    var token = res.data.token;
                                    if( token ) Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
                                    history.push(URL.service.home);
                                    
                                    
                                }
                            }     
                        }
                    }catch(err){
                        let resp = err.response
                        if(resp.status === 401) { // 인증 실패
                            alert("로그인이 실패하였습니다")
                            window.location.href = URL.service.accounts.login
                        }
                        else if(resp.status === 400){
                            alert("이미 가입된 이메일입니다");
                            window.location.href = URL.service.accounts.login
                        }
                        else {
                            console.log(resp.status)
                            console.error(resp.data.message)
                        }
                    }
                }
                
            });
        } 
        catch(err){
            console.log(err);
        
        }

    }

    return null;
}

export default GoogleCallback;
