import React, { Component, Fragment, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import KAKAO from '../../config/kakao_auth';

const {Kakao} = window;

const KakaoCallback = ({location, history, ...props}) => {
    useEffect(()=>{
        var code = location.search.substring(6, location.search.length);

        getUserProfile(code);
    }, []);


    const getUserProfile = async (code) => {
        try {
            var params = {
                grant_type:"authorization_code",
            	client_id:KAKAO.REST_API_KEY,
            	redirect_uri:"http://3.36.58.100:3000/signup/kakao/callback",
            	code:code,
            }

            const res = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=5dbd34592deccca8428b33c321666fa0&redirect_uri=http://3.36.58.100:3000/signup/kakao/callback&code=${code}`)
            Kakao.Auth.setAccessToken(res.data.access_token);

            Kakao.API.request({
                url: '/v2/user/me',
                data: {
                    property_keys: ["id", "kakao_account.email"]
                },
                success: async function(response) {
                    try {
                        var id = response.id;
                        var email = ('kakao_account' in response) ? response.kakao_account.email : '';

                        if (!email) {
                            alert("이메일 정보 제공에 동의하지 않았습니다")
                            history.replace(URL.service.accounts.signup);
                        }

                        const email_check_res = await API.sendGet(URL.api.auth.email.duplicate, params={email:email})

                        if(email_check_res.status === 200) {
                            // 중복없는 경우
                            // 회원가입 페이지로 넘어가기
                            if(email_check_res.data.status === 'ok') {
                                history.push({
                                    pathname:   URL.service.accounts.signup_step,
                                    search:     `?sns=naver&email=${email}&id=${id}`,
                                });
                            }
                            // 중복 있는 경우
                            // 1. 해당 sns 계정이면 로그인 절차 -> redirect_url로 이동
                            // 2. 이미 등록된 계정이면 에러 메시지
                            else {
                                const res = await API.sendGet(URL.api.auth.sns.naver, params={id:id, email:email, sns: 'naver'})
                                if(res.status === 200) {
                                    var token = res.data.token;
                                    if( token ) Cookies.set('token', token, {expires: 7, path: '/'});
                                    history.push(URL.service.home);
                                }
                            }
                        }
                    } catch(err){
                        var resp = err.response
                        console.log(err)
                    }

                },
                fail: function(error) {
                    console.log(error)
                },
            })

            /*const profile_res = await API.sendGet(URL.api.auth.sns.naver_callback, params=params)

            if(profile_res.status === 200) {
                try {
                    var profile = profile_res.data.response;

                    // email 제공 미동의 시
                    // 회원가입 페이지로 이동
                    if(!profile.email) {
                        alert("이메일 정보 제공에 동의하지 않았습니다")
                        history.replace(URL.service.accounts.signup);
                    }

                    const email_check_res = await API.sendGet(URL.api.auth.email.duplicate, params={email:profile.email})

                    // 중복 있는 경우
                    // 1. 해당 sns 계정이면 로그인 절차 -> redirect_url로 이동
                    // 2. 이미 등록된 계정이면 에러 메시지
                    if(email_check_res.status === 200) {
                        const res = await API.sendGet(URL.api.auth.sns.login, params={id:profile.id, email:profile.email, sns: 'naver'})
                        if(res.status === 200) {
                            console.log(res.data)
                            var token = res.data.token;
                            if( token ) Cookies.set('token', token, {expires: 7, path: '/'});
                            history.push(URL.service.home);
                        }
                    }

                } catch(err) {
                    var resp = err.response
                    console.log(resp)
                }
            } else {

            }*/
        } catch(err){
            console.log(err)
            var resp = err.response
            if(resp.status === 401) { // 인증 실패
                console.log(resp.data.message)
            } else {
                console.log(err)
            }
        }

    }

    return null;
}

export default KakaoCallback;
