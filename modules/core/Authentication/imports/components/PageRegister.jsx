/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */

import React from "react";
import LoginService from '../LoginService.js';
import { Teams } from '/modules/models/Teams';

/**
 * @class           PageRegister
 * @memberOf        module:core/Authentication
 */
const PageRegister = React.createClass( {

    getInitialState() {
        return {
            errorMessage: null
        }
    },

    handleSubmit: function( e ) {
        e.preventDefault();
        var me = this;
        var name = this.refs.name.value.trim();
        var email = this.refs.email.value.trim();
        if ( !email || !name ) {
            return;
        }
        Accounts.createUser( {
            email: email,
            password: Random.secret(),
            profile: {
                name: name,
                email: email
            }
        }, function( error ) {
            if ( error ) {
                console.log( error );
                me.setState( {
                    successMessage: null,
                    errorMessage: <span>Sorry, that email address is already registered. If you think it should not be please contact <a href="mailto:admin@fmclarity.com">admin@fmclarity.com</a>.</span>
                } )
            } else {
                let newTeam = Teams.create();
                Teams.save.call( newTeam );
                me.setState( {
                    errorMessage: null,
                    successMessage: <span>A password reset link has been sent to your registered email. Click the email link to continue.</span>
                } )
                LoginService.forgotPassword( email );
            }
        } );
        // TODO: send request to the server
        //React.findDOMNode(this.refs.email).value = '';
        //React.findDOMNode(this.refs.password).value = '';
        return;
    },


    render() {
        return (
            <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="img/logo-horizontal-blue.svg"/>
            </div>
            <div style={{marginTop:"30%"}}>
            <h2>Create Account</h2>
                <p>Enter your details below.</p>

                <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input ref="name" type="text" className="form-control" placeholder="Name" required=""/>
                    </div>
                    <div className="form-group">
                        <input ref="email" type="email" className="form-control" placeholder="Email" required=""/>
                    </div>
                    {/*<div className="form-group">
                        <div className="checkbox i-checks"><label> <input type="checkbox"/><i></i> Agree the terms and policy
                        </label></div>
                    </div>*/}
                    <button type="submit" className="btn btn-primary block full-width m-b">Register</button>
                </form>
                <div>
                    <small>Already have an account? <a href={FlowRouter.path('login')}>Log in</a></small>
                </div>
                { this.state.successMessage &&
                    <div className="alert alert-success alert-dismissable">
                    <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
                    {this.state.successMessage}
                    </div>
                }
                { this.state.errorMessage &&
                    <div className="alert alert-danger alert-dismissable">
                    <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
                    {this.state.errorMessage}
                    </div>
                }
            </div>
        </div>
    </div>
        )
    }
} );

export default PageRegister;
