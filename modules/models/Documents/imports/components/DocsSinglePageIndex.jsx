import React from "react";

import DocIcon from './DocIcon.jsx';
import DocIconHeader from './DocIconHeader.jsx';
import { Text } from '/modules/ui/MaterialInputs'

export default class DocsSinglePageIndex extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			documents: props.documents || [],
			facility: props.facility,
			keyword: "",
		}
  }
	componentWillReceiveProps( props ) {
		this.setState({
			documents: props.documents,
			facility: props.facility
		});
	}
  render() {
		let role = Meteor.user()&&Meteor.user().getRole();
    return (
			<div className='col-lg-12'>
				<div className="row" style={{backgroundColor: "#eee", marginLeft: "0%", borderBottom: "1px solid #ddd"}}>
					<div className="col-lg-offset-3 col-lg-6">
						<Text
							placeholder="Search key words"
							value={this.state.keyword}
							onChange={
								( value ) => {
									this.setState({
										keyword: value,
										documents: value ? _.filter(this.props.documents, ( d ) => new RegExp(value).test(d.name)) : this.props.documents,
									})
								}
							}
							/>
            <span style={{
                position: 'absolute',
                float: 'right',
                top: '42%',
                right: '4%',
                fontSize: '1.5em',
                color: '#aaa',
            }}>
              <i className="fa fa-search" aria-hidden="true"></i>
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
