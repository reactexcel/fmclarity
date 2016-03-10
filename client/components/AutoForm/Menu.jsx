AutoInput.menu = React.createClass({

	generateUid(separator) {
	    /// <summary>
	    ///    Creates a unique id for identification purposes.
	    /// </summary>
	    /// <param name="separator" type="String" optional="true">
	    /// The optional separator for grouping the generated segmants: default "-".    
	    /// </param>

	    var delim = separator || "-";

	    function S4() {
	        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    }

	    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var options = this.props.options;
		var defaultValue = this.props.value;
		var key = this.generateUid();
		var id = "datalist-"+key;

		return (
			<div>
				<div style={{border:"1px solid #ddd",padding:"2px 5px","borderRadius":"5px"}}>
					<input 
						type="text"
						style={{border:"none"}}
						className="inline-form-control"
						list={id}
						onChange={this.handleChange}
						value={defaultValue} 
					/>
					<datalist id={id}>
					{options.map(function(i){
						return <option key={i} value={i}>{i}</option>
					})}
					</datalist>
				</div>
			</div>
		)
	}

});
