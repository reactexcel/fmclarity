AutoInput.FileField = React.createClass({
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

AutoInput.File = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {

		Meteor.subscribe('File');

    	var query,file,url,extension,icon;
    	query = this.props.item;
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
      		var newFile = new FS.File(file);
	    	console.log(newFile.name());
	    	console.log(newFile.url());
     		var name = file.name.replace(/[^A-Za-z0-9 _\-\.]/g,'');
      		newFile.name(name);
	    	console.log(newFile.name());
	    	console.log(newFile.url());
	    	Files.insert(newFile, function (err, newFile) {
	    		component.props.onChange({
			    	_id:newFile._id
	    		});
	    	});
	    });
	},

    deleteFile() {
		var message = confirm('Are you sure you want to delete this file?');
    	if(message == true){
	        this.data.file.remove();
     	}
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
		return(
			<div style={{position:"relative"}}>
				<div onClick={this.onClick} className="ibox" style={{margin:"5px 0 0 5px",padding:"5px"}}>
				    <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.file?this.data.url:"img/default-placeholder.png"} />
					<div style={{width:0,height:0,overflow:"hidden"}}>
						<input ref="input" type="file" onChange={this.handleChange}/>
					</div>
				</div>
			    {this.data.file?
					<div className="close-button" onClick={this.deleteFile}>&times;</div>
				:null}
			</div>
		)
	}
});

AutoInput.Thumbnail = React.createClass({

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
    		isImage = file.isImage();
    		if(extension) {
    			icon = "icons/"+extension+"-icon-64x64.png";
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
						:this.data.isImage?
							<div style={{width:"100%",overflow:"hidden",cursor:"pointer"}}>
						    	<img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.url} />
						    </div>
						:
						    <img alt="image" src={this.data.icon} />
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
