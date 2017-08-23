import React, { Component } from 'react';

/**
 * @class 			RequestsPageIndex
 * @memberOf 		module:models/Requests
 */

export default class RequestPagination extends Component {

  constructor(props){
    super(props);

    this.state = {
      totalCollectionCount: props.totalCollectionCount,
      itemsPerPage: props.itemsPerPage,
      currentPage: props.currentPage,
      paginationItems: [],
      nextPage: props.currentPage + 1,
      previousPage: null
    };
    this.state.paginationItems = this.propagatePaginationItems();

  }

  componentWillReceiveProps( props ){
    this.props = props;
    this.setState({
      totalCollectionCount: props.totalCollectionCount,
      itemsPerPage: props.itemsPerPage,
      currentPage: props.currentPage,
    });
    this.setState({
      paginationItems: this.propagatePaginationItems()
    });
    console.log(this.state)

  }



  propagatePaginationItems() {

    let numberOfPages = Math.ceil(this.state.totalCollectionCount / this.state.itemsPerPage);
    let paginationItems = [];
    for (let x = 0; x < numberOfPages; x++) {
      paginationItems.push({
        pageNumber: x,
        click: () => {
          Session.set('currentRequestPageNumber', x);
          this.setState({
            currentPage: x,
            nextPage: x + 1 <= numberOfPages ? x + 1 : null,
            previousPage: x - 1 > -1 ? x - 1 : null,
          })
        }
      });
    }

    return paginationItems;
  }

  render() {
    let paginationItems = this.state.paginationItems.map( ( item, index ) => {
      return (
        <a key={index}
           onClick={ () => { item.click() } }
           className={ item.pageNumber === this.state.currentPage ? 'active' : null }>{ item.pageNumber + 1 }</a>
      );
    });

    if (paginationItems.length === 1) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-xs-5">
        </div>
        <div className="col-xs-7">
          <div className="paginationRequest">{paginationItems}</div>
        </div>
      </div>
    )
  };

}