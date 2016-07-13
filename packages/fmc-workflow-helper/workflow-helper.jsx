
import React from "react";

export default function(collection) {

	var states = {}

	collection.methods({
		doAction:{
			authentication:authenticateAction,
			method:doAction
		}
	})

	function authenticateAction(role,user,request,[item,actionName]) {//remove arg request?
		//console.log({role,user,request,actionName});
		var actions = getActions(request);
		var action = actions[actionName];
		if(action) {
			if(action.authentication) {
				if(!_.isFunction(action.authentication)) {
					return action.authentication == true;
				}
				else {
					return action.authentication(role,user,request);
				}
			}
			else {
				console.log(`Action ${action.methodName} has no authentication function`);
			}
		}
	}

	function addState(state,actions) {
		if(!_.isArray(state)) {
			state = [state];
		}
		state.map((s)=>{
			states[s] = actions;
			//collection.methods(actions);
			console.log(actions);
			for(var actionName in actions) {
				console.log(actionName);
				var action = actions[actionName];
				var newMethod = {};
				var newMethodName = `WF.${s}.${actionName}`;
				var fullMethodName = `${collection._name}.${newMethodName}`;
				action.methodName = fullMethodName;
				console.log(newMethodName);
				newMethod[newMethodName] = action;
				collection.methods(newMethod);
			}
		})
	}

	function getActionNames(request) {
		var actions = getActions(request);
		if(actions) {
			return Object.keys(actions);
		}
	}

	function getActions(request) {
		var state = request.status;
		var actions = states[state];
		return actions||[];
	}

	function actionModal(request,beforeMethod,callback) {
		if(beforeMethod) {
			if(!Meteor.isServer) {
				request = collection._transform(request);
				Modal.show({
		    		onSubmit:()=>{
		    			callback?callback(request):null;
		    			Modal.hide();
		    		},
		    		content:
			        	<AutoForm 
				            item={request} 
			    	        form={['closeDetails']}
				        >
			    	        <h2>All done? Great! We just need a few details to finalise the job.</h2>
			        	</AutoForm>
			  	})
			}
		}
		else {
			callback(request);
		}

	}

	function doAction(request,actionName,beforeMethod) {
		var actions = getActions(request);
		var action = actions[actionName];
		if(action) {
			if(action.beforeMethod) {
				actionModal(request,action.beforeMethod,action.method)
			}
			else {
				return action.method(request);
			}
			//console.log(action.methodName);
			//Meteor.call(action.methodName,request,callback);
		}
	}

	return {
		addState,
		getActions:getActionNames
	}
}
