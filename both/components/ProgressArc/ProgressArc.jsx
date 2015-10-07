ProgressArc = React.createClass({

	componentDidMount() {
        $(".dial").knob({
        	readOnly:true
        });
	},
	render() {
		var title = this.props.title;
		var thisMonth = this.props.value.thisMonth;
		var lastMonth = this.props.value.lastMonth;
		var color = this.props.color || '';
		var percentage = Math.floor(thisMonth*100/lastMonth);
	    return (
			<div className="ibox">
				<div className="ibox-content" style={{padding:0,height:"140px"}}>
					<h5 style={{float:"none"}}>{title}</h5>
                    <div>
						<input type="text" readOnly value={thisMonth} data-max={lastMonth} className="dial m-r-sm" dataFgColor="#1AB394" data-width="85" data-height="85" />
					</div>
					<p style={{clear:"both"}}><i>Last month: {lastMonth}</i></p>
				</div>
			</div>
	    )
	}

});