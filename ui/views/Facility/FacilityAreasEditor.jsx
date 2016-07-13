import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';


FacilityAreasSelector = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
    	var facility,areas;
    	if(this.props.item) {
    		facility = Facilities.findOne(this.props.item._id);
    		if(facility) {
    			areas = facility.getAreas();
    		}
    	}
    	return {
    		facility:facility,
    		areas:areas
    	}
    },

    render() {
    	return (
	    	<FacilityAreasSelectorInner facility={this.data.facility} areas={this.data.areas}/>
	    )
    }
})


FacilityAreasSelectorInner = React.createClass({

    getInitialState() {
    	return {
    		facility:this.props.facility,
    		selection:[{name:"Root",children:this.props.areas}]
    	}
    },

    selectItem(col,item) {
    	var selection = this.state.selection;
    	selection[col] = item;
        selection.length = col+1;
    	this.setState({
    		selection:selection
    	});
    },

    addItem(col) {
    	var selection = this.state.selection;
    	if(!selection[col]) {
    		selection[col] = {name:"Unknown",children:[]}
    	}
    	if(!selection[col].children) {
    		selection[col].children = [];
    	}
    	var lastIndex = selection[col].children.length-1;
    	var lastItem = selection[col].children[lastIndex];
    	if(!lastItem||lastItem.name.length) {
	    	selection[col].children.push({name:"",children:[]});
	    }
    	this.setState({
    		selection:selection
    	});     	
    	this.save();
    },

    removeItem(col,idx) {
    	var selection = this.state.selection;
    	selection.length = col+1;
        selection[col].children.splice(idx,1);
    	this.setState({
    		selection:selection
    	});
    	this.save();
    },

    updateItem(col,idx,event) {
    	var value = event.target.value;
    	var selection = this.state.selection;
    	selection[col].children[idx].name = value;
    	this.setState({
    		selection:selection
    	});
    	this.save();
    },

    save() {
    	var facility = this.state.facility;
    	var selection = this.state.selection;
    	var areas = selection[0].children;
    	facility.setAreas(areas);
    },

    componentDidMount() {
    	$('.areas-selector .slimscroll').slimScroll({
    		height:'504px'
    	});
    	this.save = _.debounce(this.save,1000);
    },

    render() {
        //refact - create a FacilityAreaSelectorRow class nad use that in these three instances below
    	var component = this;
    	var facility = this.state.facility;
        var selection = this.state.selection;
    	var areas = selection[0].children;
    	var editable = facility.canSetAreas();
    	var selectedArea = selection[1]||{};
    	var selectedSubArea = selection[2]||{};
    	return (
	    	<div className="areas-selector">
	    		<div className="areas-selector-col col-md-4">
	    			<div className="areas-selector-row areas-selector-row-header">Level</div>
			    	<div className="slimscroll">
			    	{
			    		areas.map(function(a,idx){
			    			return (
			    				<div key={idx} className={"areas-selector-row"+(selectedArea.name==a.name?" active":"")}>
						    		<input 
						    			onClick={component.selectItem.bind(component,1,a)} 
						    			value={a.name||undefined}
						    			readOnly={!editable}
						    			onChange={component.updateItem.bind(component,0,idx)}/>
			    					{editable?<span className="areas-selector-delete-icon" onClick={component.removeItem.bind(component,0,idx)}>&times;</span>:null}
					    		</div>
				    		)
			    		})
			    	}
			    	{editable?
			    	<div onClick={component.addItem.bind(component,0)} className="areas-selector-row">
						<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
				        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
				    </div>
				    :null}
			    	</div>
		    	</div>
		    	<div className="areas-selector-col col-md-4">
	    			<div className="areas-selector-row areas-selector-row-header">Area</div>
		    		<div className="slimscroll">
		    		{
		    			selectedArea&&selectedArea.children?selectedArea.children.map(function(b,idx){
		    				return (
			    				<div key={idx} className={"areas-selector-row"+(selectedSubArea.name==b.name?" active":"")}>
						    		<input
						    			onClick={component.selectItem.bind(component,2,b)} 
						    			value={b.name||undefined}
						    			readOnly={!editable}
						    			onChange={component.updateItem.bind(component,1,idx)}/>
			    					{editable?<span className="areas-selector-delete-icon" onClick={component.removeItem.bind(component,1,idx)}>&times;</span>:null}
					    		</div>
			    			)
		    			}):null
		    		}
		    		{editable&&selection[1]?
			    	<div onClick={component.addItem.bind(component,1)} className="areas-selector-row">
						<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
				        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
				    </div>
				    :null}
		    		</div>
	    		</div>
		    	<div className="areas-selector-col col-md-4">
	    			<div className="areas-selector-row areas-selector-row-header">Subarea</div>
		    		<div className="slimscroll">
		    		{
		    			selectedSubArea&&selectedSubArea.children?selectedSubArea.children.map(function(c,idx){
		    				return (
			    				<div key={idx} className={"areas-selector-row"+(selectedArea.name==c.name?" active":"")}>
						    		<input
						    			onClick={component.selectItem.bind(component,3,c)} 
						    			value={c.name||undefined}
						    			readOnly={!editable}
						    			onChange={component.updateItem.bind(component,2,idx)}/>
			    					{editable?<span className="areas-selector-delete-icon" onClick={component.removeItem.bind(component,2,idx)}>&times;</span>:null}
					    		</div>
			    			)
		    			}):null
		    		}
		    		{editable&&selection[2]?
			    	<div onClick={component.addItem.bind(component,2)} className="areas-selector-row">
						<span style={{display:"inline-block",minWidth:"18px",paddingRight:"24px"}}><i className="fa fa-plus"></i></span>
				        <span className="active-link" style={{fontStyle:"italic"}}>Add another</span>
				    </div>
				    :null}
		    		</div>
	    		</div>
	    	</div>
    	)
    }

})