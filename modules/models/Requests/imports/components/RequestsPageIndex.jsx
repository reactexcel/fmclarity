/**
 * @author      Leo Keith <leo@fmclarity.com>
 * @copyright    2016 FM Clarity Pty Ltd.
 */
import React, {Component} from 'react';

import {FacilityFilter} from '/modules/models/Facilities';
import {RequestActions, RequestsTable} from '/modules/models/Requests';

import {RequestFilter} from '/modules/models/Requests';
import RequestPagination from './RequestPagination';
import { hideLoader } from '/modules/ui/Loader/imports/components/Loader'

import {Switch} from '/modules/ui/MaterialInputs';
import moment from 'moment';
import Perf from 'react-addons-perf';

/**
 * @class      RequestsPageIndex
 * @memberOf    module:models/Requests
 */

export default class RequestsPageIndex extends Component {
  pageSize = 25;

  constructor(props) {
    super(props);

    this.state = {
      currentPage: 0,
      status: this.props.selectedStatus,
      statusFilter: this.props.statusFilter,
      facility: this.props.facility,
      contextFilter: this.props.contextFilter,
      totalCollectionCount: 0
    };
    let { requests, totalCollectionCount } = this.getRequests();
    this.state['requests'] = requests;
    this.state['totalCollectionCount'] = totalCollectionCount;
  }

  componentWillReceiveProps(props) {
    if (props.user) {
      this.setState(this.getRequests());
    }
  }

  changeCurrentPage = (pageNum) => {
    this.setState({
      currentPage: pageNum
    }, () => {
      this.setState(this.getRequests());
    });
  };

  onFacilityChange = (facility) => {
    let contextFilter = {};
    if (facility && facility._id) {
      contextFilter['facility._id'] = facility._id;
    }
    this.setState({
      facility: facility,
      contextFilter: contextFilter,
      currentPage: 0
    });
    this.setState(this.getRequests());
  };

  onStatusChange = (status) => {

    let statusFilterResult = this.props.getStatusFilter(status);
    let statusFilter = statusFilterResult.statusFilter;
    status = statusFilterResult.selectedStatus;

    this.setState({
      status: status,
      statusFilter: statusFilter,
      currentPage: 0
    });
    this.setState(this.getRequests());
  };

  getRequests() {
    let requests = [];
    let totalCollectionCount = 0;
    if (this.props.user) {
      ({ requests, totalCollectionCount } = this.props.user.getRequests(
        {$and: [this.state.statusFilter, this.state.contextFilter]}, { expandPMP: false, skip: this.state.currentPage, limit: this.pageSize }
      ));
    }

    return {
      requests: requests,
      totalCollectionCount: totalCollectionCount
    };
  }

  render() {
    let { team, facilities, selectedRequest } = this.props;
    let { facility, status, requests } = this.state;

    if (!team) {
      return <div/>
    }

    if (selectedRequest) {
      RequestActions.view.run(selectedRequest);
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-3">
            { this.props.thumbsReady ? 
              <FacilityFilter items={ facilities } selectedItem={ facility } onChange={ facility => this.onFacilityChange(facility) } />: 
              null }
          </div>
          <div className="col-xs-offset-3 col-xs-3 desktop-only">
            <RequestFilter
              items={ ['Open', 'Preventative', 'All', 'New', 'Booking', 'Issued', 'Complete', /*'Close',*/ 'Cancelled'] }
              selectedItem={ status } onChange={ status => this.onStatusChange(status) }  />
          </div>
        </div>
        <div className="issue-page animated fadeIn" style={ {paddingTop: "50px"} }>
          { team && requests.length === 0 ?
            <div className="middle-box text-center animated fadeInDown"
                 style={{textAlign: 'center', paddingTop: '5px', paddingBottom: '5px', backgroundColor: 'white'}}>
              <h3 className="font-bold">Filter returned empty results</h3>
              <div className="error-desc">
                <p>No {(status && status !== 'All') ? status : ''} requests found.</p>
              </div>
            </div> :
            <div>
              <div className="ibox">
                <RequestsTable requests={ this.state.requests } selectedItem={status} />
              </div>
              { this.state.totalCollectionCount > this.pageSize ? <RequestPagination
                totalCollectionCount={ this.state.totalCollectionCount }
                itemsPerPage={ this.pageSize } currentPage={ this.state.currentPage }
                onPageChange={ pageNumber => {
                  this.changeCurrentPage(pageNumber);
                }} /> : null }
            </div>
          }
        </div>
      </div>
    )
  }
}
