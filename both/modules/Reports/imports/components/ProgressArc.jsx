import React from "react";

export default ProgressArc = React.createClass(
{

	componentDidMount()
	{
		$( this.refs.input ).knob(
		{
			readOnly: true
		} );
		$( this.refs.input ).val( this.props.thisPeriod ).trigger( "change" );
	},

	componentDidUpdate()
	{
		var thisPeriod = this.props.thisPeriod;
		var lastPeriod = this.props.lastPeriod;
		var max = Math.max( thisPeriod, lastPeriod );

		$( this.refs.input )
			.trigger( 'configure',
			{
				"max": max,
			} )
			.val( thisPeriod )
			.trigger( "change" );
	},


	render()
	{
		var title = this.props.title;
		var thisPeriod = this.props.thisPeriod || 0;
		var lastPeriod = this.props.lastPeriod || 0;
		var max = Math.max( thisPeriod, lastPeriod );
		var color = this.props.color || '#3ca773';
		return (
			<div>
				<div style={{padding:0,height:"155px"}}>
					<h5 style={{float:"none"}}>{title}</h5>
                    <div>
						<input 
							ref="input" 
							type="text" 
							defaultValue={thisPeriod}
							data-max={max} 
							className="dial m-r-sm" 
							data-fgcolor={color} 
							data-width="100" 
							data-height="100" 
						/>
					</div>
					<p style={{clear:"both"}}><i>Previous: {lastPeriod}</i></p>
				</div>
			</div>
		)
	}

} );
