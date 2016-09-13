import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';

export default FileView = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

		Meteor.subscribe( 'Files' );

		var query, file, name, url, extension, icon, isImage, progress;
		if ( this.props.item && this.props.item._id ) {
			file = Files.findOne( this.props.item._id );
		}
		if ( file ) {
			url = file.url();
			progress = file.uploadProgress();
			extension = file.extension();
			name = file.name();
			isImage = file.isImage() && extension != 'tif';
			/*if( isImage ) {
				icon = url;
			}
			else */if ( extension ) {
				icon = "/icons/48px/" + extension + ".png";
			}
		}
		return {
			file: file,
			name: name,
			url: url,
			extension: extension,
			icon: icon,
			isImage: isImage
		}
	},

	handleChange( event ) {
		var component = this;
		FS.Utility.eachFile( event, function( file ) {
			Files.insert( file, function( err, newFile ) {
				component.props.onChange( {
					_id: newFile._id
				} );
			} );
		} );
	},

	showImageInModal() {
		Modal.show( {
			content: <img style={{width:"100%","borderRadius":"1px",marginTop:"10px"}} alt="image" src={this.data.url} />
		} )
	},

	downloadFile() {
		var win = window.open( this.data.url, '_blank' );
		win.focus();
	},

	deleteFile() {
		var message = confirm( 'Are you sure you want to delete this file?' );
		if ( message == true ) {
			this.data.file.remove();
			this.props.onChange( null );
		}
	},

	onClick() {
		if ( this.data.isImage ) {
			this.showImageInModal()
		} else if ( this.data.file ) {
			//this.showFileDetailsModal();
			this.downloadFile();
		} else {
			$( this.refs.input ).click();
		}
	},

	componentDidMount() {
		$( this.refs.progress ).knob( {
			readOnly: true,
			format: function( value ) {
				return value + '%';
			}
		} );
	},

	componentDidUpdate() {
		//console.log('updating');
		if ( this.data.file && !this.data.file.isUploaded() ) {
			//console.log('rendering');
			$( this.refs.progress )
				.val( this.data.file.uploadProgress() )
				.trigger( "change" );
		}
	},

	render() {
		if ( this.data.file ) {
			return (
				<div className="fm-icon">
					<div onClick={this.onClick}>
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
						    <img style={{marginTop:"20px",cursor:"pointer"}} title="Click to download" alt="image" src={this.data.icon} />
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
		return (
			<div className="fm-icon" style={{cursor:"pointer"}} onClick={this.onClick}>
				<div style={{width:0,height:0,overflow:"hidden"}}>
					<input ref="input" type="file" onChange={this.handleChange}/>
				</div>
				<div title="Upload file" style={{paddingTop:"25%",fontSize:"40px",color:"#999"}}>
					<i className="fa fa-cloud-upload"></i>
				</div>
			</div>
		)
	}
} );
