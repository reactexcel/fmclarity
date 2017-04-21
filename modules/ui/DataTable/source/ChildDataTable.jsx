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
		}
	},
	componentWillReceiveProps(props){
		if(props.readRow._item && props.readRow._item.children &&  props.readRow._item.children.length > 0 ){
			dataset = this.state.dataset;
			dataset.reset(props.readRow._item.children ,props.fields);
			let rows = dataset.getRows();
			console.log(rows,"childRow");
			this.setState({
				rows:rows,
				cols:props.cols
			})
		}
	},
	render(){
				let { cols, rows } = this.state;
				let childRow;
			 	childRow = rows.map((r,idx)=>{
					return (

						<tr
							className 	= "data-grid-row"
							key 		= { idx }
							onClick 	= { () => { this.props.onClick( r._item ) } }
						>
							<td className="data-grid-select-col">&nbsp;</td>
							<td className="data-grid-select-col">&nbsp;</td>
							{ cols.map( (col,colIdx) => {

								return (
									<td
										className 	= { `data-grid-cell data-grid-col-${colIdx}` }
										key 		= {('val('+idx+','+colIdx+')-'+r[col].val)}
										style 		= {r[col].style?r[col].style:{}}
									>
										{r[col].val}

									</td>
								)

							} ) }
						</tr>
					)
				})
		return (
			{childRow}
		)
	}
})
