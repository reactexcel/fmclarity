ProgressArc = React.createClass({

	componentDidMount() {
	},
	render() {
		var title = this.props.title;
		var thisMonth = this.props.value.thisMonth;
		var lastMonth = this.props.value.lastMonth;
		var color = this.props.color || '';
		var percentage = Math.floor(thisMonth*100/lastMonth);
	    return (
			<div className="ibox">
				<div className="ibox-content">
					<h5 style={{float:"none"}}>{title}</h5>
						<div style={{margin:"10px 0 10px 25px"}}>
							<div className={color+" c100 p"+percentage}>
							<span>{thisMonth}</span>
							<div className="slice">
							<div className="bar"></div>
							<div className="fill"></div>
						</div>
					</div>
				</div>
				<p style={{clear:"both"}}><i>Last month total: {lastMonth}</i></p>
				</div>
			</div>
	    )
	}

});