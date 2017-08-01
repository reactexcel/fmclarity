// fields can be an array or a dictionary
// if array project using items
// if dictionary then if function execute, else project
import ReactDOM from 'react-dom';

import moment from 'moment';

export default function DataSet( items ) {
	let data = [],
		labels = [],
		fields = [];

	if ( items ) {
		reset( items, fields );
	}

	function reset( items, newFields ) {
		data.length = 0;
		fields = newFields;
		labels = Object.keys( fields );

		items.map( function( item, idx ) {
			let newItem = {
				_item: item
			};
			for ( var label in fields ) {
				var record = fields[ label ];
				if ( _.isString( record ) ) {
					record = {
						field: record,
						format: defaultFormatFunc
					}
				} else if ( _.isFunction( record ) ) {
					record = {
						field: label,
						format: record
					}
				}
				newItem[ label ] = record.format( item, record.field ) || {};
			}
			data.push( newItem );
		} )
	}

	function defaultFormatFunc( item, fieldName ) {
		if ( fieldName == '_id' ) {
			return null;
		}

		var val;

		var fieldParts = fieldName.split( '.' );
		if ( fieldParts.length > 1 ) {
			var subitem = item[ fieldParts[ 0 ] ];
			if ( subitem ) {
				val = subitem[ fieldParts[ 1 ] ];
			}
		} else {
			val = item[ fieldName ];
		}

		if ( _.isString( val ) || _.isNumber( val ) ) {
			return {
				originalVal: val,
				val: val
			}
		} else if ( _.isDate( val ) ) {
			/*return {
				originalVal: val,
				val: moment( val ).fromNow()
			}*/
			return {
				originalVal: val,
				val: moment( val ).format('DD/MM/YY')
			}
		}
	}

	function defaultSortFunc( label ) {
		return function( a, b ) {
			var result = 0;
			var first, second;
			if ( a[ label ] ) {
				first = a[ label ].originalVal ? a[ label ].originalVal : a[ label ].val ? a[ label ].val : "";
			}
			if ( b[ label ] ) {
				second = b[ label ].originalVal ? b[ label ].originalVal : b[ label ].val ? b[ label ].val : "";
			}
			if ( _.isString( first ) ) {
				first = first.trim();
			}
			if ( _.isString( second ) ) {
				second = second.trim();
			}

			if ( second == null ) {
				result = 1;
			} else if ( first == null ) {
				result = -1;
			} else if ( first > second ) {
				result = 1;
			} else {
				result = -1;
			}
			return result;
		}
	}

	function getSortFunc( col ) {
		if ( fields[ col ] && fields[ col ].sort ) {
			return fields[ col ].sort;
		}
		return defaultSortFunc( col );
	}

	return {
		reset: reset,
		getCols: function() {
			return labels;
		},
		getLabels: function() {
			return labels;
		},
		getRows: function() {
			return data;
		},
		toCSV: function() {
			var csv = [];
			let dataForCSV = [];
			data.map((obj,idx)=>{
				let newObj = Object.assign({}, obj)
				if(newObj.Status){
					newObj.Status = {
						val: obj.Status.val.props.children[2]
					}
				}
				/*if(newObj.Responsiveness && newObj.Responsiveness.duration && newObj.Responsiveness.duration._data && newObj.Responsiveness.duration._data){
					let daysValue = newObj.Responsiveness.duration._data.days ? newObj.Responsiveness.duration._data.days.toString() : (1).toString();
					    newObj.Responsiveness.val = daysValue;
				}
				if(newObj.Responsiveness){
					if(newObj.Responsiveness.val){
						newObj['Responsiveness (days)'] = {val:''}
						newObj['Responsiveness (days)']['val'] = newObj.Responsiveness.val
					}else{
						newObj['Responsiveness (days)'] = {}
					}
					newObj = _.omit(newObj,'Responsiveness')
				}
				if(newObj.Issue){
					newObj.Summary = obj.Issue
					newObj = _.omit(newObj,'Issue')
				}
				if(newObj.Issued){
					newObj.Issued = {
						val: obj.Issued.originalVal == "" ? '': moment( obj.Issued.originalVal ).format('DD/MM/YY')
					}
				}
				if(newObj.Due){
					newObj.Due = {
						val: obj.Due.originalVal == "" ? '': moment( obj.Due.originalVal ).format('DD/MM/YY')
					}
				}
				if(newObj.Completed){
					newObj.Completed = {
						val: (obj.Completed && obj.Completed.originalVal && obj.Completed.originalVal != '')?moment( obj.Completed.originalVal ).format('DD/MM/YY'):''
					}
				}*/
				/*if(newObj.Supplier){
					newObj.Supplier = {
						val: obj.Supplier && obj.Supplier.val && obj.Supplier.val.props && obj.Supplier.val.props.children && obj.Supplier.val.props.children.props && obj.Supplier.val.props.children.props.item && obj.Supplier.val.props.children.props.item.name ? obj.Supplier.val.props.children.props.item.name : ''
					}
				}
				if(newObj.Name){
					newObj.Name = {
						val: obj.Name && obj.Name.val && obj.Name.val.props && obj.Name.val.props.children && obj.Name.val.props.children.props && obj.Name.val.props.children.props.item && obj.Name.val.props.children.props.item.profile && obj.Name.val.props.children.props.item.profile.name ? obj.Name.val.props.children.props.item.profile.name : ''
					}
				}*/
				newObj = _.omit(newObj,'_item')
				dataForCSV.push(newObj)
			})
			dataForCSV.map( function( d ) {
				var item = {};
				for ( var label in d ) {
					item[ label ] = d[ label ].val;
				}
				csv.push( item );
			} )
			return Papa.unparse( csv );
		},
		sortBy: function( label, dir ) {
			if ( dir == "none" ) {
				return data;
			}
			var sortFunc = getSortFunc( label );
			data.sort( function( a, b ) {
				var result = sortFunc( a, b );
				if ( dir == "up" ) {
					result *= -1;
				}
				return result;
			} )
			return data;
		},
		getFileName(fileName){
			fileName = fileName + moment().format("YYYY-MM-DD") + '_' + moment().format("hh") + '-'+ moment().format("mm") +'-'+ moment().format("ss") + '-' + moment().format("a")
			fileName = fileName.replace('.','')
			return fileName;
		},
		download: function(fileDetails) {
			var fileName = "fm-clarity-export";
			if(fileDetails && fileDetails.pdfName){
				fileName = fileDetails.pdfName;
				if(fileDetails.pdfName[fileDetails.pdfName.length-1] == '-'){
					fileName = this.getFileName(fileDetails.pdfName);
				}
			}
			var csv = this.toCSV();
			var blob = new Blob( [ csv ], {
				type: "text/plain;charset=utf-8"
			} );
			saveAs( blob, fileName+".csv" );
		},
		print: function( element,pdfDetails ) {
			if(pdfDetails && pdfDetails.pdfName && pdfDetails.pdfName[pdfDetails.pdfName.length-1] == '-'){
				pdfDetails.pdfName = this.getFileName(pdfDetails.pdfName);
			}
			var print_data = element.innerHTML;
            //var datawindow = window.print();
			var datawindow = window.open( '', 'fm-clarity-print', 'height=600,width=800' );
			datawindow.document.write( '<html><head>'+pdfDetails.styleForPDF+'<title>'+(pdfDetails && pdfDetails.pdfName ? pdfDetails.pdfName : 'fm-clarity-print')+'</title>' );
			//datawindow.document.write("<link href='DataTable.less' rel='stylesheet' type='text/css' />");
			datawindow.document.write( '</head><body ><h3 style="text-align:center;margin-bottom:80px;margin-top:20px;text-decoration:underline;">'+pdfDetails.pdfTitle+'</h3>' );
			datawindow.document.write( print_data );
			datawindow.document.write( '</body></html>' );

			datawindow.document.close(); // necessary for IE >= 10
			datawindow.focus(); // necessary for IE >= 10

			datawindow.print();
			datawindow.close();

			return true;

		},
	}
}
