AutoInput.file = React.createClass({

	mixins: [ReactMeteorData],

    getMeteorData() {
    	var query = this.props.item;
    	var file = Files.findOne(query);
    	return {
    		file:file,
    		url:file?file.url():"img/default-placeholder.png"
    	}
    },

	onChange(event) {
		var component = this;
	    FS.Utility.eachFile(event, function(file) {
	    	Files.insert(file, function (err, newFile) {
	    		component.props.onChange({
	    			target:{
	    				value:{
			    			_id:newFile._id
	    				}
	    			}
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
			    <img style={{width:"100%","borderRadius":"1px"}} alt="image" src={this.data.url} />
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.onChange}/>
				</div>
			</div>
		)
	}
});
