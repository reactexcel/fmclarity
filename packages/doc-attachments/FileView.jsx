import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

Meteor.methods({
	'Files.setMeta':function(fileId,meta) {
		Files.update(fileId,{$set:{
			meta:meta
		}})
	}
})

FileViewEdit = React.createClass({


	mixins: [ReactMeteorData],

    getMeteorData() {
		var file = this.props.item;
		var meta = FileMeta.findOne(file.meta);
		if(!meta) {
			meta = FileMeta.create({
				file:{_id:file._id},
				name:file.name()
			});
			file.meta = {_id:meta._id};
			Meteor.call('Files.setMeta',file._id,{
				_id:meta._id
			});
		}
		return {
			file:file,
			url:file.url(),
			meta:meta
		}
	},

    downloadFile() {
    	var win = window.open(this.data.url, '_blank');
    	win.focus();
    },

    deleteFile() {
		var message = confirm('Are you sure you want to delete this file?');
    	if(message == true){
	        this.data.file.remove();
	        this.data.meta.destroy();
			Modal.hide();
			this.props.onChange(null);
     	}
    },

	render(){
		var file = this.data.file;
		var meta = this.data.meta;
		if(!meta) {
			return <div/>
		}
		return (
			<div>
				<AutoForm schema={FileSchema} item={meta}/>
				<div style={{paddingTop:"20px"}}>
	              	<button type="button" onClick={this.downloadFile} className="btn btn-primary">Download</button>
    	           	<button style={{marginLeft:"5px"}} type="button" onClick={this.deleteFile} className="btn btn-danger">Delete</button>
    	        </div>
			</div>
		)
	}
})

File = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {

		Meteor.subscribe('File');
    	
    	var query,file,name,url,extension,icon,isImage,progress,meta;
    	query = this.props.item;
    	file = Files.findOne(query);
    	if(file) {
    		url = file.url();
    		meta = FileMeta.findOne(file.meta);
    		progress = file.uploadProgress();
    		extension = file.extension();
    		name = file.name();
    		isImage = file.isImage()&&extension!='tif';
    		if(extension) {
    			icon = "/icons/48px/"+extension+".png";
    		}
	    }
    	return {
    		file:file,
    		meta:meta,
    		name:name,
    		url:url,
    		extension:extension,
    		icon:icon,
    		isImage:isImage
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

	showFileDetailsModal() {
		Modal.show({
			content:<FileViewEdit item={this.data.file} onChange={this.props.onChange}/>
		})
	},

	showImageInModal() {
        Modal.show({
            content:<img style={{width:"100%","borderRadius":"1px",marginTop:"10px"}} alt="image" src={this.data.url} />
        })
    },

    downloadFile() {
    	var win = window.open(this.data.url, '_blank');
    	win.focus();
    },

    deleteFile() {
		var message = confirm('Are you sure you want to delete this file?');
    	if(message == true){
	        this.data.file.remove();
	        if(this.data.meta) {
		        this.data.meta.destroy();
		    }
			this.props.onChange(null);
     	}
    },

	onClick() {
		if(this.data.isImage) {
			this.showImageInModal()
		}
		else if(this.data.file) {
			this.showFileDetailsModal();
			//this.downloadFile();
		}
		else {
			$(this.refs.input).click();			
		}
	},

	componentDidMount() {
		$(this.refs.progress).knob({
        	readOnly:true,
			format:function (value) {
     			return value + '%';
  			}
        });
	},

	componentDidUpdate() {
		//console.log('updating');
		if(this.data.file&&!this.data.file.isUploaded()) {
			//console.log('rendering');
			$(this.refs.progress)
				.val(this.data.file.uploadProgress())
				.trigger("change");
		}
	},	

	render() {
		if(this.data.file) {
			return(
				<div className="fm-icon">
					<div title={this.data.name} onClick={this.onClick}>
						{
						!this.data.file.isUploaded()?
							<div style={{width:"100%",overflow:"hidden",textAlign:"center"}}>

									<input 
										ref="progress" 
										type="text" 
										defaultValue={0}
										data-max={100} 
										className="dial m-r-sm" 
										data-fgcolor="#3ca773"
										data-width="80" 
										data-height="80" 
									/>
						    </div>
						:this.data.isImage?
							<div style={{width:"100%",overflow:"hidden",cursor:"pointer"}}>
						    	<img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.url} />
						    </div>
						:
						    <img style={{marginTop:"20px"}} alt="image" src={this.data.icon} />
						}
						<div style={{width:0,height:0,overflow:"hidden"}}>
							<input ref="input" type="file" onChange={this.handleChange}/>
						</div>
					</div>
					<div className="close-button" onClick={this.deleteFile}>&times;</div>
					<div className="caption">{this.data.name}</div>
				</div>
			)
		}
		return(
			<div className="fm-icon" style={{cursor:"pointer"}} onClick={this.onClick}>
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.handleChange}/>
				</div>
				<div style={{paddingTop:"40%"}}>Upload file</div>
			</div>
		)
	}
});
