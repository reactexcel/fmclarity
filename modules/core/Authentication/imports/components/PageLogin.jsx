/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import RefreshIndicator from 'material-ui/RefreshIndicator';

/**
 * @class           PageLogin
 * @memberOf        module:core/Authentication
 */
const PageLogin = React.createClass( {

	getInitialState() {
		return {
			errorMessage: null,
			loading: false
		}
	},

	handleSubmit( e ) {
		e.preventDefault();
		var email = this.refs.email.value.trim();
		var password = this.refs.password.value.trim();
		if ( !email ) { //} || !password) {
			return;
		}
		setTimeout( () => { this.setState( { loading: true } ) }, 0 );
		Meteor.loginWithPassword( email, password, ( error ) => {
			if ( error ) {
				let errorMessage = null;
				switch ( error.error ) {
					case 400:
					default:
						errorMessage = <span>Incorrect username or password. Did you <a className="alert-link" href={FlowRouter.path('lost-password')}>forget your password?</a></span>
						break;
				}
				this.setState( { errorMessage, loading: false } );
				/*ReactDOM.findDOMNode(this.refs.email).value = '';*/
				this.refs.password.value = '';
			}
		} );
		// TODO: send request to the server
		return;
	},

	render() {
		return (
		<div className="middle-box loginscreen animated fadeInDown">
			<div>
				<img width="300px" src="/img/logo-horizontal-blue.svg"/>
			</div>
			<div style={{marginTop:"30%"}}>
				<form className="m-t" role="form" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<input type="email" ref="email" className="form-control" placeholder="Email Address" required=""/>
					</div>
					<div className="form-group">
						<input type="password" ref="password" className="form-control" placeholder="Password" required=""/>
					</div>
					<button type="submit" className="btn btn-primary block full-width m-b">Login</button>
				</form>
				<div>
					<a href={FlowRouter.path('lost-password')}><small>Forgot password?</small></a><br/>
					{/*<small>No account? <a href={FlowRouter.path('register')}>Sign Up</a></small>*/}
				</div>
				{ this.state.errorMessage &&
					<div className="alert alert-danger alert-dismissable">
					<button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
					{this.state.errorMessage}
					</div>
				}
			</div>
		{ this.state.loading?
			<div style = {{
				background:"rgba(0,0,0,0.5)",
				position:"fixed",
				zIndex:5000,
				left:"0px",
				right:"0px",
				top:"0px",
				bottom:"0px",
				textAlign:"center"
			}}>
				<div style = {{
					position:"absolute",
					width:"100px",
					marginLeft:"-50px",
					left:"50%",
					top:"50%",
					marginTop:"-50px"
				}}>
					<RefreshIndicator
						size 	= { 100 }
						left 	= { 0 }
						top 	= { 0 }
						status 	= "loading"
					/>
				</div>
			</div>
		: null }
	</div>
) } } )

export default PageLogin;
