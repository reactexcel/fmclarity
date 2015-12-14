
AutoInput = {};

AutoInput.rating = React.createClass({
	render() {
		return (
			<div className="autoinput-rating">
				<span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
			</div>
		)
	}
});

AutoInput.switch = React.createClass({
	componentDidMount() {
		var save = this.props.onChange;
		var input = this.refs.input;
		new Switchery(this.refs.input, {size:'small',color:'#db4437'});
		input.onchange = function(e){
		  	save(e.target.checked);
		}
	},

	render() {
		var value = this.props.value;
		var label = this.props.placeholder;
		return (
	        <div className="md-switch">
				<input 
					ref="input"
					type="checkbox"
					defaultChecked={value}
				/>
				<label>{label}</label>
			</div>
		)
	}
});

AutoInput.switchbank = React.createClass({
	componentDidMount() {
		var obj = this.props.value;
		var save = this.props.onChange;
		var elems = Array.prototype.slice.call(document.querySelectorAll('.switch'));

		elems.forEach(function(html) {
		  var switchery = new Switchery(html, {size:'small',color:'#db4437'});
		  this.onchange = function(e){
		  	var value = e.target.checked;
		  	var fieldName = e.target.dataset.fieldName;
		  	obj[fieldName] = value;
		  	save(obj);
		  }
		});
	},

	render() {
		var $scope = this;
		var value,labels,options,size;
		value = this.props.value;
		labels = Object.keys(value);
		options = this.props.options;
		size = 6;
		if(options) {
			size = options.size||6;
		}
		return (
			<div className="md-switchbank md-h4-container" style={{margin:"0 -14px",height:"80px"}}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	           	<div className="row" style={{width:"100%",padding:"0 17px"}}>
	           		{labels.map(function(label){
	           			return (
	           				<div 
	           					key={label}
	           					className={"md-switch col-lg-"+size}
	           				>
								<input 
									type="checkbox"
									data-field-name={label}
									defaultChecked={value[label]} 
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

AutoInput.menu = React.createClass({
	componentDidMount() {
		$(this.refs.input)
		.select2({
			tags:true,
			placeholder:"",
  		})
  		.on('change',this.onChange);
	},

	onChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var options = this.props.options;
		var defaultValue = this.props.value;
		if(defaultValue&&(options.indexOf(defaultValue)<0)) {
			//options = [defaultValue].concat(this.props.options);
			options.unshift(defaultValue);
		}
		return (
			<div className="inline-select">
				<select 
					ref="input" 
					defaultValue={defaultValue} 
					className="form-control"
				>
					{options.map(function(i){
						return <option key={i} value={i}>{i}</option>
					})}
				</select>
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
		    <option value="CA">California</option>
		  </optgroup>
		  <optgroup label="Pacific Time Zone">
		    <option value="NV">Nevada</option>
		    <option value="OR">Oregon</option>
		    <option value="WA">Washington</option>
		  </optgroup>
		  <optgroup label="Mountain Time Zone">
		    <option value="AZ">Arizona</option>
		    <option value="ID">Idaho</option>
		    <option value="MT">Montana</option>
		  </optgroup>
		  <optgroup label="Central Time Zone">
		    <option value="AL">Alabama</option>
		    <option value="IL">Illinois</option>
		    <option value="IA">Iowa</option>
		  </optgroup>
		  <optgroup label="Eastern Time Zone">
		    <option value="CT">Connecticut</option>
		    <option value="DE">Delaware</option>
		    <option value="GA">Georgia</option>
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

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var value, used;
		value = this.props.value;
		used = value&&value.length;
		return (
		<div className="md-input">      
      		<input 
      			type="text" 
      			pattern=".{1,80}" 
      			className={"input "+(used?'used':'')} 
      			defaultValue={value}
      			onChange={this.handleChange}
      		/>
      		<span className="highlight"></span>
      		<span className="bar"></span>
      		<label>{this.props.placeholder}</label>
    	</div>
    	)
	}
});

AutoInput.mdtextarea = React.createClass({

	componentDidMount() {
		$(this.refs.input).elastic();
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var value = this.props.value;
		var used = value&&value.length;
		var options = this.props.options;
		var containerStyle = _.extend(options?options.containerStyle:{});
		return (
			<div className="md-textarea" style={containerStyle}>
	           	{/*<h4 className="background"><span>{this.props.placeholder}</span></h4>*/}
	          	<textarea 
	          		ref="input"
	          		className={"input inline-form-control "+(used?'used':'')}
	          		defaultValue={value} 
	          		onChange={this.handleChange}>
	          	</textarea>
      			<span className="highlight"></span>
      			<span className="bar"></span>
	      		<label>{this.props.placeholder}</label>
	        </div>
		)
	}
});

AutoInput.textarea = React.createClass({

	componentDidMount() {
		$(this.refs.input).elastic();
	},

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var value = this.props.value;
		var used = value&&value.length;
		var options = this.props.options;
		var containerStyle = _.extend({
			margin:"0 -14px"
		},options?options.containerStyle:{});
		return (
			<div className="dl-textarea md-h4-container" style={containerStyle}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	          	<textarea 
	          		ref="input"
	          		style={{margin:"0 17px",width:"97%"}}
	          		className={"input inline-form-control "+(used?'used':'')}
	          		defaultValue={value} 
	          		onChange={this.handleChange}>
	          	</textarea>
	        </div>
		)
	}
});

AutoInput.custom = React.createClass({

	handleChange(event) {
		this.props.onChange(event.target.value);
	},

	render() {
		var options = this.props.options;
		var containerStyle = _.extend({
			margin:"0 -14px"
		},options?options.containerStyle:{});
		return (
			<div className="dl-textarea md-h4-container" style={containerStyle}>
	           	<h4 className="background"><span>{this.props.placeholder}</span></h4>
	          	<textarea 
	          		style={{margin:"0 17px",width:"97%"}}
	          		className="inline-form-control" 
	          		defaultValue={this.props.value} 
	          		onChange={this.handleChange}>
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

    updateField(field,value) {
        var item = this.state.item;
	    item[field] = value;
	    this.setState({
	        item:item
	    })
        this.saveItem();
    },

    saveItem() {
    	var schema = this.props.schema;
    	var originalItem = this.props.item;
    	var save = this.props.save;
    	for(var i in schema) {
    		originalItem[i] = this.state.item[i];
    	}
    	save();
    },

	render() {
		if(!this.state.item) return <div/>;
		var component = this;
		var item = this.state.item;
		var id = this.props.key||item._id;
		var schema = this.props.schema;
		var form = this.props.form||Object.keys(schema);
		return (
			<div className="autoform row">
				{form.map(function(key){

					var s = schema[key];
					var placeholder = 
						(s.label || key.charAt(0).toUpperCase()+key.slice(1))+
						(s.required?'*':'');

					if(s.schema!=null) {
						return (
							<span key={id+'-'+key}>
								{s.label?<h5 style={{padding:"7px"}}>{s.label}</h5>:null}
					        	<AutoForm 
					        		item={item[key]} 
					        		key={id} 
					        		schema={s.schema} 
					        		save={component.props.save} 
					        	/>
					        </span>
						)
					}

					s = _.extend({
						input:"mdtext",
						size:12,
						options:{}
					},s);

					var Input = AutoInput[s.input];

					return (
					<div key={id+'-'+key} className={"col-lg-"+s.size}>
						<Input
							placeholder={placeholder}
							value={item[key]} 
							onChange={component.updateField.bind(component,key)}
							options={s.options}
						/>
					</div>
					)
				})}
			</div>
		)
	}
});
