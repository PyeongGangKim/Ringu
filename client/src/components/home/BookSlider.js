import React, { useRef } from 'react';
import Slider from "react-slick";

import BookCard from '../book/BookCard'

import '../../scss/common/slick.scss'
import '../../scss/book/slider.scss'

const settings = {
    arrows: false,
    dots: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipe: false,
};

function BookSlider({
    title,
    bookList
}) {
    const slider = useRef()

    const next = () => {
        slider.current.slickNext();
    }
    
    const previous = () => {
        slider.current.slickPrev();
    }

    return (
        <div className="book-slider slick-container">
            <div className="slider-title">
                <h2> {title} </h2>
            </div>

            {
                bookList.length > 5 &&
                <div className="slick--arrow">
                    <div className="slick-arrow-wrapper">
                        <a className="slick-arrow arrow-left" onClick={previous}>
                            <em/>
                        </a>
                        <a className="slick-arrow arrow-right" onClick={next}>
                            <em/>
                        </a>
                    </div>
                </div>
            }

            <div className="slider slick-slider-wrapper">
                <Slider ref={slider} infinite={bookList.length > 5 ? true: false} {...settings}>
                    {
                        bookList.map(item => {
                            var status = '';
                            if(item.type === 2) {
                                status  = 'pub'
                            } else {
                                status  = 'ser'
                            }
                            return (
                                <BookCard
                                    key={item.id}
                                    book={item}
                                    status={status}
                                    favorite
                                />
                            )
                        })
                    }
                </Slider>
            </div>
        </div>
    )
}

export default BookSlider;