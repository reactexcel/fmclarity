AdminPage = React.createClass({

	mixins:[ReactMeteorData],

	getMeteorData() {
		var user,url;
		//var user = Meteor.user();
		var user = Users.findOne({'profile.name':"Leo"});
		if(user&&!this.created) {
			var token = FMCLogin.generateLoginToken(user);
			console.log(token);
			url = FMCLogin.getUrl(token,'admin');
			console.log(url);
			//FMCLogin.loginWithToken(token.token);
			this.created=true;
		}
		return {
			url:url
		}
	},


	render() {
		return (
			<div>
                <div className="row wrapper page-heading">
                    <div className="col-lg-12">
                        <span style={{color:"#333",fontWeight:"bold",fontSize:"16px",lineHeight:"40px",marginLeft:"20px"}}>Admin</span>
                    </div>
                </div>
			    <div className="wrapper wrapper-content animated fadeIn">
			        <div className="row">
			            <div className="col-md-12">
			            	<div className="ibox">
			            		{this.data.url}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
})