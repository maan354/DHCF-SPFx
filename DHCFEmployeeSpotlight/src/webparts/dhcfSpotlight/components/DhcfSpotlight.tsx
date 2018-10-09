import * as React from 'react';
//import styles from './DhcfSpotlight.module.scss';
import { IDhcfSpotlightProps } from './IDhcfSpotlightProps';
import { escape } from '@microsoft/sp-lodash-subset';



export default class DhcfSpotlight extends React.Component<IDhcfSpotlightProps, {}> {
  public render(): React.ReactElement<IDhcfSpotlightProps> {
    return (
      <div>
        <div className="news-title-container">
            <span className="news-title">Employee Spotlight</span>
            <hr className="divider-right"/>
        </div>            
        {this.props.data.map((item, index) => {
          console.log(item, index);
          if (index < this.props.showmax)
            return React.createElement(render_person, {Employee: item.Employee, Description: item.Description0, ProfPic: this.props.profpic, PicUrl: item.FileRef} as any);
        })}


      </div>
    );
  }
}

function render_person(props) {
  return (
  <div id='Project_Properties_body'>
  <div className="project-members-block">
    <div className="project-members-row">
      <div className="project-members-left-cell">
        {(() => {
          if (props.ProfPic) {
            return (<img className="profile-picture" src= {"https://dcgovict.sharepoint.com/sites/dhcf/_layouts/15/userphoto.aspx?size=L&accountname=" + props.Employee.EMail}/>)
          }
          else {
            return (<img className="profile-picture" src= {"https://dcgovict.sharepoint.com/" + props.PicUrl}/>)
          }
        })()}
          
        
      </div>
      <div className="project-members-right-cell">
        <span className="person-name"> {props.Employee.FirstName} {props.Employee.LastName} </span>
        <br/>
        <span className="person-title"> {props.Employee.JobTitle} </span>
        <br/>
        <span className="person-description"> {props.Description}  </span>
      </div>
    </div>
  </div>
</div>)
} 
