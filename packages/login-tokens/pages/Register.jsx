PageRegister = React.createClass({


    handleSubmit: function(e) {
        e.preventDefault();
        var email = ReactDOM.findDOMNode(this.refs.email).value.trim();
        var password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        console.log({
            email:email,
            password:password
        });
        if (!email || !password) {
            return;
        }
        Accounts.createUser({
            email:email,
            password:password,
            profile:{
                name:name
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
    <div className="middle-box text-center loginscreen animated fadeInDown">
        <div>
            <h1 className="logo-name">FM</h1>
        </div>
        <h3>Register</h3>

        <p>Create account to see it in action.</p>

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
            <button type="submit" className="btn btn-primary block full-width m-b">Register</button>

            <p className="text-muted text-center">
                <small>Already have an account?</small>
            </p>
            <a className="btn btn-sm btn-white btn-block" href={FlowRouter.path('login')}>Login</a>
        </form>
        <p className="m-t">
            <small>Small print &copy; 2015</small>
        </p>
    </div>
	)}
});
