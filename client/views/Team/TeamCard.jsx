TeamCard = React.createClass({

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
		var item = this.props.item;
		var selectedTeam = FM.getSelectedTeam();
		var menu = [
			{
				label:(this.state.edit?"View as card":"Edit"),
				action(){
					component.toggleEdit()
				}
			}
		];
		if(selectedTeam._id!=item._id) {
			menu.push({
				label:"Remove supplier from your team",
				action(){
					selectedTeam.removeSupplier(item);
				}
			});
		}
		return menu;
	},

	render() {
		var menu = this.getMenu();
		return (
			<div ref="card" className="flip-container">
				<div className="flipper">
					<div className="front">
			            <div className="ibox">
			            	{this.state.edit?
			            		<TeamViewEdit item={this.props.item} />
			            	:
								<TeamViewDetail item={this.props.item}/>
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
		            </div>
	            </div>
            </div>
		)
	}
});