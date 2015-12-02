ContactList = React.createClass({
	render() {
		var contacts = this.props.items;
		return (
			<div className="row" style={{margin:"5px 30px"}}>
			    {contacts.map(function(contact,idx){
			        return (
			            <div 
			                key={idx}
			                style={{padding:0}}
			                className={"table-row col-lg-12"}
			            >
				            <ContactCard item={contact}/>
			            </div>	
		            )
			    })}
			</div>
		)
	}
})