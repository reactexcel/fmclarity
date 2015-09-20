Login = React.createClass({

    getInitialState() {
        return {
            errorMessage:null
        }
    },

    handleSubmit (e) {
        e.preventDefault();
        var component = this;
        var email = React.findDOMNode(this.refs.email).value.trim();
        var password = React.findDOMNode(this.refs.password).value.trim();
        if (!email || !password) {
            return;
        }
        Meteor.loginWithPassword(email,password,function(error){
            console.log(error);
            var errorMessage = null;
            if(error) {
                switch(error.error) {
                    case 400:
                    default:
                        errorMessage = <span>Incorrect username or password. Did you <a className="alert-link" href={FlowRouter.path('lost-password')}>forget your password?</a></span>
                    break;
                }
                component.setState({errorMessage:errorMessage});
                React.findDOMNode(component.refs.email).value = '';
                React.findDOMNode(component.refs.password).value = '';
            }
        });
        // TODO: send request to the server
        return;
    },

	render() {return (
    <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <div>
                <h1 className="logo-name">FM</h1>
            </div>
            <h3>Welcome</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <p>Login in. To see it in action.</p>
            { this.state.errorMessage &&
            <div className="alert alert-danger alert-dismissable">
                <button aria-hidden="true" data-dismiss="alert" className="close" type="button">×</button>
                {this.state.errorMessage}
            </div>
            }
            <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input type="email" ref="email" className="form-control" placeholder="Email Address" required=""/>
                </div>
                <div className="form-group">
                    <input type="password" ref="password" className="form-control" placeholder="Password" required=""/>
                </div>
                <button type="submit" className="btn btn-primary block full-width m-b">Login</button>

                <a href={FlowRouter.path('lost-password')}><small>Forgot password?</small></a>
                <p className="text-muted text-center"><small>Do not have an account?</small></p>
                <a className="btn btn-sm btn-white btn-block" href={FlowRouter.path('register')}>Create an account</a>
            </form>
            <p className="m-t">
                <small>Small print &copy; 2015</small>
            </p>
        </div>
    </div>
	)}
});
