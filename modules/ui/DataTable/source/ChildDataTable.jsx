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
	componentWillMount(){
		if(this.props.readRow){
			dataset = this.state.dataset;
			// console.log(this.props.items,"///////////////////////////");
			dataset.reset(this.props.items ,this.props.fields);
			let rows = dataset.getRows();
			// console.log(rows,"childRow");
			let selRow = _.filter(rows,row => row['Service Type'].val === this.props.readRow.name);
			// console.log(selRow,"2222222*-**-*-*-*-*-*");
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
	render(){
				let { cols, rows,data } = this.state;
				// console.log(data);
		return (
				<tr className = "data-grid-row">
					<td className="data-grid-select-col">&nbsp;&nbsp;</td>
					<td style={{paddingLeft:"22px"}}>{data.four}</td>
					<td style={{paddingLeft:"10px"}}>{data.three}</td>
					<td style={{paddingLeft:"10px"}}>{data.one}</td>
					<td style={{paddingLeft:"10px"}}>{data.two}</td>
					<td style={{paddingLeft:"10px"}}>{data.six}</td>
					<td style={{paddingLeft:"10px"}}>{data.five}</td>
					{/* { this.props.cols.map( (col,colIdx) => {

						return (
						<td
						className 	= { `data-grid-cell data-grid-col-${colIdx}` }
						key 		= {('val('+this.props.index+','+colIdx+')-'+rows[col].val)}
						style 		= {rows[col].style?rows[col].style:{}}
						>
						{rows[col].val}

					</td>
				)

			} ) } */}
		</tr>
		)
	}
})
