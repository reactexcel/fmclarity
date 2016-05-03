File = React.createClass({

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
    			icon = "/icons/"+extension+"-icon-128x128.png";
    		}
	    }
    	return {
    		file:file,
    		url:file?file.url():"/img/default-placeholder.png",
    		extension:extension,
    		icon:icon
    	}
    },

	handleChange(event) {
		var component = this;
	    FS.Utility.eachFile(event, function(file) {
      		var newFile = new FS.File(file);
     		var name = file.name.replace(/[^A-Za-z0-9 _\-\.]/g,'');
      		newFile.name(name);
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
		return(
			<div style={{position:"relative"}}>
				<div onClick={this.onClick} className="ibox" style={{margin:"5px 0 0 5px",padding:"5px"}}>

					{this.data.file&&!this.data.file.isUploaded()?
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
						</div>:<div>
					    <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.file?this.data.url:"img/default-placeholder.png"} />
						<div style={{width:0,height:0,overflow:"hidden"}}>
							<input ref="input" type="file" onChange={this.handleChange}/>
						</div>
						</div>
					}
				</div>
			    {this.data.file?
					<div className="close-button" onClick={this.deleteFile}>&times;</div>
				:null}
			</div>
		)
	}
});