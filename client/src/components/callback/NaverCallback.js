import React, { Component, Fragment, useEffect } from 'react';
import Cookies from 'js-cookie';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
import NAVER from '../../config/naver_auth';

const NaverCallback = ({location, history, ...props}) => {
    useEffect(()=>{
        getUserProfile();
    }, []);


    const getUserProfile = async () => {
        try {
            var naver_id_login = new window.naver_id_login(NAVER.CLIENT_ID, NAVER.BASE_URL+NAVER.CALLBACK_URL);

            var token = naver_id_login.oauthParams.access_token;
            var params = {
                token: token
            }

            const profile_res = await API.sendGet(URL.api.auth.sns.naver_callback, params=params)

            if(profile_res.status === 200) {
                try {
                    var profile = profile_res.data.response;
                    var email = profile.email;
                    var id = profile.id;
                    // email 제공 미동의 시
                    // 회원가입 페이지로 이동
                    if(!email) {
                        alert("이메일 정보 제공에 동의하지 않았습니다")
                        history.replace(URL.service.accounts.signup);
                    }

                    const res = await API.sendGet(URL.api.auth.email.duplicate, params={email:email})
                    // 중복없는 경우
                    // 회원가입 페이지로 넘어가기
                    if(res.status === 200) {
                        if(res.data.message === 'OK') {
                            history.push({
                                pathname:   URL.service.accounts.signup_step,
                                search:     `?sns=naver&email=${email}&id=${id}`,
                            });
                        }
                        else if(res.data.message === 'duplicate') {
                            // 중복 있는 경우
                            // 1. 해당 sns 계정이면 로그인 절차 -> redirect_url로 이동
                            // 2. 이미 등록된 계정이면 에러 메시지
                            const res = await API.sendGet(URL.api.auth.sns.naver, params={id:id, email:email, sns: 'naver'})
                            if(res.status === 200) {
                                var token = res.data.token;
                                if( token ) Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
                                history.push(URL.service.home);
                            }
                        }
                    }
                } catch(err) {
                    var resp = err.response
                    if(resp.status === 401) { // 인증 실패
                        alert("인증이 실패하였습니다")
                        window.location.href = URL.service.accounts.login
                    }
                    else {
                        alert("인증이 실패하였습니다")
                        window.location.href = URL.service.accounts.login
                    }
                }
            }
        } catch(err){
            var resp = err.response
            if(resp.status === 401) { // 인증 실패
                alert("인증이 실패하였습니다")
                window.location.href = URL.service.accounts.login
            }
        }
    }

    return null;
}

export default NaverCallback;
