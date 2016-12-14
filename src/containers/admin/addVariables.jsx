import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'

import * as _ from 'lodash'
import Menu from '../../components/generic/Menu'
import LoadingIcon from '../../components/generic/LoadingIcon'
import * as actions_login from '../../actions/login/index'
import * as actions_salary from '../../actions/salary/index'
import * as actions_templates from '../../actions/admin/templates'
import Variables from '../../components/attendance/Variable'
import { CONFIG } from '../../config/index'


class VariablesContainer extends React.Component {
     constructor( props ){
        super( props );
        this.props.onIsAlreadyLogin()
        this.state = {
        }
    }
    componentWillMount(){
        this.props.onFetchVariables( )
    }
    componentWillReceiveProps( props ){

      //window.scrollTo(0, 0);

      if( props.logged_user.logged_in == -1 ){
            this.props.router.push('/logout');
        }else{
            if( props.logged_user.role == CONFIG.ADMIN || props.logged_user.role == CONFIG.HR){
            }else{
                this.props.router.push('/home');
            }
        }
    }
    componentDidUpdate(){
    }
    render(){
    	//let table =(this.state.empList.length>0)? <SalaryList {...this.props} empList={this.state.empList}/>:""
    	return(
    		<div>
            <Menu {...this.props }/>
    		<div id="content" className="app-content box-shadow-z0" role="main">
    		  <div className="app-header white box-shadow">
                <div className="navbar">
    			    <a data-toggle="modal" data-target="#aside" className="navbar-item pull-left hidden-lg-up">
      				   <i className="material-icons">&#xe5d2;</i>
    				</a>
    			    <div className="navbar-item pull-left h5" id="pageTitle">
    			       Template Variable
    			    </div>
			    </div>
				</div>
				<Variables {...this.props }/>
    		</div>
    		</div>
    		)
    }
}
function mapStateToProps( state ){
    return {
    	frontend : state.frontend.toJS(),
        logged_user : state.logged_user.toJS(),
        variable : state.template.toJS()
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    	onIsAlreadyLogin : () => {
            return dispatch( actions_login.isAlreadyLogin(  ))
        },
        onFetchVariables:()=>{
            return dispatch(actions_templates.get_variable())
        },
        onSaveVariable:(id,variable)=>{
            return dispatch(actions_templates.saveVariable(id,variable))
        },
        onDeleteVariable:(id)=>{
            return dispatch(actions_templates.deleteVariable(id))
        }
    }
}

const VisibleVariablesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)( VariablesContainer )

const RouterVisibleVariablesContainer = withRouter( VisibleVariablesContainer )

export default RouterVisibleVariablesContainer
