AutoInput = {};

AutoInput.switchbank = React.createClass({
	componentDidMount() {
		var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));
		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		});
	},

	render() {
		var labels = this.props.options.labels;
		var cols = this.props.options.cols||6;
		return (
			<div className="md-switchbank md-h4-container" style={{margin:"0 -14px",height:"80px"}}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	           	<div className="row" style={{width:"100%",padding:"0 17px"}}>
	           		{labels.map(function(label){
	           			return (
	           				<div 
	           					key={label}
	           					className={"md-switch col-lg-"+cols}
	           				>
								<input 
									type="checkbox" 
									defaultChecked={true} 
									className="switch" 
								/>
								<label>{label}</label>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
});

AutoInput.select = React.createClass({

	componentDidMount() {
		$(this.refs.input).select2({
			tags:true,
			placeholder:"Type to add..."
		});
	},

	render() {
		return (
			<div className="md-select md-h4-container" style={{margin:"0 -14px",height:"80px"}}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	           	<div style={{width:"100%",padding:"0 17px"}}>


		<select ref="input" className="form-control" multiple="multiple">
		  <optgroup label="Alaskan/Hawaiian Time Zone">
		    <option value="AK">Alaska</option>
		    <option value="HI">Hawaii</option>
		  </optgroup>
		  <optgroup label="Pacific Time Zone">
		    <option value="CA">California</option>
		    <option value="NV">Nevada</option>
		    <option value="OR">Oregon</option>
		    <option value="WA">Washington</option>
		  </optgroup>
		  <optgroup label="Mountain Time Zone">
		    <option value="AZ">Arizona</option>
		    <option value="CO">Colorado</option>
		    <option value="ID">Idaho</option>
		    <option value="MT">Montana</option>
		    <option value="NE">Nebraska</option>
		    <option value="NM">New Mexico</option>
		    <option value="ND">North Dakota</option>
		    <option value="UT">Utah</option>
		    <option value="WY">Wyoming</option>
		  </optgroup>
		  <optgroup label="Central Time Zone">
		    <option value="AL">Alabama</option>
		    <option value="AR">Arkansas</option>
		    <option value="IL">Illinois</option>
		    <option value="IA">Iowa</option>
		    <option value="KS">Kansas</option>
		    <option value="KY">Kentucky</option>
		    <option value="LA">Louisiana</option>
		    <option value="MN">Minnesota</option>
		    <option value="MS">Mississippi</option>
		    <option value="MO">Missouri</option>
		    <option value="OK">Oklahoma</option>
		    <option value="SD">South Dakota</option>
		    <option value="TX">Texas</option>
		    <option value="TN">Tennessee</option>
		    <option value="WI">Wisconsin</option>
		  </optgroup>
		  <optgroup label="Eastern Time Zone">
		    <option value="CT">Connecticut</option>
		    <option value="DE">Delaware</option>
		    <option value="FL">Florida</option>
		    <option value="GA">Georgia</option>
		    <option value="IN">Indiana</option>
		    <option value="ME">Maine</option>
		    <option value="MD">Maryland</option>
		    <option value="MA">Massachusetts</option>
		    <option value="MI">Michigan</option>
		    <option value="NH">New Hampshire</option>
		    <option value="NJ">New Jersey</option>
		    <option value="NY">New York</option>
		    <option value="NC">North Carolina</option>
		    <option value="OH">Ohio</option>
		    <option value="PA">Pennsylvania</option>
		    <option value="RI">Rhode Island</option>
		    <option value="SC">South Carolina</option>
		    <option value="VT">Vermont</option>
		    <option value="VA">Virginia</option>
		    <option value="WV">West Virginia</option>
		  </optgroup>
		</select>

		</div>
		</div>
	)
	}
});

AutoInput.text = React.createClass({
	render() {
		return (
		<input 
			type="text"
			placeholder={this.props.placeholder}
			className="inline-form-control" 
			defaultValue={this.props.value} 
			onChange={this.props.onChange}
		/>
		)
	}
});

AutoInput.dltext = React.createClass({
	render() {
		return (
		<dl className="dl-horizontal">
		<dt>{this.props.placeholder}</dt>
		<dd>
		<input 
			type="text"
			placeholder={this.props.placeholder}
			className="inline-form-control" 
			defaultValue={this.props.value} 
			onChange={this.props.onChange}
		/>
		</dd>
		</dl>
		)
	}
});

AutoInput.mdtext = React.createClass({

	render() {
		var value, used;
		value = this.props.value;
		used = value&&value.length;
		return (
		<div className="md-input">      
      		<input 
      			type="text" 
      			pattern=".{1,80}" 
      			className={used?'used':''} 
      			defaultValue={value}
      			onChange={this.props.onChange}
      		/>
      		<span className="highlight"></span>
      		<span className="bar"></span>
      		<label>{this.props.placeholder}</label>
    	</div>
    	)
	}
});

AutoInput.textarea = React.createClass({

	render() {
		var options = this.props.options;
		var containerStyle = _.extend({
			margin:"0 -14px"
		},options?options.containerStyle:{});
		return (
			<div className="md-textarea md-h4-container" style={containerStyle}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	          	<textarea 
	          		style={{margin:"0 17px",width:"97%"}}
	          		className="inline-form-control" 
	          		placeholder="Type here..."
	          		defaultValue={this.props.value} 
	          		onChange={this.props.onChange}>
	          	</textarea>
	        </div>
		)
	}
});

AutoInput.custom = React.createClass({

	render() {
		var options = this.props.options;
		var containerStyle = _.extend({
			margin:"0 -14px"
		},options?options.containerStyle:{});
		return (
			<div className="md-textarea md-h4-container" style={containerStyle}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	          	<textarea 
	          		style={{margin:"0 17px",width:"97%"}}
	          		className="inline-form-control" 
	          		defaultValue={this.props.value} 
	          		onChange={this.props.onChange}>
	          	</textarea>
	        </div>
		)
	}
});

AutoInput.date = React.createClass({

	componentDidMount() {
		$(this.refs.dateInput).datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
        }).on('changeDate',this.props.onChange);
	},

	render() {
		return (
		<input 
			type="text"
			ref="dateInput"
			placeholder={this.props.placeholder}
			className="inline-form-control" 
			defaultValue={this.props.value} 
		/>
		)
	}
});

AutoForm = React.createClass({

	getInitialState() {
		return {
			item:this.props.item
		}
	},

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
    },

    componentWillReceiveProps(nextProps) {
    	this.setState({
    		item:nextProps.item
    	})
    },

    updateField(field,subfield) {
        var $scope = this;
        var item = this.state.item;
        // returns a function that modifies 'field'
        return function(event) {
        	var value = event.target.value;
        	if(subfield) {
	            item[field][subfield] = value;
        	}
        	else {
	            item[field] = value;
	        }
	        $scope.setState({
	        	item:item
	        })
            $scope.saveItem();
        }
    },

    saveItem() {
    	var schema = this.props.schema.schema();
    	var originalItem = this.props.item;
    	var save = this.props.save;
    	for(var i in schema) {
    		originalItem[i] = this.state.item[i];
    	}
    	save();
    },

	render() {
		var $scope = this;
		var item = this.state.item;
		var schema = this.props.schema.schema();
		var schemaKeys = this.props.form||Object.keys(schema);
		return (
			<div className="autoform row">
				{schemaKeys.map(function(i){
					var type, placeholder, Input, cols, options;

					cols = i.cols||12;
					options = i.options;

					type = "text";
					if(_.isObject(i)) {
						type = i.type;
						i = i.key;
					}

					placeholder = schema[i]?schema[i].label:i.charAt(0).toUpperCase() + i.slice(1);
					if(!schema[i].optional) {
						placeholder+='*';
					}
					Input = AutoInput[type];
					return (
					<div key={item._id+'-'+i} className={"col-lg-"+cols}>
						<Input
							placeholder={placeholder}
							value={item[i]} 
							onChange={$scope.updateField(i)}
							options={options}
						/>
					</div>
					)
				})}
			</div>
		)
	}
});
