LostPassword = React.createClass({


    handleSubmit(e) {
        e.preventDefault();
        var email = React.findDOMNode(this.refs.email).value.trim();
        var user = Meteor.users.find({email:email});
        if(!user) {

        }
        else {
            Accounts.sendResetPasswordEmail(user._id);
        }
        return;
    },

	render() {return (
    <div className="passwordBox animated fadeInDown">
        <div className="row">

            <div className="col-md-12">
                <div className="ibox-content">

                    <h2 className="font-bold">Forgot password</h2>

                    <p>
                        Enter your email address and your password will be reset and emailed to you.
                    </p>

                    <div className="row">

                        <div className="col-lg-12">
                            <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <input ref="email" type="email" className="form-control" placeholder="Email address" required=""/>
                                </div>

                                <button type="submit" className="btn btn-primary block full-width m-b">Send new password</button>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div className="row">
            <div className="col-md-6">
                Copyright Example Company
            </div>
            <div className="col-md-6 text-right">
                <small>© 2014-2015</small>
            </div>
        </div>
    </div>
	)}
});
