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
                <img src="img/logo-2-flat.png"/>
            </div>
            <br/>
            <h3>Welcome</h3>
            <p>We understand FM. We understand an FM system needs to be simple, save you time, and be a pleasure to use. FM Clarity offers you a new, streamlined FM solution.</p>
            <br/>
            <div className="dialog">
                <h3>Login in to see it in action.</h3>
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
                    <a href={FlowRouter.path('lost-password')}><small>Forgot password?</small></a><br/>
                    <small>Don't have an account? <a href={FlowRouter.path('register')}>Sign Up</a></small>
                </form>
            </div>
            <p className="m-t">
                <small>Small print &copy; 2015</small>
            </p>
        </div>
    </div>
	)}
});
