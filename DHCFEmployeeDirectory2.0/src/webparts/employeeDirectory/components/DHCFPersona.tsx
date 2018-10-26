import * as React from 'react';
import styles from './EmployeeDirectory.module.scss';
import {CSSTransitionGroup, TransitionGroup} from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMobile, faPhone, faUsers, faCoffee, faEnvelope } from '@fortawesome/free-solid-svg-icons'


export class DHCFPersona extends React.Component<{userPhoto: string, userName: string, userTitle: string, userDept: string, userWorkPhone: string, userMobilePhone: string, userDepartment: string, userEmail: string },any> {

    constructor(props) {
        super(props);
        this.state = { showDetails: false }
        this.DisplayDetails = this.DisplayDetails.bind(this);
    }
    
    private DisplayDetails() {
        this.setState(state => ({ showDetails: !state.showDetails }));     
    }

    render() {


      
      return (

        <CSSTransitionGroup
        transitionName="persona"
        transitionAppear={true}
        transitionAppearTimeout={500}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
        transitionEnter={true}
        transitionLeave={true}> 
  
        <div className= {"DHCFpersona " + (this.state.showDetails ? 'Expanded' : 'NotExpanded')} 
            onClick={this.DisplayDetails}>      
          <div className={"Userphoto "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>
            <img className={"UserIMG "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')} 
              src={this.props.userPhoto}/>
          </div>
          <div className={"UserName "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>
            {this.props.userName}      
          </div>
          <div className={"UserTitle "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>   
            {this.props.userTitle}   
          </div>
          <div className={"UserDept "  + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}>
            {this.props.userDept}    
          </div>
          
           
              <div className={"UserDetails " + (this.state.showDetails ? 'Expanded' : 'NotExpanded')}> 
              <div className="personadata"><FontAwesomeIcon icon={faPhone} /><span className="userData"> {this.props.userWorkPhone ? this.props.userWorkPhone : " --- "}</span></div>
              <div className="personadata"><FontAwesomeIcon icon={faMobile} /><span  className="userData"> {this.props.userMobilePhone ? this.props.userMobilePhone : " --- "}</span></div>
              <div className="personadata"><FontAwesomeIcon icon={faUsers} /><span  className="userData"> {this.props.userDepartment ? this.props.userDepartment : " --- "}</span></div>
              <div className="personadata"><FontAwesomeIcon icon={faEnvelope} /> <span className="userData"> {this.props.userEmail ? this.props.userEmail : " --- "}</span></div>
               </div>
        </div>
        </CSSTransitionGroup>

        )
      ;}
    }