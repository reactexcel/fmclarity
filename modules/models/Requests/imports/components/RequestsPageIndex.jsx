/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React, { Component } from 'react';

import { FacilityFilter } from '/modules/models/Facilities';
import { RequestActions, RequestsTable } from '/modules/models/Requests';

import { RequestFilter } from '/modules/models/Requests';
/**
 * @class 			RequestsPageIndex
 * @memberOf 		module:models/Requests
 */

export default class RequestsPageIndex extends Component {

	constructor(props){
		super(props);

		this.state = {
			requests: props.requests
		};

	}

	componentWillReceiveProps( props ){
		this.props = props;
		this.setState( {
			requests: props.requests
		} )
	}

	render() {
		let { team, facility, facilities, requests, selectedRequest } = this.props;

		if( !team ) {
			return <div/>
		}

		if( selectedRequest ) {
			RequestActions.view.run( selectedRequest );
		}

		return (
			<div>
				<div className = "row">
					<div className="col-xs-3">
						<FacilityFilter items = { facilities } selectedItem = { facility } />
					</div>
					{/*
					<div className="col-xs-offset-3 col-xs-3">
						<RequestFilter
							items = { [ "All", "Cancelled", "Deleted", "Closed", "Reversed", "PMP", "Rejected" ] }
							onChange = { ( item ) => {
								requests = this.props.user.getRequests( { $and: [ item, this.props.contextFilter ] } )
								this.setState( { requests } )
							} }
						 />
					</div>
					*/}
				</div>
				<div className = "issue-page animated fadeIn" style = { {paddingTop:"50px"} }>
					<div className = "ibox">
						<RequestsTable requests = { this.state.requests }/>
					</div>
				</div>
			</div>
		)
	}
}
