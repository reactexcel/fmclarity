AutoInput.File = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
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
		return(
			<div onClick={this.onClick} className="ibox" style={{margin:"5px 0 0 5px",padding:"5px"}}>
			    <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.url} />
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.handleChange}/>
				</div>
			</div>
		)
	}
});

AutoInput.Thumbnail = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
    	var query,file,name,url,extension,icon,isImage;
    	query = this.props.item;
    	file = Files.findOne(query);
    	if(file) {
    		url = file.url();
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
    	if(message === true){
	        this.data.file.remove();
     	} else {
		}
		this.props.onChange(null);
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

	render() {
		if(this.data.icon) {
			return(
				<div className="fm-icon">
					<div onClick={this.onClick}>
						{this.data.isImage
						?
							<div style={{height:"64px",overflow:"hidden"}}>
						    	<img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.url} />
						    </div>
						:
						    <img alt="image" src={this.data.icon} />
						}
						<div style={{width:0,height:0,overflow:"hidden"}}>
							<input ref="input" type="file" onChange={this.handleChange}/>
						</div>
						<span>{this.data.name}</span>
					</div>
					<span onClick={this.deleteFile}>Delete</span>
				</div>
			)
		}
		return(
			<div className="fm-icon" onClick={this.onClick}>
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.handleChange}/>
				</div>
				<div style={{paddingTop:"50%"}}>Upload file</div>
			</div>
		)
	}
});
