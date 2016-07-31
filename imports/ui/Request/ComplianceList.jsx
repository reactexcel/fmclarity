import React from "react";
import ReactDom from "react-dom";
import {ReactMeteorData} from 'meteor/react-meteor-data';

import './ComplianceListTile.jsx';

//
// A variation on the 1 column filterbox which includes a left navigation bar
// and a right content section with a large detail view of the selected component
//
// PROPS
//
// items (array)
//      the collection of items to render
//
// filter (object)
//      a mongodb query object used to filter the request results
//
ComplianceList = React.createClass({

	render(){
        var facility,item,rules;

        item = this.props.item;
        if(item&&item.data) {
            rules = this.item.data.complianceRules
        }
		return (
			<div>
				{keys.map((k,idx)=>{
                    return (
                        <div key={idx}>
                            <div style={{borderBottom:"1px solid #ddd",backgroundColor:"#eee",padding:"14px 10px"}}>{k}</div>
                            <ComplianceGroup items={requests[k]}/>
                        </div>
                    )
				})}
			</div>
		)
	}
})

ComplianceGroup = React.createClass({

    showModal(rule) {
        //Need a width option for modals before this can be instantiated
        Modal.show({
            content:<AutoForm 
                item={rule}
                schema={ComplianceRuleSchema} 
                onSubmit={()=>{console.log(rule);Modal.hide();}}
            >            
                <h2>Edit Compliance Rule</h2>
            </AutoForm>,
        })
    },

    render() {
        var facility,item,rules;

        item = this.props.item;
        if(item&&item.data) {
            rules = item.data.complianceRules||[]
        }
        return (
            <div>
                {rules&&rules.length?rules.map((r,idx)=>{
                    return (
                        <div className="grid-item" key={idx} style={{height:"48px",paddingTop:"5px"}} onClick={this.showModal.bind(null,r)}>
                            <ComplianceListTile item={r}/>
                        </div>
                    )
                }):null}
            </div>
        )
    }
})