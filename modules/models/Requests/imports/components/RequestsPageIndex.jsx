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
			listSize: "25",
			statusFilter:props.statusFilter,
			contextFilter:props.contextFilter,
			totalPage: 1,
			count:[0],
			countLimit:9,
			countLimitBelow:0,
			countLimitAbove:9
		};

	}

	componentWillReceiveProps( props ){
		let requests = this.props.requests,
			listSize = this.state.listSize;

		if( !requests ) {
			return;
		}

		let totalPage = Math.ceil( this.props.requests.length /  parseInt( this.state.listSize ) );
		let count = [0];

		for( let i = 1; i <= totalPage - 1 ; i++ ){
			count.push(i);
		}

		this.setState( { totalPage ,count }, () => {
			let listSize = this.state.listSize;
			let currentPage = this.state.currentPage;
			this.pagingRequest(listSize,currentPage);
		} );
	}

	componentWillMount() {
		let requests = this.props.requests,
			listSize = this.state.listSize;

		if( !requests ) {
			return;
		}

		let totalPage = Math.ceil( this.props.requests.length /  parseInt( this.state.listSize ) );
		let count = [0];

		for( let i = 1; i <= totalPage - 1 ; i++ ){
			count.push(i);
		}

		this.setState( { totalPage ,count }, () => {
			let listSize = this.state.listSize;
			let currentPage = this.state.currentPage;
			this.pagingRequest(listSize,currentPage);
		} );
	}

	pagingRequest(listSize,currentPage){
		let user = Meteor.user();
		let query = [];
        if( user.getRole() != "fmc support" ) {
			query.push( {
				'members._id': user._id
			} );
		}

		//if filter passed to function then add that to the query
		if ( this.props.statusFilter ) {
			query.push( this.props.statusFilter );
		}
		if ( this.props.contextFilter ) {
			query.push( this.props.contextFilter );
		}
		//perform query
		var requests = Requests.find( {
			$and: query
		},  {
			limit: parseInt(listSize ),
			skip: (currentPage * parseInt( listSize )),
		} )
		.fetch( {
			sort: {
				createdAt: 1
			}
		} );

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

		let paginationButton = this.state.count.map((val,i) => {
			if(this.state.totalPage > this.state.countLimit){
				if(i >= this.state.countLimitBelow && i <= this.state.countLimitAbove){
					return <a onClick={() => {
						let componet = this,
						previousPage = val - 1,
						currentPage = val ,
						nextPage = val + 1 ;
						componet.setState({
							currentPage,
							previousPage,
							nextPage,
						},() => componet.pagingRequest(this.state.listSize,currentPage))
					}} className = {i === this.state.currentPage ? "active" : ""} key = {i}>{val + 1 }</a>
				}
			}else if (this.state.totalPage < this.state.countLimit) {
				return <a onClick={() => {
					let componet = this,
					previousPage = val - 1,
					currentPage = val ,
					nextPage = val + 1 ;
					componet.setState({
						currentPage,
						previousPage,
						nextPage,
					},() => componet.pagingRequest(this.state.listSize,currentPage))
				}} className = {i === this.state.currentPage ? "active" : ""} key = {i}>{val + 1 }</a>
			}
			else{
				return null
			}
		})
		
		return (
			<div>
				<div className = "row">
					<div className="col-xs-3">
						<FacilityFilter items = { facilities } selectedItem = { facility } />
					</div>
					<div className="col-xs-offset-3 col-xs-3 desktop-only">
						<RequestFilter items = { [ 'Open', 'New', 'Issued', 'Complete', 'Close', 'Booking', 'Cancelled' ] } selectedItem = { selectedStatus } />
					</div>
				</div>

				<div className="col-xs-12">
						<div className="row">
								<div className="col-xs-12" style={{marginTop:"50px",textAlign:"center"}}>
									<div className="paginationRequest">
	     							<a style={{fontSize:"20px",padding:"4px 16px"}} onClick={() => {
											if(this.state.currentPage === 0){
												return
											}else if (this.state.totalPage > this.state.countLimit && this.state.currentPage === this.state.countLimitBelow){
												let componet = this,
												countLimitBelow = this.state.countLimitBelow - 1,
												countLimitAbove = this.state.countLimitAbove - 1,
												nextPage = this.state.currentPage,
												currentPage = this.state.previousPage,
												previousPage = this.state.previousPage -1;
												componet.setState({
													countLimitBelow,
													countLimitAbove,
													currentPage,
													previousPage,
													nextPage,
													},() => componet.pagingRequest(this.state.listSize,currentPage)
												)
											}else{
												let componet = this,
												nextPage = this.state.currentPage,
												currentPage = this.state.previousPage,
												previousPage = this.state.previousPage -1;
												componet.setState({
													currentPage,
													previousPage,
													nextPage,
												},() => componet.pagingRequest(this.state.listSize,currentPage))
											}
										}}>&laquo;</a>
										{paginationButton}
	     							<a style={{fontSize:"20px",padding:"4px 16px"}} onClick={() => {
											if(this.state.currentPage === this.state.totalPage - 1){
												return
											}else if (this.state.totalPage > this.state.countLimit && this.state.currentPage === this.state.countLimitAbove){
												let componet = this,
												countLimitBelow = this.state.countLimitBelow + 1,
												countLimitAbove = this.state.countLimitAbove + 1,
												previousPage = this.state.currentPage,
												currentPage = this.state.nextPage,
												nextPage = this.state.nextPage + 1 ;
												componet.setState({
													countLimitBelow,
													countLimitAbove,
													currentPage,
													previousPage,
													nextPage,
													},() => componet.pagingRequest(this.state.listSize,currentPage)
												)
											}
											else{
												let componet = this,
												previousPage = this.state.currentPage,
												currentPage = this.state.nextPage,
												nextPage = this.state.nextPage + 1 ;
												componet.setState({
													currentPage,
													previousPage,
													nextPage,
												},() => componet.pagingRequest(this.state.listSize,currentPage))
											}
										}} >&raquo;</a>
	   							</div>
							</div>
						</div>
				</div>
				<div className = "issue-page animated fadeIn" style = { {paddingTop:"20px"} }>
					<div className = "ibox">
						<RequestsTable requests = { this.state.requests }/>
					</div>
				</div>
			</div>
		)
	}
}
