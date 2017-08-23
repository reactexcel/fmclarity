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
    let currentPage = this.state.currentPage;

    // previous button
    if (currentPage - 1 > 0) {
      paginationItems.push({
        pageNumber: currentPage - 1,
        label: 'Prev',
        click: () => {
          Session.set('currentRequestPageNumber', currentPage - 1);
          this.setState({
            currentPage: currentPage - 1
          })
        }
      });
    }

    for (let x = 0; x < numberOfPages; x++) {

      if (x > currentPage + 4) {
        continue;
      }
      if (x < currentPage - 3) {
        continue;
      }

      paginationItems.push({
        pageNumber: x,
        label: x + 1,
        click: () => {
          Session.set('currentRequestPageNumber', x);
          this.setState({
            currentPage: x
          })
        }
      });
    }

    // next button
      paginationItems.push({
        pageNumber: currentPage + 1,
        label: 'Next',
        click: () => {
          Session.set('currentRequestPageNumber', currentPage + 1);
          this.setState({
            currentPage: currentPage + 1
          })
        }
      });

    return paginationItems;
  }

  render() {
    let paginationItems = this.state.paginationItems.map( ( item, index ) => {
      return (
        <a key={index}
           onClick={ () => { item.click() } }
           className={ item.pageNumber === this.state.currentPage ? 'active' : null }>{ item.label }</a>
      );
    });

    if (paginationItems.length === 2) {
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