import React, { Component, Fragment } from 'react';
import NaverCallback from '../components/callback/NaverCallback';
import KakaoCallback from '../components/callback/KakaoCallback';

const SignupCallbackPage = ({... props}) => {
    var sns = props.match.params.sns;
    var location = props.location;
    var history = props.history;


    switch (sns) {
        case 'naver':
            return <NaverCallback location={location} history={history}/>
            break;
        case 'kakao':            
            return <KakaoCallback location={location} history={history}/>
            break;
        case 'google':
            break;
        case 'facebook':
            break;
        default:

    }

    return null
}

export default SignupCallbackPage;
