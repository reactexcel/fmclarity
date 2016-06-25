import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PageLogin = React.createClass({

    getInitialState() {
        return {
            errorMessage:null
        }
    },

    componentWillMount() {
        Meteor.logout();
    },

    handleSubmit (e) {
        e.preventDefault();
        var component = this;
        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        if (!email) {//} || !password) {
            return;
        }
        Meteor.loginWithPassword(email,password,function(error){
            var errorMessage = null;
            if(error) {
                switch(error.error) {
                    case 400:
                    default:
                        errorMessage = <span>Incorrect username or password. Did you <a className="alert-link" href={FlowRouter.path('lost-password')}>forget your password?</a></span>
                    break;
                }
                component.setState({errorMessage:errorMessage});
                /*ReactDOM.findDOMNode(component.refs.email).value = '';*/
                component.refs.password.value = '';
            }
        });
        // TODO: send request to the server
        return;
    },

    render() {return (
    <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="img/logo-horizontal-blue.svg"/>
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
                    <small>No account? <a href={FlowRouter.path('register')}>Sign Up</a></small>
                </div>
                { this.state.errorMessage &&
                    <div className="alert alert-danger alert-dismissable">
                    <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
                    {this.state.errorMessage}
                    </div>
                }
            </div>
        </div>
    </div>
    )}
});
 