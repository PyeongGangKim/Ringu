import React, { Component, Fragment } from 'react';


import TermsBody from './TermsBody';

import '../../scss/terms/terms.scss';



import URL from '../../helper/helper_url';
import API from '../../utils/apiutils';



class Terms extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            tab: "이용약관",
            usingTerms: [],
            saleTerms: [],
            personalTerms: [],

        }
    }

    async componentDidMount(){
        let state = this.state;
        state.tab = (this.props.title === "personal") ? "개인정보 처리방침" : "이용약관";
        try{
            const using_terms = await API.sendGet(URL.api.terms.getTerms , {type:"이용약관"});
            const sale_terms = await API.sendGet(URL.api.terms.getTerms,{type:"판매홍보 대행약관"});
            const personal_terms = await API.sendGet(URL.api.terms.getTerms,{type:"개인정보 처리방침"});
            if(using_terms.status == 200){
                console.log(using_terms.data.term);
                state.usingTerms = using_terms.data.term;
            }
            if(sale_terms.status == 200){
                state.saleTerms = sale_terms.data.term;
            }
            if(personal_terms.status == 200){
                state.personalTerms = personal_terms.data.term;
            }
            this.setState(state);
            console.log(this.state);
        }
        catch(err){
            console.error(err);
        }
        
    }
    handleSelectedPage(selectedtab){
        let state = this.state;
        state.tab = selectedtab
        this.setState({
            state
        });
    }
  
    
    render(){
        const state = this.state;
        
        return(
            <div id="terms">
                <div className="tab-nav">
                    <ul className = "list">
                        <div className = "element">
                            <button className={"tab-btn " + (state.tab === "이용약관" ? "active" : "")} onClick={() => this.handleSelectedPage("이용약관")} >이용약관</button>
                        </div>
                        <div className = "element">
                            <button className={"tab-btn " + (state.tab === "판매홍보 대행약관" ? "active" : "")} onClick={() => this.handleSelectedPage("판매홍보 대행약관")} >판매홍보 대행약관</button>
                            
                        </div>
                        <div className = "element">
                            <button className={"tab-btn " + (state.tab === "개인정보 처리방침" ? "active" : "")} onClick={() => this.handleSelectedPage("개인정보 처리방침")}>개인정보 처리방침</button>
                        </div>
                    </ul>
                    
                </div>
                <div>
                    <TermsBody props = {
                        {
                            type: state.tab,
                            articles : (state.tab === "이용약관") ? state.usingTerms : (state.tab === "판매홍보 대행약관") ? state.saleTerms : state.personalTerms,
                        }
                    }/>
                </div>

            </div>

        );
        
    }
}

export default Terms;