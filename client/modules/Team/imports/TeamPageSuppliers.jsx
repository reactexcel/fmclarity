import React from "react";

export default class TeamPageSuppliers extends React.Component 
{
    constructor()
    {
        super();
        this.state = {
            supplier: null
        }
    }

    showModal(callback) {
        Modal.show({
            content:<TeamViewEdit facility={this.data.facility} onChange={callback} />
        })
    }

	render() {
		return(
            <div className="suppliers-page animated fadeIn">
                <FacilityFilter />
                <div className="row" style={{paddingTop:"50px"}}>
                    <div className="col-md-4">
                        <TeamNavList 
                            selectedItem = { this.state.supplier }
                            onChange={ (supplier) => 
                            {
                                this.setState({
                                    supplier: supplier
                                })
                            }}
                        />
                    </div>
                    <div className="col-md-8"> 
                        <div className="card-body ibox">
                            {this.state.supplier?
                            <TeamCard item = { this.state.supplier }/>
                            :null}
                        </div>
                    </div>
                </div>
            </div>
		);
	}
}