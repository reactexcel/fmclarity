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
			return {
				originalVal: val,
				val: moment( val ).fromNow()
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
			data.map( function( d ) {
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
		download: function() {
			var csv = this.toCSV();
			var blob = new Blob( [ csv ], {
				type: "text/plain;charset=utf-8"
			} );
			saveAs( blob, "fm-clarity-export.csv" );
		},
		print: function( element ) {

			var print_data = element.innerHTML;

			var datawindow = window.open( '', 'fm-clarity-print', 'height=400,width=600' );
			datawindow.document.write( '<html><head><title>fm-clarity-print</title>' );
			//datawindow.document.write("<link href='DataTable.less' rel='stylesheet' type='text/css' />");
			datawindow.document.write( '</head><body >' );
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
