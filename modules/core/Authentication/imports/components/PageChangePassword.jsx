/**
 * @author          Leo Keith <leo@fmclarity.com>
 * @copyright       2016 FM Clarity Pty Ltd.
 */
 
import React from "react";

/**
 * @class           PageChangePassword
 * @memberOf        module:core/Authentication
 */
const PageChangePassword = React.createClass( {

    getInitialState() {
        return {
            errorMessage: null
        }
    },

    componentWillMount() {
        //Meteor.logout();
    },

    handleSubmit( e ) {
        e.preventDefault();

        let component = this;
        let password = this.refs.password.value.trim();
        let password2 = this.refs.password2.value.trim();
        let errorMessage = null;

        if ( password.length === 0 || password2.length === 0) {
            errorMessage = 'Please fill up the required fields.';
        } else if ( password !== password2 ) {
            errorMessage = 'Passwords do not match, please try again.';
        } else if ( password.length < 8) {
            errorMessage = 'Passwords should be at least 8 characters, please try again.';
        }

        if (errorMessage) {
          component.setState( { errorMessage: <span>{ errorMessage }</span> } );
          component.refs.password.value = '';
          component.refs.password2.value = '';
        } else {
            Accounts.changePassword( 'fm1q2w3e', password ); //really???
            FlowRouter.go( '/' );
        }

        return this;
    },

    render() {
        return (
            <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="/img/logo-horizontal-blue.svg"/>
            </div>
            <div style={{marginTop:"30%"}}>
                <h2>Change Password</h2>
                <p>Please enter a new password.</p>
                <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="password" ref="password" className="form-control" placeholder="New Password" required=""/>
                    </div>
                    <div className="form-group">
                        <input type="password" ref="password2" className="form-control" placeholder="Confirm New Password" required=""/>
                    </div>
                    <button type="submit" className="btn btn-primary block full-width m-b">Change Password</button>
                </form>
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
} )

export default PageChangePassword;
