/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
 
import React from "react";
import LoginService from '../LoginService.js';

/**
 * @class           PageLostPassword
 * @memberOf        module:core/Authentication
 */
const PageLostPassword = React.createClass( {

    getInitialState() {
        return {
            errorMessage: null
        }
    },

    handleSubmit( e ) {
        e.preventDefault();
        var email = this.refs.email.value.trim();
        Meteor.call( 'User.checkExists', { 'profile.email':email }, ( err, userExists ) => {
            if ( userExists ) {
                this.setState( { 
                    successMessage: <span>A password reset link has been sent to your registered email. Click the email link to continue.</span>,
                    errorMessagee: null
                } )
                LoginService.forgotPassword( email );
            } else {
                this.setState( { 
                    successMessage: null,
                    errorMessage: <span>Sorry, that email address is not registered on our system. If you think it should be please contact <a href="mailto:admin@fmclarity.com">admin@fmclarity.com</a>.</span> 
                } )
            }
        } );
    },

    render() {
        return (
            <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="/img/logo-horizontal-blue.svg"/>
            </div>
            <div style={{marginTop:"30%"}}>
            	<h2>Invitation expired</h2>
            	<p>Whoops! It looks like you have clicked on an expired invitation link.</p>
                <p>Check your email to see if you have more recent invitation -<br/>or enter your email address below to receive a new link.</p>

                <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input ref="email" type="email" className="form-control" placeholder="Email address" required=""/>
                    </div>
                    <button type="submit" className="btn btn-primary block full-width m-b">Send New Link</button>
                </form>
                <div>
                    <small>Already have an account? <a href={FlowRouter.path('login')}>Log in</a></small>
                </div>
                { this.state.successMessage &&
                    <div className="alert alert-success alert-dismissable">
                    <button aria-hidden="true" className="close" type="button" onClick={ ()=>{ this.setState( { successMessage:null }  ) } }>×</button>
                    {this.state.successMessage}
                    </div>
                }
                { this.state.errorMessage &&
                    <div className="alert alert-danger alert-dismissable">
                    <button aria-hidden="true" className="close" type="button" onClick={ ()=>{ this.setState( { errorMessage:null }  ) } }>×</button>
                    {this.state.errorMessage}
                    </div>
                }
            </div>
        </div>
    </div>
        )
    }
} )

export default PageLostPassword;
