export default class ValidatedMethod {
	constructor( { name, validate, authenticate, run, notify } ) {
		this.name = name;
		this.validate = validate;
		this.run = run;
		this.authenticate = authenticate;
		this.notify = notify;

		this._before = [];
		this._after = [];

		Meteor.methods( {
			[ this.name ]: ( ...args ) => {
				return this._method( ...args )
			}
		} );
	}

	_method( ...args ) {
		//console.log(...args);
		let response = null;
		this._before.map( ( f ) => { f( ...args ) } );
		if ( this.validate ) {
			this.validate( ...args );
		}
		if ( this.authenticate ) {
			this.authenticate( ...args );
		}
		if ( this.run ) {
			response = this.run( ...args )
		}
		this._after.map( ( f ) => { f( ...args ) } );
		if ( this.notify ) {
			this.notify( ...args );
		}
		return response;
	}

	call( ...args ) {
		return new Promise( ( fulfil, reject ) => {
			Meteor.call( this.name, ...args, ( error, response ) => {
				if ( error ) {
					reject( error );
				} else {
					fulfil( response );
				}
			} )
		} )
	}

	before( callback ) {
		this._before.push(callback);
	}

	after( callback ) {
		this._after.push(callback);
	}
}
