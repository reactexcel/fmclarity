import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

FileExplorer = React.createClass({

	handleChange(index,newValue) {
		var attachments = this.props.value||[];
		if(newValue) {
			attachments[index] = {
				_id:newValue._id,
				type:newValue.type
			}
		}
		else {
			attachments.splice(index,1);
		}
		this.props.onChange(attachments)
	},

	render(){
		var attachments = this.props.value||[];
		var component = this;
		return (
  			<div>
			{attachments.map(function(file,idx){
				return (
					<div key={idx} style={{display:"inline-block"}}>
						<File
							item={file}
							onChange={component.handleChange.bind(null,idx)}
						/>
					</div>
				)
			})}
			
				<div style={{display:"inline-block"}}>
					<File
						onChange={component.handleChange.bind(null,attachments.length)}
					/>
				</div>
			
			</div>
		)
	}
})

DocumentExplorer = React.createClass({

	handleChange(index,newValue) {
		var documents = this.props.value||[];
		if(newValue) {
			documents[index] = newValue;
		}
		else {
			documents.splice(index,1);
		}
		//console.log(documents);
		this.props.onChange(documents)
	},

	render(){
		var documents = this.props.value||[];
		var component = this;
		return (
  			<div>
  			<DocumentIconHeader />
			{documents.map(function(doc,idx){
				return (
					<div key={idx}>
						<DocumentIcon
							item={doc}
							onChange={component.handleChange.bind(null,idx)}
						/>
					</div>
				)
			})}
			
				<div>
					<DocumentIcon
						onChange={component.handleChange.bind(null,documents.length)}
					/>
				</div>
			
			</div>
		)
	}
})