import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import ReactDOM from 'react-dom'

import * as _ from 'lodash'
import {notify} from '../../services/index'

import Menu from '../../components/generic/Menu'
import LoadingIcon from '../../components/generic/LoadingIcon'

//-----------------------------------------
import * as actions_login from '../../actions/login/index'
import * as actions_usersList from '../../actions/user/usersList'
import * as actions_managePayslips from '../../actions/admin/managePayslips'

import UsersList from '../../components/attendance/UsersList'
import UserPayslipsHistory from '../../components/managePayslips/UserPayslipsHistory'
import FormGeneratePaySlip from '../../components/managePayslips/FormGeneratePaySlip'

class ManagePayslips extends React.Component {
    constructor( props ){
        super( props );
        this.props.onIsAlreadyLogin()
        this.state = {
          "selected_user_name" : "",
          "selected_user_image" : "",
          "selected_user_jobtitle" : "",
          "selected_user_id" : "",
          "defaultUserDisplay" : "",

          "user_data_for_payslip" : {},
          "user_payslip_history" : []
        }

        this.onUserClick = this.onUserClick.bind( this )
        this.callAddUserSalary = this.callAddUserSalary.bind( this )
        this.callAddUserHolding = this.callAddUserHolding.bind( this )
    }    
    componentWillMount(){
      this.props.onUsersList()
    }
    componentWillReceiveProps( props ){
      window.scrollTo(0, 0);
      if( props.logged_user.logged_in == -1 ){
        this.props.router.push('/logout');
      }else{
        if( props.logged_user.role == 'Admin'){
          //this.props.onUsersList( )
        }else{
          this.props.router.push('/home');    
        }
      }
      //////////////////
      let s_user_data_for_payslip = {}
      let s_user_payslip_history = []

      if( typeof props.managePayslips.user_data_for_payslip != 'undefined' ){
        s_user_data_for_payslip = props.managePayslips.user_data_for_payslip
      }
      if( typeof props.managePayslips.user_payslip_history != 'undefined' ){
        s_user_payslip_history = props.managePayslips.user_payslip_history
      }
      this.setState({
        user_data_for_payslip : s_user_data_for_payslip,
        user_payslip_history : s_user_payslip_history
      })
    }
    componentDidUpdate(){
      if( this.state.defaultUserDisplay  == '' ){
          if( this.props.usersList.users.length > 0 ){
              let firstUser = this.props.usersList.users[0]
              let defaultUserId = firstUser.user_Id
              this.onUserClick( defaultUserId )
          }
      }
    }
    onUserClick( userid ){
      let selected_user_name = ""
      let selected_user_image = ""
      let selected_user_jobtitle = ""
      let selected_user_id = ""
      
      if( this.props.usersList.users.length > 0 ){
        let userDetails = _.find( this.props.usersList.users, { 'user_Id' : userid } )
        if( typeof userDetails != 'undefined' ){
          selected_user_name = userDetails.name
          selected_user_image = userDetails.slack_profile.image_192
          selected_user_jobtitle = userDetails.jobtitle
          selected_user_id = userDetails.user_Id
        }
      }
      this.setState({
            "defaultUserDisplay" : userid,
            "selected_user_name" : selected_user_name,
            "selected_user_image" : selected_user_image,
            "selected_user_jobtitle" : selected_user_jobtitle,
            "selected_user_id" : selected_user_id
        })
        this.props.onUserManagePayslipsData( userid )
    }
    

    callAddUserSalary( new_salary_details  ){
      this.props.onAddNewSalary( new_salary_details ).then( 
        (data) => {
            
        },(error) => {
            notify( error );
        })
    }
    callAddUserHolding( new_holding_details ){
      this.props.onAddNewHolding( new_holding_details ).then( 
        (data) => {
            
        },(error) => {
            notify( error );
        }) 
    }

    render(){

      let status_message = ""
      // if( this.props.manageSalary.status_message != '' ){
      //   status_message = <span className="label label-lg primary pos-rlt m-r-xs">
      //     <b className="arrow left b-primary"></b>{this.props.manageSalary.status_message}</span>
      // }

      let selectedUserId = ""
     
       

    return(
        <div>
          <Menu {...this.props }/>
            <div id="content" className="app-content box-shadow-z0" role="main">
              
              <div className="app-header white box-shadow">
                <div className="navbar">
                  <a data-toggle="modal" data-target="#aside" className="navbar-item pull-left hidden-lg-up">
                    <i className="material-icons">&#xe5d2;</i>
                  </a>
                  <div className="navbar-item pull-left h5" id="pageTitle">Manage Payslips &nbsp;&nbsp;&nbsp; {status_message}</div>
                </div>
                <div className="row no-gutter">
                  <div className="col-12">
                    <LoadingIcon {...this.props}/>
                  </div>
                </div>
              </div>

              <div className="app-body" id="view">
                <div className="padding">
                  
                  <div className="row">
                    <div className="col-md-2">
                      <UsersList users = { this.props.usersList.users } selectedUserId={this.state.selected_user_id} onUserClick = { this.onUserClick } {...this.props } />
                    </div>
                    <div className="col-md-10">
                      <div className="box">
                        <div className="p-a text-center">
                          <a href="" className="text-md m-t block">{this.state.selected_user_name}</a>
                          <p><small>{this.state.selected_user_jobtitle}</small></p>
                        </div>
                      </div>

                      <div className="row no-gutter b-t box">
                        <div className="col-xs-9 b-r box">
                          <div className="p-a block" >
                            <h6 className="text-center">Generate Payslip</h6>
                            <hr/>
                            <FormGeneratePaySlip 
                              user_data_for_payslip={this.state.user_data_for_payslip}
                            />
                          </div>
                        </div>
                        <div className="col-xs-3 b-r box">
                          <div className="p-a block " >
                            <h6 className="text-center">Previous Payslips</h6>
                            <hr/>
                            <UserPayslipsHistory
                              user_payslip_history={this.state.user_payslip_history}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )
    }
}

function mapStateToProps( state ){
  return {
      frontend : state.frontend.toJS(),
      logged_user : state.logged_user.toJS(),
      usersList : state.usersList.toJS(),
      managePayslips : state.managePayslips.toJS()
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onIsAlreadyLogin : () => {
            return dispatch( actions_login.isAlreadyLogin(  ))
        },
        onUsersList : () => {
          return dispatch( actions_usersList.get_users_list(  ))  
        },
        onUserManagePayslipsData : ( userid ) => {
          return dispatch( actions_managePayslips.get_user_manage_payslips_data( userid ) )
        }
    }
}

const VisibleManagePayslips = connect(
  mapStateToProps,
  mapDispatchToProps
)( ManagePayslips )

const RouterVisibleManagePayslips= withRouter( VisibleManagePayslips )

export default RouterVisibleManagePayslips