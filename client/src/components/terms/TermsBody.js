import React, { Component, Fragment, useEffect } from 'react';




import '../../scss/terms/terms.scss';

import TopButton from '../common/TopButton';





const TermsBody = (props) => {
    const [currentTab, setCurrentTab] = React.useState();
    
    let title = props.props.type;
    let articles = props.props.articles;
    let one_line_number = (articles.length % 3 === 0) ? parseInt(articles.length / 3) : parseInt(articles.length / 3) + 1; 
    
    const [selectedArticle,setSelectedArticle] = React.useState(0);
    const articleRef = React.useRef([]);

    function handleSelectedArticle ( article){
        setSelectedArticle(article);
        
    };
    function handleClick(idx){
        
        articleRef.current[idx].scrollIntoView({ 
            block: "center", 
        });
          
    };
    
    
   
       
        
    return(
            <div  className = "termsBody">
                    <div className = "title"> 
                        {title}
                    </div>
                <div className = "vertical-part">
                    <div className = "horizontal-part">
                        <ul className = "set-list">
                        {
                            articles.slice(0,one_line_number).map((article,idx) =>{
                                return(
                                    <li className="list" key = {idx}>
                                        <button className = {"tab-btn " + (selectedArticle === idx ? "active" : "")} onClick={() => {handleClick(idx);setCurrentTab(articleRef.current[idx]);handleSelectedArticle(idx);}}>
                                            {article.content_title}
                                        </button>
                                    </li>
                                );
                            })
                        }
                        </ul>
                        <ul className = "set-list">
                        {
                            articles.slice(one_line_number*1,one_line_number*2).map((article,idx) =>{
                                idx = idx + one_line_number*1;
                                return(
                                    <li className="list" key = {idx}>
                                        <button className = {"tab-btn " + (selectedArticle === idx ? "active" : "")} onClick={() => {handleClick(idx);setCurrentTab(articleRef.current[idx]);handleSelectedArticle(idx);}} >
                                            {article.content_title}
                                        </button>
                                    </li>        
                                );
                            })
                        }
                        </ul>
                        <ul className = "set-list">
                        {
                            articles.slice(one_line_number*2,one_line_number*3).map((article,idx) =>{
                                idx = idx + one_line_number*2;
                            
                                return(
                                    <li className="list" key = {idx}>
                                        <button className = {"tab-btn " + (selectedArticle === idx ? "active" : "")} onClick={() => {handleClick(idx);setCurrentTab(articleRef.current[idx]);handleSelectedArticle(idx);}}>
                                            {article.content_title}
                                        </button>
                                    </li>
                                );
                            })
                        }
                        </ul>
                    </div>
                </div>
                
                
                <div className = "body">
                    {
                        articles.slice(0,articles.length).map((article,idx) =>{
                            return(
                                <div >
                                    {
                                        (article.general_rules !== null) && <div className = "general-rules"> {article.general_rules}</div>
                                    }
                                    
                                    <div className = "content-title" ref ={el => (articleRef.current[idx] = el)}>
                                        {article.content_title}
                                    </div>
                                    <div className = "content">
                                        {
                                            article.content.split("\n").map((line) => {
                                                return(
                                                    <span>
                                                        {line}
                                                        <br/>
                                                    </span>

                                                );
                                            })
                                        }
                                    
                                    </div>
                                </div>
                            );
                        })
                    }
                    
                </div>
                <div className = "top-button">
                    <TopButton/>
                </div>

            </div>

        );
        
}


export default TermsBody;