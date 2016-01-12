
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
		var component = this;
		var save = this.props.onChange;
		var input = this.refs.input;
		new Switchery(this.refs.input, {size:'small',color:'#db4437'});
		input.onchange = function(e){
			if(component.blockNextSave) {
				component.blockNextSave = false;
				return;
			}
			var oldValue = component.props.value;
			var newValue = e.target.checked;
			if(oldValue!=newValue) {
				save(e.target.checked);
			}
		}
	},

	componentWillReceiveProps(newProps) {
		var input = this.refs.input;
		var oldValue = input.checked;
		var newValue = newProps.value;
		if(oldValue!=newValue) {
			this.blockNextSave = true;
			input.checked = newValue;
			var event = document.createEvent('HTMLEvents');
	        event.initEvent('change', true, true);
	        input.dispatchEvent(event);
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
	           					className={"md-switch col-sm-"+size}
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

AutoInput.Events = {
	handleChange(event) {
		var onChange = this.props.onChange;
		if(onChange) {
			onChange(event.target.value);
		}
	}
}

AutoInput.Text = React.createClass({
	mixins:[AutoInput.Events],

	componentDidMount() {
		if(this.props.elastic) {
			$(this.refs.input).elastic();		
		}
	},

	render() {
		if(this.props.readOnly) {
			return <span>{this.props.value}{this.props.elastic?<br/>:''}</span>
		}
		if(this.props.elastic) {
			return (
                <textarea 
                	ref="input"
					placeholder={this.props.placeholder}
                    className="issue-description-textarea inline-form-control" 
					defaultValue={this.props.value} 
					onChange={this.handleChange}
                />
			)
		}
		return (
		<input 
           	ref="input"
			type="text"
			placeholder={this.props.placeholder}
			className="inline-form-control" 
			defaultValue={this.props.value} 
			onChange={this.handleChange}
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

	handleChange(event) {
		var date,value;
		value = event.target.value;
		if(value) {
			date = new Date(value);
		}
		this.props.onChange(date);
	},

	dateToString(value) {
		if(!value) 
			return;
		var year = value.getFullYear();
		var month = value.getMonth().toString().length === 1 ? '0' + (value.getMonth() + 1).toString() : value.getMonth() + 1;
		var date = value.getDate().toString().length === 1 ? '0' + (value.getDate()).toString() : value.getDate();
		var hours = value.getHours().toString().length === 1 ? '0' + value.getHours().toString() : value.getHours();
		var minutes = value.getMinutes().toString().length === 1 ? '0' + value.getMinutes().toString() : value.getMinutes();
		var seconds = value.getSeconds().toString().length === 1 ? '0' + value.getSeconds().toString() : value.getSeconds();
		return year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds;
	},

	render() {
		var value = this.props.value;
		var convertedValue = this.dateToString(this.props.value);
		return (
			<div>
			{
				this.props.placeholder?
					<span style={{color:"#999"}}>{this.props.placeholder}:&nbsp;&nbsp;</span>
				:null
			}
			<input 
				type="datetime-local"
				ref="input"
				defaultValue={convertedValue} 
				onChange={this.handleChange}
			/>
			</div>
		)
	}
});


AutoForm = React.createClass({

	getInitialState() {
		return this.makeState(this.props);
	},

    componentWillReceiveProps(nextProps) {
    	this.setState(this.makeState(nextProps));
    },

    makeState(props) {
    	var item = this.props.item;
    	var field = props.field;
    	item = field?item[field]:item;
    	return {
    		item:item
    	}
    },

    componentWillMount: function() {
        this.saveItem = _.debounce(this.saveItem,500);
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
    	var field = this.props.field;
    	var save = this.props.save;
    	if(!originalItem.field) {
    		originalItem.field = {};
    	}
    	for(var i in schema) {
    		if(field) {
	    		originalItem[field][i] = this.state.item[i];
	    	}
	    	else {
	    		originalItem[i] = this.state.item[i];	    		
	    	}
    	}
    	if(save) {
	    	save();
    	}
    	else {
	    	originalItem.save();
	    }
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
				{this.props.children?
					<div className="col-sm-12">
						{this.props.children}
					</div>
				:null}
				{form.map(function(key){

					var s = schema[key];
					var condition = s.condition;
					if(condition&&!condition(item)) {
						return;
					}

					var autoValue = s.autoValue;
					var value = item[key];
					if(autoValue) {
						value = autoValue(item);
					}
					var placeholder = 
						(s.label || key.charAt(0).toUpperCase()+key.slice(1))+
						(s.required?'*':'');

					if(s.schema!=null) {
						return (
							<span key={id+'-'+key}>
					        	<AutoForm 
					        		item={item} 
					        		field={key} 
					        		schema={s.schema} 
					        		save={component.props.save} 
					        	>
								{s.label?<h5>{s.label}</h5>:null}
					        	</AutoForm>
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
						<div key={id+'-'+key} className={"col-sm-"+s.size}>
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
