import React from "react";
import ReactDom from "react-dom";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Perf from 'react-addons-perf';

import DataSet from './DataSet.jsx';
import { download, print } from './DataSetActions.jsx';
import { Menu } from '/modules/ui/MaterialNavigation';

import SearchInput, {createFilter} from 'react-search-input';



export default ChildDataTable = React.createClass( {

	getInitialState() {
		var dataset = new DataSet();
		return {
			dataset: dataset,
			rows: dataset.getRows(),
			cols: dataset.getCols(),
			data:{}
		}
	},
	componentWillReceiveProps(props){
		this.update(props.readRow);
		this.setState({edit : true})
	},
	componentWillMount(){
		this.update(this.props.readRow);
	},
	update(readRow){
		if(readRow){
			dataset = this.state.dataset;
			dataset.reset(this.props.items ,this.props.fields);
			let rows = dataset.getRows();
			let selRow = _.filter(rows,row => row['Service Type'].val === this.props.readRow.name);
			let data1 = {
				'one' : selRow[0]["Annual Amount"].val,
				'two'	: selRow[0]["Comments"].val ? selRow[0]["Comments"].val : '--',
				'three'	: selRow[0]["Contractor Name"].val ? selRow[0]["Contractor Name"].val : '--',
				'four'	: selRow[0]["Service Type"].val ? selRow[0]["Service Type"].val : '--',
				'five'	: selRow[0]["Expiry Date"].val ? selRow[0]["Expiry Date"].val : '--',
				'six'	: selRow[0]["Status"].val ? selRow[0]["Status"].val : '--',
			}
			this.setState({
				rows:rows,
				cols:this.props.cols,
				data:data1
			})
		}
	},
	handleEdit(){
		this.props.onClick(this.props.doc);
	},
	render(){
				let { cols, rows,data } = this.state;

		return (
				<tr className = "data-grid-row" onClick ={this.handleEdit}>
					<td style={{paddingLeft:"22px"}}>{data.four}</td>
					<td style={{paddingLeft:"10px"}}>{data.three}</td>
					<td style={{paddingLeft:"10px"}}>{data.one}</td>
					<td style={{paddingLeft:"20px",width:"300px"}}>{data.two}</td>
					<td style={{paddingLeft:"10px"}}>{data.six}</td>
					<td style={{paddingLeft:"10px"}}>{data.five}</td>
		</tr>
		)
	}
})
