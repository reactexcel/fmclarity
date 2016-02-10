ContactList = React.createClass({

    showModal(selectedUser) {
    	if(selectedUser&&selectedUser.collectionName=="Team") {
	        Modal.show({
	            content:<TeamCard 
	            	item={selectedUser} 
	            	onChange={this.handleAdd} 
	            />
	        })
    	}
    	else {
	        Modal.show({
	            content:<UserCard 
	            	item={selectedUser} 
	            	team={this.props.team}
	            	onChange={this.handleAdd} 
	            />
	        })
	    }
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
    	var contacts = this.props.items;
    	var contact = this.props.items[index];
    	var handleChange = this.props.onChange;    	
		var message = confirm("Remove "+contact.getName()+"?");
		if(message==true) {
	    	contacts.splice(index,1);
	    	if(handleChange) {
		    	handleChange(contacts);
		    }
		}
    },

	render() {
		var contacts = this.props.items;
		var canCreate = this.props.onChange!=null;
		var canDelete = false;
		var component = this;
		return (
			<div className="contact-list">
			    {contacts?contacts.map(function(contact,idx){
			        return (
			            <div 
			            	className="contact-list-item"
			                key={idx}
			            >
			            	{canDelete?<span className="active-link pull-right" onClick={component.handleRemove.bind(null,idx)}>delete</span>:null}
			            	<div className="active-link" onClick={component.showModal.bind(null,contact)}>
					            <ContactCard item={contact}/>
					        </div>
			            </div>	
		            )
			    }):null}
			    {canCreate?
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