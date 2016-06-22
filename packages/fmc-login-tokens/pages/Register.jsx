import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

PageRegister = React.createClass({


    getInitialState() {
        return {
            errorMessage:null
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.refs.name.value.trim();
        var email = this.refs.email.value.trim();
        var password = this.refs.password.value.trim();
        if (!email||!password||!name) {
            return;
        }
        Accounts.createUser({
            email:email,
            password:password,
            profile:{
                name:name,
                email:email
            }
        },function(error){
            if(error) {
                console.log(error);
            }
            else {
                FlowRouter.go('/login');
            }
        });
        // TODO: send request to the server
        //React.findDOMNode(this.refs.email).value = '';
        //React.findDOMNode(this.refs.password).value = '';
        return;
    },


    render() {return (
    <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="img/logo-horizontal-blue.svg"/>
            </div>
            <div style={{marginTop:"30%"}}>
            <h2>Forgotten Password</h2>
                <p>Enter your email address and your password will be reset and emailed to you.</p>

                <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input ref="name" type="text" className="form-control" placeholder="Name" required=""/>
                    </div>
                    <div className="form-group">
                        <input ref="email" type="email" className="form-control" placeholder="Email" required=""/>
                    </div>
                    <div className="form-group">
                        <input ref="password" type="password" className="form-control" placeholder="Password" required=""/>
                    </div>
                    <div className="form-group">
                        <div className="checkbox i-checks"><label> <input type="checkbox"/><i></i> Agree the terms and policy
                        </label></div>
                    </div>
                    <button type="submit" className="btn btn-primary block full-width m-b">Reset Password</button>
                </form>
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
    )}
});
