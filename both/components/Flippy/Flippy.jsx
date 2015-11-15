FlipWidget= React.createClass({
	getInitialState() {
		return {
			edit:this.props.edit||false
		}
	},

	toggleEdit() {
		this.refs.card.classList.toggle("flip");
	},

	render() {
		var Front = this.props.front;
		var Back = this.props.back;
		return (
			<div ref="card" className="flip-container">
				<div className="flipper">
					<div className="front">
			            <div className="ibox">
			            	<Front item={this.props.item} />
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"2px",
								padding:"7px",
								top:0,
								fontSize:"15px",
								color:"#ccc"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-rotate-left"></i>
							</a>
			            </div>
		            </div>
					<div className="back">
			            <div className="ibox">
							<Back item={this.props.item}/>
							<a onClick={this.toggleEdit} style={{
								position:"absolute",
								right:"2px",
								padding:"7px",
								top:0,
								fontSize:"15px",
								color:"#ccc"
							}} onClick={this.toggleEdit}>
								<i className="fa fa-rotate-right"></i>
							</a>
			            </div>
		            </div>
	            </div>
            </div>
		)
	}
});
