import * as React from 'react';
//import styles from './DhcfSpotlight.module.scss';
import { IDhcfSpotlightProps } from './IDhcfSpotlightProps';
import { PersonaModal } from './Modal'
import { escape } from '@microsoft/sp-lodash-subset';
import { Modal, Button } from 'react-bootstrap'


export default class DhcfSpotlight extends React.Component<IDhcfSpotlightProps, any> {

  constructor(props) {
    super(props);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false,
      currentItem: this.props.data[1]
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow(item,ProfPic) {
    this.setState({ show: true });
    this.setState({ currentItem: item});
    this.setState({ ProfPic: ProfPic})
  }

  public render(): React.ReactElement<IDhcfSpotlightProps> {
    return (
      <div>
        <div className="news-title-container">
          <span className="news-title">Employee Spotlight</span>
          <hr className="divider-right" />
        </div>
        {this.props.data.map((item, index) => {
          console.log(item, index);
          if (index < this.props.showmax)
            return React.createElement(render_person, { item: item, ProfPic: this.props.profpic, handleShow: this.handleShow  } as any);
        })}
        <PersonaModal show={this.state.show} onHide={this.handleClose} item={this.state.currentItem} ProfPic={this.state.ProfPic}/>
      </div>

      

    );
  }
}

function render_person(props) {
  return (
  <div id='Project_Properties_body'>
  <div className="project-members-block">
    <div className="project-members-row" onClick={(e) => props.handleShow(props.item,props.ProfPic)}>
      <div className="project-members-left-cell">
        {(() => {
          if (props.ProfPic) {
            return (<img className="profile-picture" src= {"https://dcgovict.sharepoint.com/sites/dhcf/_layouts/15/userphoto.aspx?size=L&accountname=" + props.item.Employee.EMail}/>)
          }
          else {
            return (<img className="profile-picture" src= {"https://dcgovict.sharepoint.com/" + props.item.FileRef}/>)
          }
        })()}
          
        
      </div>
      <div className="project-members-right-cell">
        <span className="person-name"> {props.item.Employee.FirstName} {props.item.Employee.LastName} </span>
        <br/>
        <span className="person-title"> {props.item.Employee.JobTitle} </span>
        <br/>
        <span className="person-description"> {props.item.Description0}  </span>
      </div>
    </div>
  </div>
</div>)
} 
