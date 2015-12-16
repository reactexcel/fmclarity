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
    	handleChange(contacts);
    },

    handleRemove(index) {
    	var handleChange = this.props.onChange;
    	var contacts = this.props.items;
    	contacts.splice(index,1);
    	handleChange(contacts);
    },

	render() {
		var contacts = this.props.items;
		var component = this;
		return (
			<div className="row" style={{margin:"5px 30px"}}>
			    {contacts.map(function(contact,idx){
			        return (
			            <div 
			                key={idx}
			                style={{padding:0}}
			                className={"col-lg-12"}
			            >
			            	<span className="active-link" onClick={component.handleRemove.bind(null,idx)} className="pull-right">delete</span>
			            	<div className="active-link" onClick={component.showModal.bind(null,contact)}>
					            <ContactCard item={contact}/>
					        </div>
			            </div>	
		            )
			    })}
			    <div 
			        style={{padding:0}}
			        className={"col-lg-12"}
			        onClick={component.showModal.bind(null,null)}
			    >
			        <span className="active-link">Add contact</span>
			    </div>	
			</div>
		)
	}
})