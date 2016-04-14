PageChangePassword = React.createClass({

    getInitialState() {
        return {
            errorMessage:null
        }
    },

    componentWillMount() {
        //Meteor.logout();
    },

    handleSubmit (e) {
        e.preventDefault();
        var component = this;
        var password = this.refs.password.value.trim();
        var password2 = this.refs.password.value.trim();
        if(password!=password2) {
            component.setState({errorMessage:<span>Passwords do not match, please try again.</span>})
            component.refs.password.value = '';
            component.refs.password2.value = '';
        }
        else if(password.length<8) {
            component.setState({errorMessage:<span>Passwords should be at least 8 characters, please try again.</span>})
            component.refs.password.value = '';
            component.refs.password2.value = '';
        }
        else {
            Accounts.changePassword('fm1q2w3e',password);//really???
            FlowRouter.go('/dashboard');
        }
        return;
    },

    render() {return (
    <div className="middle-box loginscreen animated fadeInDown">
        <div>
            <div>
                <img width="300px" src="img/logo-horizontal-blue.svg"/>
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
    )}
});
 