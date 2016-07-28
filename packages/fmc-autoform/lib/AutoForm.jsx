import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

AutoInput = {};

AutoInput.Events = {
	checkKey(event) {
		var value = event.target.value;
		if(event.key=='Enter') {
			var onEnter = this.props.onEnter;
			if(onEnter) {
				event.preventDefault();
				onEnter(event);
			}
		}
		else if(value==''&&event.key=='Backspace') {
			var onClear = this.props.onClear;
			if(onClear) {
				event.preventDefault();
				onClear(event);
			}
		}
	},

	handleChange(event) {
		var onChange = this.props.onChange;
		if(onChange) {
			onChange(event.target.value);
		}
	}
}

AutoForm = React.createClass({

	getInitialState() {
		return this.makeState(this.props);
	},

    componentWillReceiveProps(nextProps) {
    	this.setState(this.makeState(nextProps));
    },

    makeState(props) {
    	var item = props.item;
    	var field = props.field;
    	item = field?(item[field]||{}):item;
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
	    // if we have sent in an onSubmit function then we 
	    // are saying we want to handle the saving externally
	    // (this mean I am going to have to put in a manual save
	    // for the relevant workflow functions)
	    if(!this.props.onSubmit) {
        	this.saveItem();
        }
    },

    getSchema() {
    	return this.props.schema||this.props.item.getSchema();
    },

    saveItem() {
	   	var schema = this.getSchema();
    	var originalItem = this.props.item;
    	var field = this.props.field;
    	var save = this.props.save;
    	if(!originalItem[field]) {
    		originalItem[field] = {};
    	}
    	for(var i in schema) {
    		//console.log([originalItem,field]);
    		if(field) {
	    		originalItem[field][i] = this.state.item[i];
	    	}
	    	else {
	    		originalItem[i] = this.state.item[i];	    		
	    	}
	    	//console.log(originalItem);
    	}
    	if(save) {
	    	save(originalItem);
    	}
    	else {
	    	originalItem.save();
	    }
    },

	render() {
		if(!this.state.item) return <div/>;
		var item = this.state.item;
		var id = this.props.keyField||item._id;
	   	var schema = this.getSchema();
		var form = this.props.form||Object.keys(schema);
		
		return (
			<div className="autoform row">
				{this.props.children?
					<div className="col-sm-12">
						{this.props.children}
					</div>
				:null}
				{form.map((key)=>{

					var s = schema[key];

					if(!s) {
						throw new Meteor.Error("schema-field-"+key+"-does-not-exist","Schema field "+key+" doesn't exist","You have tried to access a nonexistent schema field.")
					}

					//check to see field conditions met
					if(s.condition&&!s.condition(item)) {
						return;
					}

					//if item is another schema create new AutoForm with item
					if(s.schema) {
						return (
							<span key={id+'-'+key}>
					        	<AutoForm 
					        		item={item} 
					        		field={key} 
					        		schema={s.schema} 
					        		save={this.props.save}
					        	>
								{s.label?<h5>{s.label}</h5>:null}
					        	</AutoForm>
					        </span>
						)
					}
					else {

						//calculate default placeholder
						var placeholder = 
							(s.label || key.charAt(0).toUpperCase()+key.slice(1))+
							(s.required?'*':'');

						//add default values to schema
						s = _.extend({
							input:"mdtext",
							size:12,
							options:{}
						},s);

						//If it is a string take it from the autoinput package
						//if it isn't then consider it a component
						var Input = _.isString(s.input)?AutoInput[s.input]:s.input;
						if(!Input) {
							console.log(s);
							throw new Meteor.Error("schema-input-type-does-not-exist","Schema input type doesn't exist","You have tried to access a nonexistent input type.")
						}
						return (
							<div key={id+'-'+key} className={"col-sm-"+s.size}>
								<Input
									placeholder={placeholder}
									context={item}
									value={item[key]} 
									onChange={this.updateField.bind(this,key)}
									options={s.options}
								/>
							</div>
						)

					}
				})}

	            {this.props.onSubmit?
	              <div style={{textAlign:"right"}}>
	                {/*<button type="button" className="btn btn-flat btn-default" data-dismiss="modal">Cancel</button>*/}
	                <button type="button" className="btn btn-flat btn-primary" onClick={()=>{this.props.onSubmit(item)}}>Submit</button>
	              </div>
	            :null}

			</div>
		)
	}
});
