import React from 'react';
import { connect } from 'react-redux'
import { Router, browserHistory, Link, withRouter } from 'react-router'
import * as actions_login from '../../actions/login/index'
import * as _ from 'lodash'
import {notify} from '../../services/index'
import { CONFIG } from '../../config/index'


import LoadingIcon from '../../components/generic/LoadingIcon'

class ForgotPassword extends React.Component {
    constructor( props ){
        super( props );
        this.props.onIsAlreadyLogin()
        this.state = {
            form_username : '',
        }
        this.doResetPassword = this.doResetPassword.bind(this)
    }
    componentWillReceiveProps( props ){
        let logged_user = props.logged_user

        if( typeof logged_user.logged_in != 'undefined' && logged_user.logged_in == 1 ){
            if( props.logged_user.role == CONFIG.ADMIN || props.logged_user.role == CONFIG.GUEST ){
                this.props.router.push('/home');
            }else{
                this.props.router.push('/monthly_attendance');
            }
        }else{
            this.setState({
                form_login_status : props.logged_user.login_status_message
            })
            if( props.logged_user.login_status_message != ''){
                notify( props.logged_user.login_status_message );    
            }
        }
    }
    doResetPassword( evt ){
        evt.preventDefault();

        if( this.state.form_username == '' ){
            alert('Enter username!!')
        }else{
            this.props.onForgotPassword( this.state.form_username ).then( 
            (data) => {
                notify( data );
            },(error) => {
                notify( error );
            })
        }
    }
    render(){

        let link_login = <Link to='/'>Login</Link>

        let styles = _.cloneDeep(this.constructor.styles);
        return(



  <div className="center-block w-xxl w-auto-xs p-y-md">

  

    <div className="navbar">

      <div className="pull-center">
        
        <a className="navbar-brand">
            <span className="hidden-folded inline">HR</span>
        </a>


      </div>
    </div>

    <div className="p-a-md box-color r box-shadow-z1 text-color m-a">
    <LoadingIcon {...this.props}/>
    <br/>
      <div className="m-b text-sm">
        Reset Your Password
      </div>
      <form name="form"  onSubmit={this.doResetPassword}>
        <div className="md-form-group float-label">
            <input 
                className="md-input"  
                required type="text" 
                ref="username" 
                onChange={ () => this.setState({ form_username : this.refs.username.value }) } 
                value={ this.state.form_username }/>
            <label>Enter Username</label>

        </div>
        <button type="submit" className="btn primary btn-block p-x-md">Reset Password</button>
      </form>
      <div className="m-b text-sm text-center">
        <br/>
        <button className="md-btn md-flat text-accent"  >{link_login}</button>
      </div>
    </div>
  </div>





        )
    }
}

// inline css
ForgotPassword.styles = {
  username: {
    background : "rgb(62, 168, 245)",
    color : "white",
  },
  password: {
    background : "rgb(62, 168, 245)",
    color : "white",
  }
};



function mapStateToProps( state ){
    return {
        frontend : state.frontend.toJS(),
        logged_user : state.logged_user.toJS()
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        onLogin : ( username, password ) => {
            return dispatch( actions_login.login( username, password ))
        },
        onIsAlreadyLogin : () => {
            return dispatch( actions_login.isAlreadyLogin(  ))
        },
        onForgotPassword : ( username ) => {
            return dispatch( actions_login.forgotPassword( username ))  
        }
    }
}

const VisibleForgotPassword = connect(
  mapStateToProps,
  mapDispatchToProps
)( ForgotPassword )

const RouterVisibleForgotPassword = withRouter( VisibleForgotPassword )

export default RouterVisibleForgotPassword