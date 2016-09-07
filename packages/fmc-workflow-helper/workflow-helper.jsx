import React from "react";

import { AutoForm } from 'meteor/fmc:autoform';

export default function( collection ) {

	var states = {}

	collection.methods( {
		doAction: {
			validation: actionIsValid,
			authentication: actionIsPermitted,
			method: doAction
		},
		getActions: {
			authentication: true,
			helper: getActionNames
		}
	} )

	function actionIsValid( request, [ item, actionName ] ) { //remove arg request?
		//console.log({role,user,request,actionName});
		var actions = getActions( request );
		var action = actions[ actionName ];
		return RBAC.validate( action.methodName, request );
	}

	function actionIsPermitted( role, user, request, [ item, actionName ] ) { //remove arg request?
		//console.log({role,user,request,actionName});
		var actions = getActions( request );
		var action = actions[ actionName ];
		return RBAC.authenticate( action.methodName, request );
	}

	function addState( state, actions ) {
		if ( !_.isArray( state ) ) {
			state = [ state ];
		}
		state.map( ( s ) => {
			states[ s ] = actions;
			//collection.methods(actions);
			//console.log(actions);
			for ( var actionName in actions ) {
				//console.log(actionName);
				var action = actions[ actionName ];
				var newMethod = {};
				var newMethodName = `workflow.${s}.${actionName}`;
				var fullMethodName = `${collection._name}.${newMethodName}`;
				action.methodName = fullMethodName;
				//console.log(newMethodName);
				newMethod[ newMethodName ] = action;
				collection.methods( newMethod );
			}
		} )
	}

	function getActionNames( request ) {
		var actions = getActions( request );
		if ( actions ) {
			return Object.keys( actions );
		}
	}

	function getActions( request ) {
		var state = request.status;
		var actions = states[ state ];
		return actions || [];
	}

	function actionModal( request, form, callback ) {
		if ( form ) {
			if ( !Meteor.isServer ) {
				//request = collection._transform( request );
				Modal.show( {
					content:
						<AutoForm
							model 		= { Issues }
							form 		= { form.fields }
							item 		= { request }
							onSubmit 	= {
								( newRequest ) => {
									//console.log(newRequest);
									callback ? callback( newRequest ) : null;
									Modal.hide();
								}
							}
						>

							<h2>{form.title}</h2>

						</AutoForm>
				} )
			}
		} else {
			callback( request );
		}

	}

	function doAction( request, actionName ) {
		//get possible actions for this request, then retrieve the action by name
		var actions = getActions( request );
		var action = actions[ actionName ];

		if ( action ) {
			if ( action.form ) {
				var form = action.form;
				if ( _.isFunction( form ) ) {
					form = form( request );
				}
				actionModal( request, form, ( request ) => {
					Meteor.call( action.methodName, request );
				} )
			} else {
				return action.method( request );
			}
			//console.log(action.methodName);
			//Meteor.call(action.methodName,request,callback);
		}
	}

	return {
		addState,
		getActions: getActionNames
	}
}
