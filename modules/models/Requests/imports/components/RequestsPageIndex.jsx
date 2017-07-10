/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React, { Component } from 'react';

import { FacilityFilter } from '/modules/models/Facilities';
import { RequestActions, RequestsTable } from '/modules/models/Requests';

import { RequestFilter } from '/modules/models/Requests';

import { Switch } from '/modules/ui/MaterialInputs';
import { Select } from '/modules/ui/MaterialInputs';
import moment from 'moment';
import Perf from 'react-addons-perf';
import { Requests } from '/modules/models/Requests';

/**
 * @class 			RequestsPageIndex
 * @memberOf 		module:models/Requests
 */

export default class RequestsPageIndex extends Component {

	constructor(props){
		super(props);
		this.state = {
			user : props.user,
			requests: props.requests,
			active: false,
			currentPage: 0,
			nextPage: 1,
			previousPage: -1,
			listSize: "10",
			statusFilter:props.statusFilter,
			contextFilter:props.contextFilter,
			totalPage: 1
		};

	}

	componentWillReceiveProps( props ){
		let totalPage = Math.ceil( this.props.requests.length /  parseInt( this.state.listSize ) );
		this.setState({
			totalPage
		})
		this.pagingRequest(props);
		// console.log(props,this.state);
	}

	componentWillMount() {
		let totalPage = Math.ceil( this.props.requests.length /  parseInt( this.state.listSize ) );
		this.setState({
			totalPage
		})
		this.pagingRequest(this.props);
	}

	pagingRequest(props){
		let user = this.state.user
		let query = [ {
			'members._id': user._id
		} ]

		if ( user.role == 'admin' ) {
			query = [ { _id: { $ne: null } } ]
		}

		//if filter passed to function then add that to the query
		if ( props.statusFilter ) {
			query.push( props.statusFilter );
		}
		if ( props.contextFilter ) {
			query.push( props.contextFilter );
		}

		//perform query
		var requests = Requests.find( {
			$and: query
		},  {
					limit: parseInt( this.state.listSize ),
					skip: (this.state.currentPage * parseInt(  this.state.listSize )),
			} )
		.fetch( {
			sort: {
				createdAt: 1
			}
		} );
		// console.log(requests,"test");
		this.setState({
			requests
		})

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
		let { team, facility, facilities, requests, selectedRequest, selectedStatus } = this.props;
		let user = Meteor.user();
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
					<div className="col-xs-offset-3 col-xs-3 desktop-only">
						<RequestFilter items = { [ 'Open', 'New', 'Issued', 'Complete', 'Close', 'Cancelled' ] } selectedItem = { selectedStatus } />
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
				<div className="col-xs-12">
						<div className="row">
								<div className="col-xs-3">
									<span>Select list size</span>
										<Select
												value={this.state.listSize}
												items={["10", "25", "50", "100", "200", "400" ]}
												onChange={ ( listSize ) => {
														let componet = this;
														let totalPage = Math.ceil( this.props.requests.length /  parseInt( listSize || "400" ) );
														this.setState({
															 listSize: listSize || "400" ,
															 currentPage: 0,
															 nextPage: 1,
															 previousPage: -1,
															 totalPage
														 },() => componet.pagingRequest(componet.props))
												}}
												/>
								</div>
								<div className="col-xs-9">
										<span style={{float: "right"}}>
											{this.state.currentPage > 0 ?
														<button
																title="Go to previous page"
																className="btn btn-flat btn-primary"
																onClick={() => {
																		let componet = this,
																				nextPage = this.state.currentPage,
																				currentPage = this.state.previousPage,
																				previousPage = this.state.previousPage -1;
																		componet.setState({
																				currentPage,
																				previousPage,
																				nextPage,
																		},() => componet.pagingRequest(componet.props))
																}}>
																<i className="fa fa-backward"></i>
																 <span> Previous</span>
														</button> : null
													}
													{
														this.state.totalPage - 1 != this.state.currentPage ?
														<button
																title="Go to next page"
																className="btn btn-flat btn-primary"
																onClick={() => {
																		let componet = this
																				previousPage = this.state.currentPage;
																				currentPage = this.state.nextPage,
																				nextPage = this.state.nextPage + 1,
																		componet.setState({
																				currentPage,
																				previousPage,
																				nextPage,
																		},() => componet.pagingRequest(componet.props))
																}}>
																<i className="fa fa-forward"></i>
																<span> Next</span>
														</button>: null }
										</span>
								</div>
						</div>
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
