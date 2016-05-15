import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

DocumentViewEdit = React.createClass({

    downloadFile() {

    	var win = window.open(this.data.url, '_blank');
    	win.focus();
    },

    deleteDoc() {
		var message = confirm('Are you sure you want to delete this file?');
    	if(message == true){
	        this.data.file.remove();
	        this.data.meta.destroy();
			Modal.hide();
			this.props.onChange(null);
     	}
    },

	render(){
		var doc = Documents._transform(this.props.item);
		if(!doc) {
			return <div/>
		}
		return (
			<div>
				<AutoForm schema={DocumentSchema} item={doc} save={this.props.onChange}/>
				<div style={{paddingTop:"20px",textAlign:"right"}}>
    	           	<button style={{marginLeft:"5px"}} type="button" onClick={this.deleteDoc} className="btn btn-danger">Delete</button>
    	           	<button style={{marginLeft:"5px"}} type="button" onClick={Modal.hide} className="btn btn-primary">Done</button>
    	        </div>
			</div>
		)
	}
})

DocumentIconHeader = React.createClass({

	render() {
		return (
			<div style={{padding:"5px",margin:"5px",border:"1px solid #ddd",backgroundColor:"#eee",fontWeight:"bold"}} onClick={this.handleClick}>
				<span style={{display:"inline-block",minWidth:"20px"}}>&nbsp;</span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px"}}>Type</span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px",paddingLeft:"10px"}}>Name</span>
				<span style={{display:"inline-block",width:"50%",minWidth:"20px",paddingLeft:"10px"}}>Description</span>
			</div>
		)
	}
});

DocumentIcon = React.createClass({

	showFileDetailsModal() {
		Modal.show({
			content:<DocumentViewEdit item={this.props.item} onChange={this.props.onChange}/>
		})
	},

	getColorFromString(str) {
		var r = (str.charCodeAt(str.length-3)%25)*10;
		var g = (str.charCodeAt(str.length-2)%25)*10;
		var b = (str.charCodeAt(str.length-1)%25)*10;
		return 'rgb('+r+','+g+','+b+')';
	},

	handleClick() {
		this.showFileDetailsModal();
	},

	render() {
		var doc = this.props.item;
		if(!doc) {
			return (
			<div style={{padding:"5px",margin:"5px",borderBottom:"1px solid #eee",cursor:"pointer"}} onClick={this.handleClick}>
				<span style={{display:"inline-block",minWidth:"20px"}}><i className="fa fa-plus"></i></span>
				<span style={{display:"inline-block",width:"90%",minWidth:"20px"}}>Add document</span>
			</div>
			)
		}
		var color = "#000";
		if(doc.type) {
			color = this.getColorFromString(doc.type);
		}
		return (
			<div style={{padding:"5px",margin:"5px",borderBottom:"1px solid #eee",overflow:"hidden",cursor:"pointer"}} onClick={this.handleClick}>
				<span style={{display:"inline-block",minWidth:"20px",color:color}}><i className="fa fa-file"></i></span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff"}}>{doc.type||'-'}</span>
				<span style={{display:"inline-block",width:"20%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff",paddingLeft:"10px"}}>{doc.name||'-'}</span>
				<span style={{display:"inline-block",width:"50%",minWidth:"20px",whiteSpace:"nowrap",backgroundColor:"#fff",color:"#999",fontStyle:"italic",paddingLeft:"10px"}}>{doc.description||'-'}</span>
			</div>
		)
	}
});

File = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {

		Meteor.subscribe('File');
    	
    	var query,file,name,url,extension,icon,isImage,progress;
    	query = this.props.item;
    	file = Files.findOne(query);
    	if(file) {
    		url = file.url();
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
			this.props.onChange(null);
     	}
    },

	onClick() {
		if(this.data.isImage) {
			this.showImageInModal()
		}
		else if(this.data.file) {
			//this.showFileDetailsModal();
			this.downloadFile();
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
				<div style={{paddingTop:"25%",fontSize:"40px",color:"#999"}}><i className="fa fa-cloud-upload"></i></div>
			</div>
		)
	}
});
