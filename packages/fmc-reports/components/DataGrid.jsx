import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


// fields can be an array or a dictionary
// if array project using items
// if dictionary then if function execute, else project
function Dataset(items,originalFields,originalLabels) {
	//init
	var fields = [], labels = [];
	var data = [];

	if(items) {
		reset(items,originalFields,originalLabels);
	}

	function formatValue(val,fieldName) {
		if(fieldName=='_id') {
			return null;
		}
		else if(_.isString(val)||_.isNumber(val)) {
			return val;
		}
		else if(_.isDate(val)) {
			return moment(val).format(/*"DD/MM/YY HH:mm"*/"ll");
		}	
	}

	function reset(items,originalFields,originalLabels) {
		data.length = 0;
		fields = originalFields||Object.keys(items[0]);
		items.map(function(item,idx){
			var newItem = {};
			if(_.isArray(fields)) {
				fields.map(function(field){
					var originalVal = item[field];
					var val = formatValue(originalVal,field);
					if(val) {
						newItem[field] = {
							val:val,
							originalVal:originalVal
						}
					}
				})
			}
			else {
				for(var label in fields) {
					var field = fields[label];
					if(_.isFunction(field)){
						newItem[label] = {
							val:field(item)
						}
					}
					else if(_.isString(field)) {
						var originalVal,formattedVal,fieldParts;
						var fieldParts = field.split('.');
						if(fieldParts.length>1) {
							var subitem = item[fieldParts[0]];
							if(subitem) {
								originalVal = subitem[fieldParts[1]];
							}
						}
						else {
							originalVal = item[field];
						}
						originalVal = originalVal||" ";
						formattedVal = formatValue(originalVal,field);
						if(formattedVal) {
							newItem[label] = {
								originalVal:originalVal,
								val:formattedVal
							}
						}
					}

				}
			}
			data.push(newItem);
		})
		//if originalFields were not specified we should update the fields list now
		//that we have completed the projection in order to remove any cols that
		//contained invalid values
		labels = originalLabels||Object.keys(data[0]);
	}

	function defaultSortFunc(label) {
		return function(a,b) {
			var first,second;
			if(a[label]) {
				first = a[label].originalVal?a[label].originalVal:a[label].val?a[label].val:"";
			}
			if(b[label]) {
				second = b[label].originalVal?b[label].originalVal:b[label].val?b[label].val:"";
			}
			var result = 0;
			if(_.isString(first)) {
				first = first.trim();
			}
			if(_.isString(second)) {
				second = second.trim();
			}

			if(!second) {
				result = 1;
			}
			else if(!first) {
				result = -1;
			}
			else if(first>second) {
				result = 1;
			}
			else {
				result = -1;
			}
			return result;
		}
	}

	function getSortFunc(col) {
		if(data[col]&&data[col].sort) {
			return data[col].sort;
		}
		return defaultSortFunc(col);
	}

	return {
		reset:reset,
		getCols:function() {
			return labels;
		},
		getLabels:function() {
			return labels;
		},
		getRows:function(){
			return data;
		},
		toCSV:function() {
			return Papa.unparse(data);
		},
		sortBy:function(label,dir) {
			if(dir=="none") {
				return data;
			}
			var sortFunc = getSortFunc(label);
			data.sort(function(a,b){
				var result = sortFunc(a,b);
				if(dir=="up") {
					result*=-1;
				}
				return result;
			})
			return data;
		},
		download:function(){
			var csv = Papa.unparse(data);
			var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
			saveAs(blob, "fm-clarity-export.csv");
		},
	}
}

DataGrid = React.createClass({

    getInitialState() {
    	var dataset = new Dataset();
    	return {
    		dataset:dataset,
    		rows:dataset.getRows(),
    		cols:dataset.getCols(),
    		sortCol:null,
    		sortDir:"none",
    	}
    },

    update(props) {
		items = props.items;
		var rows,cos;
		var dataset = this.state.dataset;
		if(items&&items.length) {
			fields = this.props.fields;
			dataset.reset(items,fields);
			rows = dataset.getRows();
			cols = dataset.getCols();

		}
		this.setState({
			rows:rows,
			cols:cols
		})
    },

    componentWillMount() {
    	this.update(this.props);
    },

    componentWillReceiveProps(props) {
    	this.update(props);
    },


    handleSortBy(col) {
    	var dataset = this.state.dataset;
    	var dir = (this.state.sortDir!="down")?"down":"up";
    	if(this.state.sortCol!=col) {
    		dir="down";
    	}
    	var rows = dataset.sortBy(col,dir);
    	this.setState({
    		sortCol:col,
    		sortDir:dir,
    		rows:rows
    	})
    },

    download() {
        var dataset = this.state.dataset;
        dataset.download();
    },

	render(){
		var dataset = this.state.dataset;
		var sortCol = this.state.sortCol;
		var sortDir = this.state.sortDir;
		var cols = this.state.cols;
		var rows = this.state.rows;
		var component = this;
		if(!cols||!rows) {
			return <div/>
		}

		return(
			<div className="data-grid">
				<table className="table">
					<thead>
						<tr className="data-grid-header-row">
							<th className="data-grid-select-col-header">&nbsp;</th>
							{cols.map(function(col){
								return (
									<th onClick={component.handleSortBy.bind(component,col)} className="data-grid-header-cell" key={('head'+col)}>
										<div style={{position:"relative",left:"-15px"}}><i style={{width:"15px"}} className={(col==sortCol)?("fa fa-arrow-"+sortDir):"fa"}></i><span>{col}</span></div>
									</th>
								)
							})}
						</tr>
					</thead>
					<tbody>
						{rows.map(function(row,rowIdx){
							return (
							<tr className="data-grid-row" key={rowIdx}>
								<td className="data-grid-select-col">&nbsp;</td>
								{cols.map(function(col,colIdx){
									return (
										<td className="data-grid-cell" key={('val('+rowIdx+','+colIdx+')-'+row[col].val)}>{row[col].val}</td>
									)
								})}
							</tr>
							)
						})}
					</tbody>
				</table>
            	<div className="report-toolbar">
                    <a href="print" target="_blank"><i className="fa fa-print"></i></a>
                    <span onClick={this.download} target="_blank"><i className="fa fa-download"></i></span>
                </div>
			</div>
		)
	}
})