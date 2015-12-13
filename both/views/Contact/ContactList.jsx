ContactList = React.createClass({

    showModal(selectedUser) {
        Modal.show({
            title:selectedUser?selectedUser.getName():null,
            content:<UserProfile item={selectedUser} />
        })
    },

    handleAdd(event) {
    	this.showModal()
    	console.log(event);
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
			                onClick={component.showModal.bind(null,contact)}
			            >
				            <ContactCard item={contact}/>
			            </div>	
		            )
			    })}
			    <div 
			        style={{padding:0}}
			        className={"col-lg-12"}
			        onClick={component.handleAdd}
			    >
			        Add contact
			    </div>	
			</div>
		)
	}
})