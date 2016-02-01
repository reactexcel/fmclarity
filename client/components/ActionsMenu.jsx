ActionsMenu = React.createClass({

	render() {
		var icon = this.props.icon||'wrench';
		if(!this.props.items) {
			return <div/>
		}
		return (
			<div>
				<a className="dropdown-toggle tools-icon" data-toggle="dropdown" href="#">
					<i className={"fa fa-"+icon}></i>
				</a>
				<ul className="dropdown-menu dropdown-user" style={{
					position:"absolute",
					right: 0,
					top: "30px",
					left: "auto"
		    	}}>
		    		{this.props.items.map(function(i,idx){
		    			return (
		    				<li key={idx} onClick={i.action}><a href="#">{i.label}</a></li>
		    			)
		    		})}
				</ul>
			</div>
		)
	}

});