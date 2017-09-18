/**
 * @author      Leo Keith <leo@fmclarity.com>
 * @copyright    2016 FM Clarity Pty Ltd.
 */
import React, {Component} from 'react';

import {FacilityFilter} from '/modules/models/Facilities';
import {RequestActions, RequestsTable} from '/modules/models/Requests';

import {RequestFilter} from '/modules/models/Requests';
import RequestPagination from './RequestPagination';

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
      requests: [],
      currentPage: 0,
      status: this.props.selectedStatus,
      statusFilter: this.props.statusFilter,
      facility: this.props.facility,
      contextFilter: this.props.contextFilter,
      totalCollectionCount: 0,
    };
  }

  componentWillReceiveProps() {
    this.getRequests();
  }

  changeCurrentPage = (pageNum) => {
    this.setState({
      currentPage: pageNum
    }, () => {
      this.getRequests();
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
    this.getRequests();
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
    this.getRequests();
  };

  getRequests() {
    let {requests, totalCollectionCount } = this.props.user.getRequests(
      {$and: [this.state.statusFilter, this.state.contextFilter]}, { expandPMP: true, skip: this.state.currentPage, limit: this.pageSize }
    );

    this.setState({
      requests: requests,
      totalCollectionCount: totalCollectionCount
    });
  }

  render() {
    let { team, facilities, selectedRequest } = this.props;
    let { facility, status, requests } = this.state;

    let user = Meteor.user();
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
            <FacilityFilter items={ facilities } selectedItem={ facility } onChange={ facility => this.onFacilityChange(facility) } />
          </div>
          <div className="col-xs-offset-3 col-xs-3 desktop-only">
            <RequestFilter
              items={ ['Open', 'Preventative', 'All', 'New', 'Booking', 'Issued', 'Complete', /*'Close',*/ 'Cancelled'] }
              selectedItem={ status } onChange={ status => this.onStatusChange(status) }  />
          </div>
          { /*user.getRole && user.getRole() == 'fmc support' ?
           <div className="col-xs-offset-9 col-xs-3" >
           <Switch
           value={ this.state.active}
           onChange={ ( active ) => {
           if( active ) {
           let now  = new Date(),
           requests = _.filter( this.state.requests, (r) => moment( r.dueDate ).isBefore( now ) );
           this.setState( { active: active, requests: requests } );
           } else {
           this.setState( { active: active, requests: this.props.requests } );
           }
           }}>
           Show Overdue Work Order only
           </Switch>
           </div> : null
           */ }
        </div>
        <div className="issue-page animated fadeIn" style={ {paddingTop: "50px"} }>
          { team && requests.length === 0 ?
            <div className="middle-box text-center animated fadeInDown"
                 style={{textAlign: 'center', paddingTop: '5px', paddingBottom: '5px', backgroundColor: 'white'}}>
              <h3 className="font-bold">Filter returned empty results</h3>
              <div className="error-desc">
                <p>No {(status && status != 'All') ? status : ''} requests found.</p>
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
