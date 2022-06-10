import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';
var url = require('../../config/url')[process.env.REACT_APP_ENV];
var KAKAO = require('../../config/kakao_auth')[process.env.REACT_APP_ENV];

const {Kakao} = window;

const KakaoCallback = () => {
    const history = useHistory();
    
    useEffect(()=>{
        var code = location.search.substring(6, location.search.length);
        getUserProfile(code);
    }, []);

    const getUserProfile = async (code) => {
        try {
            var params = {
                grant_type:"authorization_code",
            	client_id:KAKAO.REST_API_KEY,
            	redirect_uri:url.BASE_URL + KAKAO.CALLBACK_URL,
            	code:code,
            }

            const res = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${KAKAO.REST_API_KEY}&redirect_uri=${url.BASE_URL + KAKAO.CALLBACK_URL}&code=${code}`)
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

                        const res = await API.sendGet(URL.api.auth.email.duplicate, params={email:email})

                        // 중복없는 경우
                        // 회원가입 페이지로 넘어가기
                        if(res.status === 200) {
                            if(res.data.message === 'OK') {
                                history.replace({
                                    pathname:   URL.service.accounts.signup_step,
                                    search:     `?sns=kakao&email=${email}&id=${id}`,
                                });
                            }
                            else if(res.data.message === 'duplicate') {                                
                                // 중복 있는 경우
                                // 1. 해당 sns 계정이면 로그인 절차 -> redirect_url로 이동
                                // 2. 이미 등록된 계정이면 에러 메시지
                                const res = await API.sendGet(URL.api.auth.sns.kakao, params={id:id, email:email, sns: 'kakao'})

                                if(res.status === 200) {
                                    var token = res.data.token;
                                    if( token ) Cookies.set('RINGU_JWT', token, {expires: 7, path: '/'});
                                    history.replace(URL.service.home);
                                }
                            }
                        }
                    } catch(err){
                        var resp = err.response;
                        if(resp.status === 400) { // 중복 이메일
                            alert("이미 가입된 이메일입니다")
                            history.replace(URL.service.accounts.login)
                        } else {
                            alert("로그인이 실패하였습니다")
                            history.replace(URL.service.accounts.login)
                        }
                    }
                },
                fail: function(error) {
                    console.log(error)
                },
            })
        } catch(err){
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
