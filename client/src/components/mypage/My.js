import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';

//import Cart, FavAuthor, FavBook, Leave, MyInfo, NotificationChange, PasswordChange, Purchase } from '../components/mypage';
import Cart from './Cart';
import FavAuthor from './FavAuthor';
import FavBook from './FavBook';
import Leave from './Leave';
import MyInfo from './MyInfo';
import NotificationChange from './NotificationChange';
import PasswordChange from './PasswordChange';
import Purchase from './Purchase';

class My extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (

            <div id="mypage" className="page2">
                <Route path="/mypage/cart" component={Cart} />
                <Route path="/mypage/favorite/author" component={FavAuthor} />
                <Route path="/mypage/favorite/book" component={FavBook} />
                <Route path="/mypage/leave" component={Leave} />
                <Route path="/mypage/info" component={MyInfo} />
                <Route path="/mypage/notification/update" component={NotificationChange} />
                <Route path="/mypage/password/update" component={PasswordChange} />
                <Route path="/mypage/purchases" component={Purchase} />
            </div>

        )
    }
}

export default My;
