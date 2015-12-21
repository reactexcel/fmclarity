ContactList = React.createClass({

    showModal(selectedUser) {
        Modal.show({
            content:<UserProfile item={selectedUser} onChange={this.handleAdd} />
        })
    },

    handleModalClose() {
    	console.log('closing modal');
    },

    handleAdd(contact) {
    	var handleChange = this.props.onChange;
    	var contacts = this.props.items;
    	contacts.push(contact);
    	if(handleChange) {
	    	handleChange(contacts);
	    }
    },

    handleRemove(index) {
    	var handleChange = this.props.onChange;
    	var contacts = this.props.items;
    	contacts.splice(index,1);
    	if(handleChange) {
	    	handleChange(contacts);
	    }
    },

	render() {
		var contacts = this.props.items;
		var canEdit = this.props.onChange!=null;
		var component = this;
		return (
			<div className="contact-list">
			    {contacts.map(function(contact,idx){
			        return (
			            <div 
			            	className="contact-list-item"
			                key={idx}
			            >
			            	{canEdit?<span className="active-link pull-right" onClick={component.handleRemove.bind(null,idx)}>delete</span>:null}
			            	<div className="active-link" onClick={component.showModal.bind(null,contact)}>
					            <ContactCard item={contact}/>
					        </div>
			            </div>	
		            )
			    })}
			    {canEdit?
			    <div 
			        onClick={component.showModal.bind(null,null)}
			    >
			        <span className="active-link">Add contact</span>
			    </div>
			    :null}
			</div>
		)
	}
})