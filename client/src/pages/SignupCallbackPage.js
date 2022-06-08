import React, { Component, Fragment } from 'react';
import NaverCallback from '../components/callback/NaverCallback';
import KakaoCallback from '../components/callback/KakaoCallback';
import GoogleCallback from '../components/callback/GoogleCallback';


const SignupCallbackPage = ({... props}) => {
    var sns = props.match.params.sns;

    switch (sns) {
        case 'naver':
            return <NaverCallback/>
            break;
        case 'kakao':            
            return <KakaoCallback/>
            break;
        case 'google':
            return <GoogleCallback/>
            break;
        case 'facebook':
            break;
        default:

    }

    return null
}

export default SignupCallbackPage;
