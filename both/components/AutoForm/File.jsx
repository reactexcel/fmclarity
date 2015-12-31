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
    		url:url,
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

	onClick() {
		$(this.refs.input).click();
	},

	render() {
		return(
			<div onClick={this.onClick} className="ibox" style={{margin:"5px 0 0 5px",padding:"5px"}}>
			    <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.icon} />
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.handleChange}/>
				</div>
			</div>
		)
	}
});
