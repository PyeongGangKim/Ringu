import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from "react-intersection-observer";

import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';

import BookCard from '../../components/book/Book'

function AuthorNavbar(user, isHost, authorId, handleDisplayClick, handleUpdate ) {
    const [section, setSection] = useState('a');
    const [modifying, setModifying] = useState(false);
    const [reviewTitleList, setReviewTitleList] = useState([]);
    const [bookList, setBookList] = useState({});
    const [reviewList, setReviewList] = useState([]);
    const [title, setTitle] = useState(0);

    
    const [refIntro, inViewIntro] = useInView({
        threshold: 0.2
    });

    const [refBook, inViewBook] = useInView({
        threshold: 0.2
    });

    const [refReview, inViewReview] = useInView({
        threshold: 0.2
    });

    useEffect(async() => {
        const res = await API.sendGet(URL.api.book.list, params = {author_id: authorId})
        if(res.status === 200) {
            var bl = res.data.bookList

            var waitingList = bl.filter(book => {
                return book.is_approved === 0
            })

            bl = bl.filter(book => {
                return book.is_approved === 1
            })

            var serialList = bl.filter(book => {
                return book.type === 1
            })

            var serList = serialList.filter(book => {
                return book.is_finished_serialization === 0
            })

            if(serList.length !== 0) {
                bookList['ser'] = serList
            }

            var seredList = serialList.filter(book => {
                return book.is_finished_serialization === 1
            })

            if(seredList.length !== 0) {
                bookList['ser-ed'] = seredList
            }

            var pubList = bl.filter(book => {
                return book.type === 2
            })

            if(pubList.length !== 0) {
                bookList['pub'] = pubList
            }

            if(waitingList.length !== 0) {
                bookList['wait'] = waitingList
            }

            setBookList(bookList)
        }

        try {
            var params = {
                title: true, 
                author_id: authorId
            }
            const reviewRes = await API.sendGet(URL.api.review.getReviewList, params)

            if(reviewRes.status === 200) {
                var reviewData = reviewRes.data

                setReviewList(reviewData.reviewList)
                setReviewTitleList(reviewData.reviewTitleList)
            }
        } catch(e) {
            alert("????????? ???????????? ??? ????????????")
        }


    }, []);


    const activeTab = () => {
        if (inViewIntro) {
            return 1;
        } else if (inViewBook) {
            return 2;
        } else if (inViewReview) {
            return 3;
        }
    };

    const handleModifyClick = async(evt, isModifying) => {
        if(isModifying) {
            try {
                const res = await API.sendPut(URL.api.member.update, {description: user.description})
                if(res.status === 200){
                    alert("?????????????????????.")
                    setModifying(false)
                } else {
                    alert("????????? ?????????????????????.")
                }
            } catch(e) {
                alert("????????? ????????? ???????????? ????????? ?????????????????????.")
            }            
        } else {
            setModifying(true)
        }
    }

    const handleTitleClick = async(title, book_id) => {
        setTitle(title);

        var params = {
            title: false,
        }
        if(book_id !== null) {
            params['book_id'] = book_id;
        } else {
            params['author_id'] = authorId;
        }

        try {
            const reviewRes = await API.sendGet(URL.api.review.getReviewList, params = params)
            if(reviewRes.status === 200){
                var reviewData = reviewRes.data
                setReviewList(reviewData.reviewList)
            }
        } catch(e) {
            alert("????????? ???????????? ??? ????????????.")
        }
    }

    return ( 
        <div className="tab-wrap">
            <ul className="tab-nav">
                <a href="#intro-area">
                    <li className={activeTab() === 1 ? "tab-btn active" : "tab-btn"}>??????</li>
                </a>
                <a href="#book-area">
                    <li className={activeTab() === 2 ? "tab-btn active" : "tab-btn"}>??????</li>
                </a>
                <a href="#review-area">
                    <li className={activeTab() === 3 ? "tab-btn active" : "tab-btn"}>??????</li>
                </a>
            </ul>
            <div className="tab-inner" >
                <div id="intro-area" className="inner-box" ref={refIntro}>
                    <div className="inner-header">
                        ??????
                        {
                            (isHost === true) ?
                            modifying === true ?
                            <span className="small" onClick={(evt) => handleModifyClick(evt, true)}>
                                <em/>??????
                            </span>
                            :
                            <span className="small" onClick={(evt) => handleModifyClick(evt, false)}>
                                <em/>??????
                            </span>
                            :
                            null
                        }

                    </div>
                    <div className="inner-content">
                        {
                            isHost === true && (modifying === true) ?
                            <textarea className="intro" value={user.description === null ? '' : user.description} disabled={!modifying}/>
                            :
                            <div className="intro"> {user.description === null ? '' : user.description} </div>
                        }
                    </div>
                </div>

                <div id="book-area" className="inner-box" ref={refBook}>
                    <div className="inner-header">
                        <span> ?????? </span>
                        <div className="inner-subheader-wrap">
                            <div className={section === 'a' ? "inner-subheader active" : "inner-subheader"} onClick={()=>setSection('a')}> ?????? </div>
                            <div className={section === 'ser' ? "inner-subheader active" : "inner-subheader"} onClick={()=>setSection('ser')}> ????????? </div>
                            <div className={section === 'ser-ed' ? "inner-subheader active" : "inner-subheader"} onClick={()=>setSection('ser-ed')}> ???????????? </div>
                            <div className={section === 'pub' ? "inner-subheader active" : "inner-subheader"} onClick={()=>setSection('pub')}> ?????????</div>
                            <div className={section === 'wait' ? "inner-subheader active" : "inner-subheader"} onClick={()=>setSection('wait')}> ????????? </div>
                        </div>
                    </div>
                    <div className="inner-content">
                        {
                            Object.keys(bookList).length === 0 || (section !== 'a' && !(section in bookList)) ?
                            <div className="no-content">
                                ????????? ????????? ????????????.
                            </div>
                            :
                            Object.keys(bookList).map((status, n) => {
                                return (
                                    (bookList[status].length !== 0 && (section === 'a' || section === status)) &&
                                    <div key={n} className="book-area">
                                        <div className="container">
                                            {
                                                bookList[status].map((item, idx) => {
                                                    item['status'] = status

                                                    return (
                                                        <BookCard
                                                            key={item.id}
                                                            book = {item}
                                                            user = {user}
                                                            authorId = {authorId}
                                                            status = {status}
                                                            isHost = {isHost}
                                                        />
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    
                </div>
                
                <div id="review-area" className="inner-box" ref={refReview}>
                    <div className="inner-header">
                        <span> ?????? </span>
                        {
                            reviewTitleList.length === 0 ?
                            null
                            :
                            <div className="inner-subheader-wrap">
                                <div className={"book-title " + (title === 0 ? "active" : "")} onClick={() => handleTitleClick(0, null)}> ?????? </div>
                                {
                                    reviewTitleList.map((item, title_idx) => {
                                        return (
                                            <div key={item.book_id} className={"book-title " + (title === (title_idx+1) ? "active" : "")} onClick={() => handleTitleClick(title_idx+1, item.book_id)}> {item.book_title} </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className="inner-content">
                        {
                            reviewList.length === 0 ?
                            <div className="no-content">
                                ????????? ????????? ????????????.
                            </div>
                            :
                            <div className="review-area">
                                {
                                    reviewList.map((item, review_idx) => {
                                        return (
                                            <div key={item.id} className="review-box">
                                                <div className="review-details">
                                                    <strong className="title"> {item.book_title}</strong>
                                                    <span className="user"> {item.nickname} </span>
                                                    <span className="sep">  | </span>
                                                    <span className="stars">
                                                        {"???".repeat(item.score)}
                                                    </span>

                                                    <span className="score"> {item.score ? parseFloat(item.score).toFixed(1) : parseFloat(0).toFixed(1)} </span>
                                                </div>
                                                {
                                                    item.book_type === 1 &&
                                                    <div className="review-subtitle">
                                                        {item.subtitle}
                                                    </div>
                                                }

                                                <div className="review-content">
                                                    {item.description}
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {
                                    reviewList.length >= 5 &&
                                    <div className="add-btn">
                                        <button className="add-btn btn btn-transparent"> + ????????? </button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default AuthorNavbar;