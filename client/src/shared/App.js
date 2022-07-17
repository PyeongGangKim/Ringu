import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from '../components/common/Footer';
import { Home, NotFound, MyInfoPage, MyPage, PasswordChangePage, NotificationChangePage, LeavePage, PurchasePage, CartPage, FavBookPage, FavAuthorPage, AuthorRegisterDetailPage, AuthorPage, BookPage, RegisterPage, RegisterDetailPage, BuyPage, BuyCompletePage, BuyCallbackPage, SearchPage, NotificationPage} from '../pages';
import { LoginPage, SignupPage, SignupDetailPage, SignupCallbackPage, WelcomePage, ModifyBookPage, ModifyBookSeriesPage, TermsPage, FindEmailPage, ChangePasswordPage, ChangePasswordCompletePage } from '../pages';

import { ReviewPage, PaymentPage } from '../pages';
import { BrowserRouter } from 'react-router-dom';

import { GuideProvider } from '../contexts/guideContext';

class App extends Component {

    componentDidUpdate() {
        window.scrollTo(0,0);
    }

    render() {
        return (
            <>
                <GuideProvider>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Home} />{}
                            <Route path="/mypage" component={MyPage} />{}

                            <Route path="/author/:author_id" component={AuthorPage} />{}
                            <Route path="/register/author/" component={AuthorRegisterDetailPage} />{}
                            <Route path="/payment" component={PaymentPage} />{}
                            <Route path="/book/:book" component={BookPage} />
                            
                            <Route path="/register/book/:bookType" component={RegisterDetailPage} /> {}
                            <Route path="/register/book" component={RegisterPage} /> {}
                            <Route path="/modify/pub/:bookId" component={ModifyBookPage} /> {}
                            <Route path="/modify/series/:bookId" component={ModifyBookSeriesPage} /> {}
                            
                            <Route path="/complete" component={BuyCompletePage} />{}
                            <Route path="/buy/callback" component={BuyCallbackPage} />{}
                            <Route path="/buy" component={BuyPage} />{}
                            <Route path="/search" component={SearchPage} />{}

                            <Route exact path="/login/findpwd" component={FindEmailPage} />{}
                            <Route exact path="/change_pwd/complete" component={ChangePasswordCompletePage} />{}
                            <Route exact path="/change_pwd" component={ChangePasswordPage} />{}
                            <Route exact path="/login" component={LoginPage} />{}
                            <Route path="/signup/:sns/callback" component={SignupCallbackPage} />{}
                            <Route path="/signup/step" component={SignupDetailPage} />{}
                            <Route path="/signup" component={SignupPage} />{}
                            <Route path="/welcome" component={WelcomePage} />{}
                            <Route path="/review/:book_detail" component={ReviewPage} />{}
                            <Route path="/notification" component={NotificationPage} />{}
                            <Route path="/terms/:type" component={TermsPage} />{}
                            <Route component={NotFound} />
                        </Switch>
                        <Footer/>
                    </BrowserRouter>
                </GuideProvider>
            </>
        );
    }
}

export default App;
