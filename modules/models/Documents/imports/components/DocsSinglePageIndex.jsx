import React from "react";

import DocIcon from './DocIcon.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import { Text } from '/modules/ui/MaterialInputs'
import { AutoForm } from '/modules/core/AutoForm';
import { Documents } from '/modules/models/Documents'
import { Select } from '/modules/ui/MaterialInputs';

export default class DocsSinglePageIndex extends React.Component {
    constructor(props) {
        super(props);
    	this.state = {
    		documents: props.documents || [],
    		facility: props.facility,
            facilities: props.facilities,
            team: props.team,
    		keyword: "",
            currentPage: 0,
            nextPage: 2,
            previousPage: -1,
            listSize: "10",
    	};
        this.query = {
            $and:[]
        };
    }

    componentDidMount( ){
        if ( this.state.facilities && this.state.facilities.length ) {
            this.onPageChange();
        }
    }

    // Get the list of document which have to be shown
    onPageChange(){
        let  { query, facilityIds, listSize, currentPage, previousPage, nextPage, facilities, team } = this.state;
        if ( facilities && facilities.length ) {
            let ids = facilityIds || _.map(facilities, f => f._id),
            q = query || {
                $or:[
                    { "team._id" : team._id },
                    {
                        "facility._id": {
                            $in: ids
                        }
                    }
                ]
            },
            totalPage = Math.ceil( Documents.find(q).count() /  parseInt( listSize ) ),
            documents = Documents.findAll( q,
                {
                    limit: parseInt( listSize ),
                    skip: (currentPage * parseInt( listSize )),
                }
            );
            console.log({query, documents, totalPage});
            this.setState({
                documents,
                totalPage,
                facilityIds
            })
        }
    }
	componentWillReceiveProps( props ) {
        let componet = this;
        this.setState({
            documents: props.documents,
            facility: props.facility,
            team: props.team,
            facilities: props.facilities,
        },() =>{
            if ( props.facilities && props.facilities.length ) {
                componet.onPageChange();
            }
        });
        if( props.team ){
            this.query["team._id"] = props.team._id;
        }
	}
  render() {
    let role = Meteor.user()&&Meteor.user().getRole();
    return (
			<div className='col-lg-12'>
                <div className="row" style={{backgroundColor: "#eee", marginLeft: "0%", borderBottom: "1px solid #ddd"}}>
                    <div className="col-lg-12">
                        <div className="col-lg-9">
                            <h3>Document Filter</h3>
                        </div>
                        <div className="col-lg-3" title="Reset document filter">
                            <span style={{float:"right"}}>
                                <button className="btn btn-flat btn-primary" onClick={() => {
                                        let componet = this;
                                        this.setState({
                                            'query': null,
                                            'currentPage': 0,
                                            'nextPage': 2,
                                            'previousPage': -1,
                                        }, () => componet.onPageChange() );
                                        this.query = {
                                            $and: [],
                                            'team._id': this.state.team._id,
                                        }
                                    }}>
                                    <i className="fa fa-refresh"></i>
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
				<div className="row" style={{backgroundColor: "#eee", marginLeft: "0%", borderBottom: "1px solid #ddd"}}>
					<div className="col-lg-12">
                        {this.props.team?
                            <AutoForm
                                item={ { query: this.query } }
                                form={DocumentSearchSchema}
                                onSubmit={ ( response ) => {
                                    let { listSize, } = this.state,
                                        documents = null,
                                        componet = this;
                                    this.setState({
                                        'query': !response.query.$and.length ? _.omit(response.query, '$and') : response.query,
                                        'documents': documents,
                                        'currentPage': 0,
                                        'nextPage': 2,
                                        'previousPage': -1,
                                    },() => componet.onPageChange() );
                                    //console.log( { query: response.query } );
                                } }
                                submitText={<span title="Click to search documents">Search <i className="fa fa-search" aria-hidden="true"></i></span>}
                            />:
                        null}
					</div>
				</div>
                <div className="row" style={{backgroundColor: "#eee", marginLeft: "0%", borderBottom: "1px solid #ddd"}}>
                    <div className="col-lg-3">
                        <Select
                            placeholder={"Select list size"}
                            value={this.state.listSize}
                            items={[ "10", "25", "50", "100" ]}
                            onChange={ ( listSize ) => {
                                let componet = this;
                                this.setState({ listSize: listSize || "10" },() => componet.onPageChange())
                            }}
                            />
                    </div>
                    <div className="col-lg-9">
                        <span style={{float: "right"}}>
                            { this.state.previousPage != -1?
                                <button
                                    title="Go to previous page"
                                    className="btn btn-flat btn-primary"
                                    onClick={() => {
                                        let componet = this,
                                            nextPage = this.state.currentPage,
                                            currentPage = this.state.previousPage,
                                            previousPage = this.state.previousPage -1;
                                        componet.setState({
                                            currentPage,
                                            previousPage,
                                            nextPage,
                                        },() => componet.onPageChange())
                                    }}>
                                    <i className="fa fa-backward"></i>
                                     <span> Previous</span>
                                </button>:
                            null }
                            {this.state.nextPage-1 != this.state.totalPage?
                                <button
                                    title="Go to next page"
                                    className="btn btn-flat btn-primary"
                                    onClick={() => {
                                        let componet = this
                                            previousPage = this.state.currentPage;
                                            currentPage = this.state.nextPage,
                                            nextPage = this.state.nextPage + 1,
                                        componet.setState({
                                            currentPage,
                                            previousPage,
                                            nextPage,
                                        },() => componet.onPageChange())
                                    }}>
                                    <i className="fa fa-forward"></i>
                                    <span> Next</span>
                                </button>:
                            null}
                        </span>
                    </div>
                </div>
				<div className="row">
					<div className="col-lg-12">
						<DocIconHeader />
						<div style={{backgroundColor: "#fff"}}>
							{_.map(this.state.documents, ( doc, idx ) => (
									<DocIcon
										key = { idx }
										item = { doc }
										role = {role}
										/>
								))
							}
						</div>
					</div>
				</div>
			</div>
		);
  }
}
