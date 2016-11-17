import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';

import DataSet from './DataSet.jsx';
import { download, print } from './DataSetActions.jsx';
import { Menu } from '/modules/ui/MaterialNavigation';

export default DataTable = React.createClass( {

	getInitialState() {
		var dataset = new DataSet();
		return {
			dataset: dataset,
			rows: dataset.getRows(),
			cols: dataset.getCols(),
			sortCol: null,
			sortDir: "none",
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

			items = items.sort( (i, j) => {
				if( i.lastUpdate && j.lastUpdate ){
					 let a = i.lastUpdate.valueOf(),
					 	 b = j.lastUpdate.valueOf(),
						 c = _.indexOf(i.unreadRecipents, user._id ),
						 d = _.indexOf(j.unreadRecipents, user._id ),
						 x = a < b ? -1 : ( a > b ? 1 : 0);

						 if( c > -1 && d > -1 ) {
							 return x;
						 }
						 if( c > -1  ){
							 return 1
						 }
						 if( d > -1  ){
							 return -1
						 }
						 return 0;
				}

			} ).reverse() ;

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
		this.update( this.props );
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

	render() {
		let { dataset, sortCol, sortDir, cols, rows } = this.state;
		let { fields, children } = this.props;

		let user = Meteor.user(),
			facility = Session.getSelectedFacility() || {};

		if ( !cols || !rows ) {
			return <div/>
		}

		//console.log( rows );

		return (
			<div className="data-grid">
				{/*<div className = "data-grid-title-row">
					<Menu items = { [ download(dataset), print(dataset, this.refs.printable) ] } />
				</div>*/}
				<div ref="printable">
				<table className="table">

					<thead>

						<tr className = "data-grid-header-row">
							<th className = "data-grid-select-col-header">&nbsp;</th>
							{ cols.map( (col) => {

								return (
									<th
										onClick = { () => { this.handleSortBy( col ) } }
										className = "data-grid-header-cell" key={('head'+col)}
									>

										<div style = {{position:"relative",left:"-15px"}}>

											<i style = {{width:"15px"}} className = {(col==sortCol)?("fa fa-arrow-"+sortDir):"fa"}></i>

											<span>{col}</span>
										</div>

									</th>
								)

							} ) }
						</tr>
					</thead>

					<tbody>
						{ rows.map( (row,rowIdx) => {
							let unread = false;
							if( row._item.unreadRecipents ){
								if( _.indexOf( row._item.unreadRecipents, user._id ) > -1){
									unread = true;
								}else if( _.indexOf( row._item.unreadRecipents, facility._id ) > -1){
									unread = true;
								}
							}
							return (
							<tr
								className 	= "data-grid-row"
								key 		= { rowIdx }
								onClick 	= { () => { this.props.onClick( row._item ) } }
							>
								<td className="data-grid-select-col">&nbsp;</td>
								{ cols.map( (col,colIdx) => {

									return (
										<td
											className 	= "data-grid-cell"
											key 		= {('val('+rowIdx+','+colIdx+')-'+row[col].val)}
											style 		= {row[col].style?row[col].style:{}}
										>
											{ unread? <strong style={{fontWeight: "900"}}> {row[col].val} </strong> : row[col].val }

										</td>
									)

								} ) }
							</tr>
							)
						})}
					</tbody>

				</table>
				</div>
			</div>
		)
	}
} )
