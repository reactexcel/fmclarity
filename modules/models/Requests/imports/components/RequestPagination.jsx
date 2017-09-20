import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

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
      previousPage: null,
      onPageChange: props.onPageChange
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
  }

  onPageChange = (pageNumber) => {
    this.setState({
      currentPage: pageNumber
    });
    if (this.state.onPageChange) {
      this.state.onPageChange(pageNumber);
    }
    this.propagatePaginationItems();
  };

  propagatePaginationItems() {
    let numberOfPages = Math.ceil(this.state.totalCollectionCount / this.state.itemsPerPage);
    let paginationItems = [];
    let currentPage = this.state.currentPage;

    if (currentPage > 5) {
      paginationItems.push({
        pageNumber: 0,
        label: 1,
        clickable: true,
        click: () => {
          this.onPageChange(0);
        }
      });
      paginationItems.push({
        clickable: false
      });
    }

    for (let x = 0; x < numberOfPages; x++) {
      if (x > currentPage + 2) {
        continue;
      }
      if (x < currentPage - 2) {
        continue;
      }

      paginationItems.push({
        pageNumber: x,
        label: x + 1,
        clickable: true,
        click: () => {
          if (currentPage === x) {
            return null;
          }
          this.onPageChange(x);
        }
      });
    }

    if (currentPage < numberOfPages - 6) {
      paginationItems.push({
        clickable: false
      });
      paginationItems.push({
        pageNumber: numberOfPages - 1,
        label: numberOfPages,
        clickable: true,
        click: () => {
          this.onPageChange(numberOfPages - 1);
        }
      });
    }

    return paginationItems;
  }

  render() {
    let paginationItems = this.state.paginationItems.map( ( item, index ) => {
      return item.clickable ? (
        <FlatButton label={ item.label }
                    key={ index }
                    backgroundColor={ item.pageNumber === this.state.currentPage ? '#0152b5' : null }
                    onClick={ item.click }
                    style={{
                      color: item.pageNumber === this.state.currentPage ? '#FFF' : '#000',
                      minWidth: 40,
                      width: 40,
                      marginLeft: 5,
                      marginRight: 5
                    }}
        />
      ) : (
        <span className="ellipsis" style={{ marginLeft: 10, marginRight: 10 }}>...</span>
      );
    });

    if (paginationItems.length <= 1) {
      return null;
    }

    return (
      <div className="row">
        <div className="col-xs-8 col-xs-offset-2">
          <div className="paginationRequest">{paginationItems}</div>
        </div>
      </div>
    )
  };
}
