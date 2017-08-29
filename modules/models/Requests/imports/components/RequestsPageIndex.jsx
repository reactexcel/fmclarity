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

  constructor(props) {
    super(props);

    this.state = {
      requests: props.requests,
      totalCollectionCount: props.totalCollectionCount,
      pageSize: props.pageSize,
      currentPage: props.currentPage,
      active: false,
    };

  }

  componentWillReceiveProps(props) {
    this.props = props;

    this.setState({
      requests: props.requests,
      totalCollectionCount: props.totalCollectionCount,
      pageSize: props.pageSize,
      currentPage: props.currentPage,
    })
  }

  componentWillMount() {
    //Perf.start();
  }

  componentDidMount() {
    /*
     Perf.stop();
     console.log('output requests page load time');
     Perf.printInclusive();
     */
    // Perf.printWasted();
  }

  render() {
    let {team, facility, facilities, requests, selectedRequest, selectedStatus} = this.props;
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
            <FacilityFilter items={ facilities } selectedItem={ facility }/>
          </div>
          <div className="col-xs-offset-3 col-xs-3 desktop-only">
            <RequestFilter
              items={ ['Open', 'Preventative', 'All', 'New', 'Booking', 'Issued', 'Complete', /*'Close',*/ 'Cancelled'] }
              selectedItem={ selectedStatus }/>
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
          <div className="ibox">
            <RequestsTable requests={ this.state.requests } selectedItem={selectedStatus}/>
          </div>
          <RequestPagination totalCollectionCount={ this.state.totalCollectionCount }
                             itemsPerPage={ this.state.pageSize } currentPage={ this.state.currentPage }/>
        </div>
      </div>
    )
  }
}
