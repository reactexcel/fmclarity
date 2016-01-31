

DashboardPage = React.createClass({

	getInitialState(){
		return ({
			lineView:'this 3 months',
			barView:'this month'
		})
	},

	setBarView(newView) {
		this.setState({
			barView:newView
		})
	},

	componentDidMount() {
		//console.log(Meteor.users.find());
	},

	getBarMenu() {
		var component = this;
		return [
			{
				label:("Day"),
				action(){
					component.setBarView('today')
				}
			},
			{
				label:("Week"),
				action(){
					component.setBarView('this week')
				}
			},
			{
				label:("Month"),
				action(){
					component.setBarView('this month')
				}
			},
			{
				label:("3 Months"),
				action(){
					component.setBarView('this 3 months')
				}
			},
			{
				label:("6 Months"),
				action(){
					component.setBarView('this 6 months')
				}
			}
		];
	},

	render() {
		return(
	<div>
		<div className="row wrapper page-heading">
			<div className="col-lg-12">
	            <FacilityFilter title="Dashboard"/>
			</div>
		</div>
	    <div className="wrapper wrapper-content animated fadeIn">
	        <div className="row" style={{margin:"5px 0 0 -20px"}}>
	            <div className="col-sm-6" style={{padding:"0 0 0 20px"}}>
		            <div className="ibox">
				        <LineChart />
		            </div>
		            <div className="ibox">
		            	<div className="ibox-title">
			            	<h2>This month overview</h2>
			            </div>
			            <div className="ibox-content" style={{padding:"0px 50px 30px 50px"}}>
			            	<div className="row" style={{textAlign:"center",clear:"both"}}>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Requests" value={{thisMonth:15,lastMonth:20}}/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Open Requests" value={{thisMonth:15,lastMonth:20}} color="green"/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Open Orders" value={{thisMonth:8,lastMonth:20}} color="orange"/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Open Quotes" value={{thisMonth:5,lastMonth:8}}/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Expired Insurance" value={{thisMonth:5,lastMonth:7}} color="green"/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Supplier Reviews" value={{thisMonth:5,lastMonth:8}} color="orange"/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Contracts Expiring" value={{thisMonth:5,lastMonth:7}} color="green"/>
						        </div>
								<div className="col-lg-3 col-md-3 col-sm-6" style={{padding:0}}>
									<ProgressArc title="Insurance Expiring" value={{thisMonth:5,lastMonth:8}} color="orange"/>
						        </div>
				            </div>
				        </div>
		            </div>
		        </div>
	            <div className="col-sm-6" style={{padding:"0 0 0 20px"}}>
		            <div className="ibox">
		            	<ActionsMenu items={this.getBarMenu()} icon="eye" />
		            	<div className="ibox-title">
		            		<h2>Repairs by service type {this.state.barView}</h2>
		            	</div>
		            	<div className="ibox-content">
	            			<div style={{margin:"0px 25px 0px 0px"}}>
				            	<BarChart view={this.state.barView}/>
				            </div>
			            </div>
		            </div>
		            <div className="ibox">
		            	<div className="ibox-title">
		            		<h2>Preventative maintenence schedule</h2>
		            	</div>
		            	<div className="ibox-content" style={{padding:"7px"}}>
			            	<Calendar />
			            </div>
		            </div>
		        </div>
			</div>
		</div>
	</div>
	);}
})