RBAC = {
	getRole:getRole,
	method:method,
	methods:methods,
	mixins:mixins,
	authenticate:authenticate,
	validate:validate,
	addMethod:addMethod,	
	addAuthentication:addAuthentication,
	addValidation:addValidation,
	error:error,
	warning:warning,
}

var authenticators = {};
var validators = {};
var notifiers = {};

/**
 * @method getRole
 * @summary Checks for the role of member in item
 * @param {Object} member The member to check on. Assumes it includes an array called members whose items hold the _id and role of the member items.
 * @param {Object} item The item to check the role of
 * @returns {Object} the role of the member
 */
function getRole(member,item) {
	//perhaps the selected team should actually be saved in the user model
	//then we can always check permissions against the selected team
	if(!item||!item.members||!item.members.length) {
		return null;
	}
	for(var i in item.members) {
		var currentMember = item.members[i];
		if(currentMember&&member&&currentMember._id==member._id) {
			return currentMember.role;
		}
	}
}

/**
 * @method authenticate
 * @summary Helper method that calls the registered authentication routine for the given method
 * @param {String} methodName The name of the method
 * @param {Object} [args] Arguments taken which vary depending on the method call
 */
function authenticate(/*methodName, [args]*/) {
	var methodName = [].shift.call(arguments);
	var f = authenticators[methodName];
	return f?f.apply(null,arguments):false;
}

/**
 * @method validate
 * @summary Helper method that calls the registered validation routine for the given method
 * @param {String} methodName The name of the method
 * @param {Object} [args] Arguments taken which vary depending on the method call
 */
function validate(/*methodName, [args]*/) {
	//extract the methodName from the argument list
	var methodName = [].shift.call(arguments);
	var f = validators[methodName];
	return f?f.apply(null,arguments):true;
}

/**
 * @method notify
 * @summary Helper method that calls the registered notification routine for the given method
 * @param {String} methodName The name of the method
 * @param {Object} [args] Arguments taken which vary depending on the method call
 */
function notify(/*methodName, [args]*/) {
	//extract the methodName from the argument list
	var methodName = [].shift.call(arguments);
	var f = notifiers[methodName];
	return f?f.apply(null,arguments):true;
}

/**
 * @method addMethod
 * @summary Wraps a given function with authentication and validation and then packages it as a Meteor.method.
 * @param {String} methodName The name of the method
 * @param {function} f The method function
 */
function addMethod(methodName,f,collection) {
	var obj = {};
	if(collection&&_.isString(arguments[1])) {
		//if the collection has been sent assume that the item is a query object
		//(this is preferable as it allows one to send an id rather than full object)
		//(don't really want full object sent over the wire)
		arguments[1] = collection.findOne(arguments[1]);
	}
	obj[methodName] = function() {
		// add methodName to the start of the argument list for authentication
		[].unshift.call(arguments,methodName);
		if(!authenticate.apply(null,arguments)) {
			return error('access-denied:'+methodName,'Access Denied:','Sorry, you do not have permission to do that');
		}
		else if(!validate.apply(null,arguments)) {
			return error('validation-error:'+methodName,'Validation Error:','Some of the information you provided is invalid');
		}
		else {
			// then remove it again to call the method
			[].shift.call(arguments);
			var response = f.apply(null,arguments);
			// then add it again with the response to call the notifier??
			// there has to be a better way
			[].unshift.call(arguments,methodName,response);
			notify.apply(null,arguments);
			return response;
		}
	}
	Meteor.methods(obj);
}

/**
 * @method addAuthentication
 * @summary Wraps a given function as an authenticator and stores is locally
 * @param {String} methodName The name of the method
 * @param {function} f The method function
 */


function addAuthentication(methodName,f) {
	authenticators[methodName] = function() {
		// create the paramater that will be used to call the authentication function
		var user = Meteor.user();

		if(!user) {
			return false;
		}

		var item = arguments[0];
		var role = getRole(user,item);

		if(user&&user.role=="dev") {
			return true;
		}
		else if(_.isBoolean(f)) {
			return f;
		}
		else if(_.isString(f)) {
			return role==f;
		}
		else if(_.isArray(f)) {
			return f.indexOf(role)>=0;
		}
		else if(_.isFunction(f)) {
			return f(role,user,item,arguments);
		}
		return false;
	}
}

/**
 * @method addValidation
 * @summary Wraps a given function as an validator and stores is locally
 * @param {String} methodName The name of the method
 * @param {function} f The method function
 */
function addValidation(methodName,f) {
	validators[methodName] = function() {
		// create the paramater that will be used to call the validation function
		var item = arguments[0];
		if(_.isBoolean(f)) {
			return f;
		}		
		else if(_.isFunction(f)) {
			return f(item,arguments);
		}
		return false;
	}
}

/**
 * @method addNotification
 * @summary Wraps a given function as an notifier and stores is locally
 * @param {String} methodName The name of the method
 * @param {function} f The method function
 */
function addNotification(methodName,f) {
	notifiers[methodName] = function() {
		// create the paramater that will be used to call the validation function
		var user = Meteor.user();
		var after = arguments[0];
		var before = arguments[1];
		var role = getRole(user,before);

		if(f(after,user,role,methodName,before,arguments)) {
			return true;
		}
		return false;
	}
}

/**
 * @method ucfirst
 * @summary Capitalises first letter of string. Should it be added to the String prototype?
 * @param {String}
 */
function ucfirst(string) {
   	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @method makeMethodHelper
 * @summary Makes a function that can be bound to a collection as a helper to conveniently call the corresponding method on the client.
 * @param {String} methodName The name of the method
 */
function makeMethodHelper(methodName){
	//TODO:this could be packaged as an syncronous function
	/*Meteor.wrapAsync(function(){...})*/
	return function(/*args*/) {
		var lastArg,callback;
		//check if last argument on the list is a function, if so process as callback
		lastArg = arguments[arguments.length-1];
		if(_.isFunction(lastArg)){
			callback = [].pop.call(arguments);
		}
		//because we are using a helper the item shoudl become "this"
		[].unshift.call(arguments,this);
		//then call the method, we'll also strip any errors from the callback
		return Meteor.apply(methodName,arguments,null,callback?function(err,response){
			if(!err) {
				callback(response);
			}
		}:null)
	}
}

/**
 * @method makeAuthenticationHelper
 * @summary Makes a function that can be bound to a collection as a helper to conveniently call the corresponding authenticator on the client.
 * @param {String} methodName The name of the method
 */
function makeAuthenticationHelper(methodName){
	return function() {
		var f = authenticators[methodName];
		//because we are using a helper the item should become "this"
		[].unshift.call(arguments,this);
		return f?f.apply(null,arguments):false;
	}
}

/**
 * @method makeAuthenticationHelper
 * @summary Makes a function that can be bound to a collection as a helper to conveniently call the corresponding authenticator on the client.
 * @param {String} methodName The name of the method
 */
function makeValidationHelper(methodName){
	return function() {
		var f = validators[methodName];
		//because we are using a helper the item should become "this"
		[].unshift.call(arguments,this);
		return f?f.apply(null,arguments):false;
	}
}

/**
 * @method makeHelpers
 * @summary Creates collection helpers for the specified method and it's authentication
 * @param {String} methodName The name of the method
 */
function makeHelpers(methodName,functions,collection) {
	var helpers = {};
	//chop off any existing collection prefix
	var strippedName = methodName.split('.');
	strippedName = strippedName[1];
	if(functions.authentication) {
		helpers['can'+ucfirst(strippedName)] = makeAuthenticationHelper(methodName);
	}
	if(functions.validation) {
		helpers['check'+ucfirst(strippedName)] = makeValidationHelper(methodName);
	}
	if(functions.helper) {
		helpers[strippedName] = makeCollectionHelper(methodName,functions.helper);
	}
	else if(functions.method) {
		helpers[strippedName] = makeMethodHelper(methodName);
	}
	collection.helpers(helpers);
}

/**
 * @method makeHelpers
 * @summary Creates collection helpers for the specified method and it's authentication
 * @param {String} methodName The name of the method
 */
function makeCollectionHelper(methodName,f) {
	return function() {
		var auth = authenticators[methodName];
		[].unshift.call(arguments,this);
		var permitted = auth?auth.apply(null,arguments):false;
		if(permitted) {
			return f?f.apply(null,arguments):false;
		}
		return error('access-denied:'+methodName,'Access Denied:','Sorry, you do not have permission to do that');
	}
}

/**
 * @method method
 * @summary Uses provided authentication and validation functions to wrap the provided method
 * @param {String} methodName The name of the method
 * @param {Object} functions A map containing the method, authentication and validation functions
 * @param {Meteor.Collection} [collection] Optional. If specified creates helpers on the collection for calling the method and authentication.
 */
function method(methodName,functions,collection){
	methodName = ucfirst(collection._name)+'.'+methodName;
	makeHelpers(methodName,functions,collection);
	for(var i in functions) {
		var f = functions[i];
		if(i=='authentication'){
			addAuthentication(methodName,f);
		}
		else if(i=='validation'){
			addValidation(methodName,f);
		}
		else if(i=='notification'){
			addNotification(methodName,f);
		}
		else if(i=='method'){
			addMethod(methodName,f,collection);
		}
	}
}

/**
 * @method methods
 * @summary Packages multiple functions for RBAC
 * @param {String} methodName The name of the method
 * @param {Object} functions A map of objects, each containing the method, authentication and validation functions
 * @param {Meteor.Collection} [collection] Optional. If specified creates helpers on the collection for calling the method and authentication.
 */
function methods(functions,collection){
	for(var methodName in functions) {
		method(methodName,functions[methodName],collection);
	}
}

/**
 * @method methods
 * @summary Packages multiple functions for RBAC
 * @param {String} methodName The name of the method
 * @param {Object} functions A map of objects, each containing the method, authentication and validation functions
 * @param {Meteor.Collection} [collection] Optional. If specified creates helpers on the collection for calling the method and authentication.
 */
function mixins(mixins,collection){
	if(mixins&&mixins.length) {
		mixins.map(function(mixinInitFunc){
			mixinInitFunc(collection);
		})
	}
}

/**
 * @method error
 * @summary Throws or returns a specified Meteor.error depending on architecture. Shows a toast on client.
 * @param {String} error An error code
 * @param {String} reason A quick summary of the error
 * @param {String} details A detailed description of the error
 */
function error(error, reason, details) {  
	console.log({
		error:error,
		reason:reason,
		details:details
	});
	var meteorError = new Meteor.Error(error, reason, details);
	if (Meteor.isClient) {
		//toastr.error(details,reason);
		return meteorError;
	} else if (Meteor.isServer) {
		throw meteorError;
	}
}

/**
 * @method warning
 * @summary Shows a warning toast on client.
 * @param {String} warning A warning code
 * @param {String} reason A quick summary of the warning
 * @param {String} details A detailed description of the warning
 */
function warning(warning, reason, details) {  
	if (Meteor.isClient) {
		toastr.warning(details,reason);
	}
}