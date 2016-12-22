/**
 * @author 			Leo Keith <leo@fmclarity.com>
 * @copyright 		2016 FM Clarity Pty Ltd.
 */
import React from "react";
import { ReactMeteorData } from 'meteor/react-meteor-data';
import Files from '../Files.jsx';

/**
 * @class 			FileView
 * @memberOf		module:models/Files
 */
const FileView = React.createClass( {

	mixins: [ ReactMeteorData ],

	getMeteorData() {

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
		if (this.props.drag && this.props.drop) {
			this.props.drag(this.handleDragFile);
			this.props.drop(this.drop);
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
		$(document).on('dragover', function (e)
		{
		  e.stopPropagation();
		  e.preventDefault();
			$("div.dragdrop").css(
				"border","2px dotted #bababa",
			);
			$("div.text").html(
				'<strong>Drop here to upload.</strong>'
			)
		});
		$(document).on('drop', function (e)
		{
			e.stopPropagation();
      e.preventDefault();
			$("div.dragdrop").css(
				"border","none",
			);
			$("div.text").html(
					'<i class="fa fa-cloud-upload" style="font-size:40px;"></i>'+
					'<br/>'+
					'<span><strong>Choose a file</strong> or drag it here.</span>'
				)
		});
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
	handleDragFile(e){
		e.stopPropagation();
    e.preventDefault();
	},
	drop(e){
     e.preventDefault();
		 this.handleChange(e);
	},
	render() {
		return (
			<div>
				{this.data.file?
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
						{ Meteor.user().getTeam().type != 'contractor' ? <div className="close-button" onClick={this.deleteFile}>&times;</div>: null}
						<div className="caption">{this.data.name}</div>
					</div>:

					<div style={{
							cursor:"pointer",
    					textAlign: 'center',
    					width: '180px',
    					height: '104px',
    					overflow: 'hidden',
    					marginRight: '10px',
    					marginTop: '10px',
    					position: 'relative',
						}}
						onClick={this.onClick} >
						<div style={{width:0,height:0,overflow:"hidden"}}>
							<input ref="input" type="file" onChange={this.handleChange}/>
						</div>
						<div title="Upload file" style={{paddingTop:"25%",color:"#999"}} className="text">
							<i className="fa fa-cloud-upload" style={{fontSize:"40px"}}></i>
							<br/>
							<span><strong>Choose a file</strong> or drag it here.</span>
						</div>
					</div>
				}
			</div>
		)
	}
} )

export default FileView;
