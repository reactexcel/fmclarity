UserProfileWidget= React.createClass({
	render() {
		return (
			<FlipWidget
				front={ContactSummary}
				back={UserProfile}
				item={this.props.item}
			/>
		)
	}
});

UserCard = React.createClass({

	getInitialState() {
		return {
			edit:this.props.edit||this.props.item==null||false
		}
	},

	toggleEdit() {
		this.setState({
			edit:!this.state.edit
		})
	},

	getMenu() {
		var component = this;
		var user = this.props.item;
		var selectedTeam = this.props.team||FM.getSelectedTeam();
		var menu = [
			{
				label:(this.state.edit?"View as card":"Edit"),
				action(){
					component.toggleEdit()
				}
			}
		];
		if(selectedTeam&&selectedTeam.hasMember(user)&&!user.isLoggedIn()) {
			menu.push({
				label:"Remove from "+selectedTeam.getName(),
				action(){
					selectedTeam.removeMember(user);
					//Modal.hide();
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		return (
			<div>
				{this.state.edit?
					<UserProfile item={this.props.item} onChange={this.props.onChange}/>
				:
					<ContactSummary item={this.props.item}/>
				}
				<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
					<i className="fa fa-wrench"></i>
				</a>
				<ul className="dropdown-menu dropdown-user" style={{
					position:"absolute",
					right: 0,
					top: "30px",
					left: "auto"
				}}>
				{menu.map(function(i,idx){
					return (
						<li key={idx} onClick={i.action}><a href="#">{i.label}</a></li>
					)
				})}
				</ul>
			</div>
		)
	}
});