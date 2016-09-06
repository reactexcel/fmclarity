import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

export default FileField = React.createClass({
	mixins: [ReactMeteorData],

    getMeteorData() {

		Meteor.subscribe('File');

    	var query,file,url,extension,icon;
    	query = this.props.value;
    	file = Files.findOne(query);
    	if(file) {
    		url = file.url();
    		extension = file.extension();
    		if(extension) {
    			icon = "icons/"+extension+"-icon-128x128.png";
    		}
	    }
    	return {
    		file:file,
    		url:file?file.url():"img/default-placeholder.png",
    		extension:extension,
    		icon:icon
    	}
    },

	handleChange(event) {
		var component = this;
	    FS.Utility.eachFile(event, function(file) {
	    	Files.insert(file, function (err, newFile) {
	    		component.props.onChange({
			    	_id:newFile._id
	    		});
	    	});
	    });
	},

	showImageInModal() {
        Modal.show({
            content:<img style={{width:"100%","borderRadius":"1px",marginTop:"10px"}} alt="image" src={this.data.url} />
        })
    },

	onClick() {
		if(this.data.file) {
			this.showImageInModal()
		}
		else {
			$(this.refs.input).click();			
		}
	},

	render() {
		var file = this.data.file;
		if(file) {
			return (
				<div>
					<span style={{display:"inline-block",lineHeight:"50px",width:"150px",color:"#999"}}>{this.props.placeholder}</span><span>{file.name()}</span>
				</div>
			)
		}
		else {
			return(
				<div>
					<span style={{display:"inline-block",lineHeight:"50px",width:"150px",color:"#999"}}>{this.props.placeholder}</span><input style={{display:"inline-block"}} ref="input" type="file" onChange={this.handleChange}/>
				</div>
			)
		}
	}
});

