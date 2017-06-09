import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Perf from 'react-addons-perf';

import DataSet from './DataSet.jsx';
import ChildDataTable from './ChildDataTable.jsx';
import { Documents } from '/modules/models/Documents';
import { download, print } from './DataSetActions.jsx';
import { Menu } from '/modules/ui/MaterialNavigation';

import SearchInput, {createFilter} from 'react-search-input';


export default DataTable = React.createClass( {

	getInitialState() {
		var dataset = new DataSet();
		return {
			dataset: dataset,
			rows: dataset.getRows(),
			cols: dataset.getCols(),
			sortCol: this.props.sortByColumn ? this.props.sortByColumn : null,
			sortDir: this.props.sortDirection ? this.props.sortDirection : "none",
			searchTerm: ''
		}
	},

	update( { items, fields } ) {
		let rows = null,
			cols = null,
			dataset = this.state.dataset;
			let user = Meteor.user();
		if ( items && items.length ) {
			//fields = this.props.fields;
		//	console.log(fields);

			let updatedItems = _.filter(items, (i) => typeof i.lastUpdate !== "undefined"),
				restItems = _.filter(items, (i) => typeof i.lastUpdate === "undefined");

			items = updatedItems.sort( (i, j) => {
					let a = i.lastUpdate.valueOf(),
					  b = j.lastUpdate.valueOf();
					return a < b ? 1 : ( a > b ? -1 : 0);
			} ) ;

			items = items.concat( restItems )

			dataset.reset( items, fields );

			if ( this.state.sortCol ) {
				let col = this.state.sortCol,
					dir = this.state.sortDir;

				rows = dataset.sortBy( col, dir );
			} else {
				rows = dataset.getRows();
			}
			cols = dataset.getCols();

		}
		this.setState( {
			rows: rows,
			cols: cols
		} )
	},

	componentWillMount() {
		//console.log("[][][][][][][]");
		//Perf.start();
		this.update( this.props );
		if (this.props.setDataSet) {
			this.props.setDataSet(this.state.dataset);
		}
	},

	componentDidMount() {
		/*
	    Perf.stop();
	    console.log('output datatable load time');
	    Perf.printInclusive();
	    */
	},

	componentWillReceiveProps( props ) {
		this.update( props );
	},


	handleSortBy( col ) {
		let dataset = this.state.dataset,
			dir = ( this.state.sortDir != "down" ) ? "down" : "up";

		if ( this.state.sortCol != col ) {
			dir = "down";
		}

		let rows = dataset.sortBy( col, dir );

		this.setState( {
			sortCol: col,
			sortDir: dir,
			rows: rows
		} )
	},
	searchUpdated (term) {
    this.setState({searchTerm: term})
  	},

	render() {
		let { dataset, sortCol, sortDir, cols, rows } = this.state;
		let { fields, children } = this.props;
		const KEYS_TO_FILTERS = ["Prty.val", "Status.val", "Facility.val", "WO#.val", "Issue.val", "Amount.val", "Issued.val", "Due.val", "Supplier.val"];



		let user = Meteor.user(),
			facility = Session.getSelectedFacility() || {};

		if ( !cols || !rows ) {
			return <div/>
		}
		const filteredRows = rows.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
		//console.log(filteredRows.length);
		//console.log( rows );
		var unreadRows=[];
		var readRows =[];

		return (
			<div className="data-grid">
				<div className = "data-grid-title-row">
					{/*<Menu items = { [ download(dataset), print(dataset, this.refs.printable) ] } />*/}
				</div>
				<div ref="printable">
				{/*<SearchInput className="search-input" onChange={this.searchUpdated} placeholder="Filter requests"/>*/}
				<table className="table">

					<thead className="thead">

						<tr className = "data-grid-header-row">
							{ cols.map( (col,i) => {

								return (
									<th
										onClick = { () => { this.handleSortBy( col ) } }
										className = "data-grid-header-cell" key={('head'+col)}
										style={i==0?{paddingLeft:'10px'}:{}}
										id={i==cols.length-1?'last-head':'pre-head'}
									>

										<div style = {{/*position:"relative",left:"-15px"*/}}>

											<i style = {{width:"15px"}} className = {(col==sortCol)?("fa fa-arrow-"+sortDir):"fa"}></i>

											<span>{col}</span>
										</div>

									</th>
								)

							} ) }
						</tr>
					</thead>

						{ filteredRows.map( (row,rowIdx) => {
							let unread = false;
							if( row._item.unreadRecipents ){
								if( _.indexOf( row._item.unreadRecipents, user._id ) > -1){
									unread = true;
									unreadRows.push(row);
								}
							}
							if (!unread) {
								readRows.push(row);
							}

						})}
						{unreadRows.map((unreadRow, idx)=>{

							return (
							<tr
								className 	= "data-grid-row"
								key 		= { idx }
								onClick 	= { () => {
									if(this.props.onClick){
										this.props.onClick( unreadRow._item )
									}
								} }
							>
								{/*<td className="data-grid-select-col">&nbsp;</td>*/}
								{ cols.map( (col,colIdx) => {
									let styles = unreadRow[col].style?unreadRow[col].style:{}
										if(colIdx == 0){
											styles.paddingLeft = '10px';
										}
									return (
										<td
											className 	= { `data-grid-cell data-grid-col-${colIdx}` }
											key 		= {('val('+idx+','+colIdx+')-'+unreadRow[col].val)}
											style 		= {styles}
											id={colIdx==cols.length-1?'last-col':'pre-col'}
										>
											<strong style={{fontWeight: "900"}}> {unreadRow[col].val} </strong>

										</td>
									)

								} ) }
							</tr>
							)

						})}

						{readRows.map((readRow, idx)=>{
							if(this.props.MBMreport){
								let hideChild = false
								let query1 = {
									"type":"Contract"
								}
								if( facility ) {
								query1[ 'facility._id' ] = facility._id;
							}

							// if 'Service Type' exists then add to query
							if( readRow[ 'Service Type' ] ) {
								query1[ 'serviceType.name' ] = readRow[ 'Service Type' ].val;
							}
								let docs = Documents.find(query1).fetch();
								if(docs.length > 0){
									docs = _.filter(docs,d => !d.subServiceType || !d.subServiceType.name)
									if(docs.length > 1){
										docs = _.filter(docs,d => !d.subServiceType.name)
									}
									// *****checing for parent supplier same as child supplier******//
									// if(readRow._item && readRow._item.children &&  readRow._item.children.length > 0){
									//
									// 	let arr = _.filter(readRow._item.children,child => (child.data.supplier ? child.data.supplier.name : "none")  == readRow["Contractor Name"].name)
									// 	if(arr.length == readRow._item.children.length && docs.length > 0){
									// 		hideChild = true
									// 	}
									// 	//console.log(arr);
									// }
									return (
										<tbody key={idx}>
											<tr
												className 	= "data-grid-row"
												key 		= { idx }
												onClick 	= { () => { this.props.handleClick( docs.length > 0 ? docs[0] : null ) } }
												>
													{/*<td className="data-grid-select-col">&nbsp;</td>*/}
													{ cols.map( (col,colIdx) => {
														let styles = readRow[col].style?readRow[col].style:{}
															if(colIdx == 0){
																styles.paddingLeft = '10px';
															}
														return (
															<td
																className 	= { `data-grid-cell data-grid-col-${colIdx}` }
																key 		= {('val('+idx+','+colIdx+')-'+readRow[col].val)}
																style 		= {styles}
																id={colIdx==cols.length-1?'last-col':'pre-col'}
																>
																	{readRow[col].val ? readRow[col].val : null}

																</td>
															)

														} ) }
													</tr>
													{(readRow._item && readRow._item.children &&  readRow._item.children.length > 0) ? readRow._item.children.map((val,i)=>{
														let query = {
															"type":"Contract",
															"subServiceType.name":val.name
														}
														if( facility ) {
							              	query[ 'facility._id' ] = facility._id;
						              	}

					              		// if 'Service Type' exists then add to query
						              	if( readRow[ 'Service Type' ] ) {
				              				query[ 'serviceType.name' ] = readRow[ 'Service Type' ].val;
					              		}
														let childDoc = Documents.find(query).fetch();
														if(childDoc.length > 0){

															return (

																<ChildDataTable key={i} index={i} readRow={val} items = {readRow._item.children} onClick={this.props.handleClick} doc = {childDoc[0]} cols={cols} fields={this.props.fields}/>
															)
														}
													}) : null }
												</tbody>
											)
										}

							}else{

								return (
									<tbody key = { idx }>
									<tr
										className 	= "data-grid-row"
										key 		= { idx }
										onClick 	= { () => {
											if(this.props.onClick){
												this.props.onClick( readRow._item )
											}
										} }
										>
											{ cols.map( (col,colIdx) => {
												let styles = readRow[col].style?readRow[col].style:{}
													if(colIdx == 0){
														styles.paddingLeft = '10px';
													}
												return (
													<td
														className 	= { `data-grid-cell data-grid-col-${colIdx}` }
														key 		= {('val('+idx+','+colIdx+')-'+readRow[col].val)}
														style 		= {styles}
														id={colIdx==cols.length-1?'last-col':'pre-col'}
														>
															{readRow[col].val}

														</td>
													)

												} ) }
											</tr>
										</tbody>
										)
							}

						})}

				</table>
				</div>
			</div>
		)
	}
} )
