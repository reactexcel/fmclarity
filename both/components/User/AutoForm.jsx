AutoInput = {};

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

AutoInput.mdtext = React.createClass({
	render() {
		var value, used;
		value = this.props.value;
		used = value&&value.length;
		return (
		<div className="md-input">      
      		<input type="text" pattern=".{1,80}" className={used?'used':''} defaultValue={value} required/>
      		<span className="highlight"></span>
      		<span className="bar"></span>
      		<label>{this.props.placeholder}</label>
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
    	console.log(nextProps);
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
			<dl className="dl-horizontal">
				{schemaKeys.map(function(i){
					var type,label, placeholder, Input;

					type = "text";
					if(_.isObject(i)) {
						type = i.type;
						i = i.key;
					}

					label = schema[i].label||i.charAt(0).toUpperCase() + i.slice(1);
					placeholder = label?("Enter "+label):'';
					Input = AutoInput[type];
					return (
					<div key={item._id+'-'+i}>
					    <dt>{label}</dt>
					     <dd>
							<Input
							    placeholder={placeholder}
							    className="inline-form-control" 
							    value={item[i]} 
							    onChange={$scope.updateField(i)}
							/>
						</dd>
					</div>
					)
				})}
			</dl>
		)
	}
});
