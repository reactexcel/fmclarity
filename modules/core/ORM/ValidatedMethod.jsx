/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */

 /**
 * @memberOf		module:core/ORM
 */
class ValidatedMethod {

	/**
	 * @constructor
	 * @param 		{object} config
	 * @param 		{string} config.name
	 * @param 		{function} [config.validate]
	 * @param 		{function} [config.authenticate]
	 * @param 		{function} [config.run]
	 * @param 		{function} [config.notify]
	 */
	constructor( { name, validate, authenticate, run, notify } ) {
		this.name = name;
		this.validate = validate;
		this.run = run;
		this.authenticate = authenticate;
		this.notify = notify;

		this._before = [];
		this._after = [];

		Meteor.methods( {
			[ this.name ]: this._method.bind( this )
		} );
	}

	/**
	 * The actual method which gets registered with Meteor.
	 * Includes before and after hooks as well as validation and authentication options.
	 * @param 		{mixed} ...args - Arguments to be passed on to final method
	 */
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

	/**
	 * Used externally to call the ValidatedMethod
	 * @param 		{mixed} ...args - Arguments to be passed on to final method
	 */
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

	/**
	 * Adds a new before method callback to the collection
	 * @param 		{function} callback - A function to be called before the method is called
	 */
	before( callback ) {
		this._before.push(callback);
	}

	/**
	 * Adds a new after method callback to the collection
	 * @param 		{function} calback - A function to be called after the method is complete
	 */
	after( callback ) {
		this._after.push(callback);
	}
}


export default ValidatedMethod;