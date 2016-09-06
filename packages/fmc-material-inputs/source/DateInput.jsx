import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default DateInput = React.createClass(
{

	getInitialState()
	{
		var valueString = this.props.value ? moment( this.props.value ).format( "D-MMM-YY" ) : "";
		var dateValue = this.props.value ? new Date( this.props.value ) : null;
		return {
			value: valueString,
			dateValue: dateValue,
		}
	},

	handleDateChange( event, date )
	{
		let value = moment( date ).format( "D-MMM-YY" );
		console.log( value );
		this.setState(
		{
			value: value,
			dateValue: date,
		} )
		this.props.onChange( date );
	},

	handleSelect()
	{
		this.refs.datepicker.openDialog();
	},

	handleClear()
	{
		this.setState(
		{
			value: "",
			dateValue: null
		} )
		this.props.onChange( null );
	},

	render()
	{
		//this.props.value[ this.props.fieldName ] = this.state.value;
		console.log( this.state.value );
		return (
			<div>
				<AutoInput.mdtext 
					placeholder = { this.props.placeholder } 
					value = { this.state.value } 
					onSelect = { this.handleSelect }
					onClear = { this.handleClear }
					errors = { this.props.errors }
				/>
				<div style = {{display:"none"}}>
					<DatePicker 
						id = { "date-input" } 
						ref = "datepicker"
						className = { "date-input" }
						floatingLabelText = { this.props.placeholder }
						style = { {fontSize: "13px"} }
						mode = "landscape" 
						onChange = { this.handleDateChange }
						//defaultDate={this.state.dateValue}
						formatDate = { (date) => 
						{
							return moment(date).format("D-MMM-YY");
						} }
					/>
				</div>
			</div>
		)
	}
} );


