import React, { Component } from 'react';
import { BrowserRouter, Switch, Route ,Redirect } from 'react-router-dom';

import { Home, NotFound, MyPage, PasswordChangePage, NotificationChangePage, AuthPage, LeavePage, Purchases, Carts, FavBookPage, FavAuthorPage, AuthorRegister, AuthorPage, BookPage, RegisterPage, BuyPage, BuyCompletePage, SearchPage, NotificationPage} from '../pages';
import { LoginPage, SignupPage, SignupDetailPage, SignupCallbackPage } from '../pages';
import { ReviewPage } from '../pages';

class App extends Component {

    componentDidUpdate() {
        window.scrollTo(0,0);
    }

    render() {
        return (
            <Switch>
                <Route exact path="/home" component={Home} />{}
                <Route path="/mypage/password/update" component={PasswordChangePage} />{}
                <Route path="/mypage/notification/update" component={NotificationChangePage} />{}
                <Route path="/mypage" component={MyPage} />{}
                <Route path="/leave" component={LeavePage} />{}
                <Route path="/purchases" component={Purchases} />{}
                <Route path="/carts" component={Carts} />{}
                <Route path="/favorite/book" component={FavBookPage} />{}
                <Route path="/favorite/author" component={FavAuthorPage} />{}
                <Route path="/register/author" component={AuthorRegister} />{}
                <Route path="/author" component={AuthorPage} />{}
                <Route path="/book/:book" component={BookPage} />
                <Route path="/register" component={RegisterPage} /> {}
                <Route path="/complete" component={BuyCompletePage} />{}
                <Route path="/buy" component={BuyPage} />{}
                <Route path="/search" component={SearchPage} />{}
                <Route path="/login" component={LoginPage} />{}
                <Route path="/signup/:sns/callback" component={SignupCallbackPage} />{}
                <Route path="/signup" component={SignupPage} />{}
                <Route path="/signup-step" component={SignupPage} />{}
                <Route path="/welcome" component={SignupPage} />{}
                <Route path="/review/:book_detail" component={ReviewPage} />{}
                <Route path="/notification" component={NotificationPage} />{}
                <Route component={NotFound} />
            </Switch>
        );
    }
}

export default App;
