LostPassword = React.createClass({

    getInitialState() {
        return {
            errorMessage:null
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        var email = this.refs.email.value.trim();
        var user = Meteor.users.find({email:email});
        if(!user) {
            this.setState({errorMessage:<span>Sorry, that email address is not registered on our system. If you think it should be please contact <a href="mailto:admin@fmclarity.com">admin@fmclarity.com</a>.</span>})
        }
        else {
            this.setState({errorMessage:<span>A password reset link has been sent to your registered email. Click the email link.</span>})
            Accounts.forgotPassword({email:email});
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
            <h2>Forgotten Password</h2>
                <p>Enter your email address and your password will be reset and emailed to you.</p>

                <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input ref="email" type="email" className="form-control" placeholder="Email address" required=""/>
                    </div>
                    <button type="submit" className="btn btn-primary block full-width m-b">Reset Password</button>
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