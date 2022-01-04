import React, {Component}  from 'react';
import Pagination from "react-js-pagination";
import '../../scss/common/pagination.scss';

class Paging extends Component {
    constructor(props){
        super(props)
        
        this.perPage = 'perPage' in this.props && typeof this.props.perPage !== 'undefined' ? this.props.perPage : 5;
        this.disp = 'disp' in this.props && typeof this.props.disp !== 'undefined' ? this.props.disp : 5;
        this.onChange = this.props.onChange;
        
        this.state = {
            page: this.props.page,
            count: this.props.count,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ page: props.page, count: props.count })
    }

    render(){
        var state = this.state;

        return (
            <Pagination
                activePage={state.page}
                itemsCountPerPage={this.perPage}
                totalItemsCount={state.count}
                pageRangeDisplayed={this.disp}
                prevPageText={"<"}
                nextPageText={">"}
                hideFirstLastPages={true}
                onChange={this.onChange}
            />
        )
    }
}

export default Paging;
