import * as React from 'react';
import styles from './Notices.module.scss';
import { INoticesProps } from './INoticesProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { NoticeModal } from './Modal'

export default class Notices extends React.Component<INoticesProps, any> {

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

  handleShow(item) {
    this.setState({ show: true });
    this.setState({ currentItem: item});
  }

  public render(): React.ReactElement<INoticesProps> {
    let announcementLogo: string = '';
    return (
      <div className={styles.dhcfNotices}>
            <div className="news-title-container">
              <span className="news-title">Important Notices</span>
              <hr className="divider-right" />
            </div>
            {this.props.data.map((item, index) => {
              switch (item.Department) {
                case 'IT':
                  announcementLogo = String(require('../images/IT.jpg'));
                  break; 
                case 'Support Services':    
                  announcementLogo = String(require('../images/SS.png'));
                  break;             
                default:
                  announcementLogo = String(require('../images/Announcement.png'));
                  break;
              }
              
            //  console.log(item, index);
              if (index < this.props.showmax)              
                return React.createElement(render_notice, { item: item, pic: announcementLogo, handleShow: this.handleShow   } as any);
              })
            }
            <NoticeModal show={this.state.show} onHide={this.handleClose} item={this.state.currentItem}/>                  
      </div>
    );
  }
}

function render_notice(props) {
  return (
    <ul className={styles.announcementsList}>
            <li onClick={(e) => props.handleShow(props.item)}>    
              <div className={styles.announcementIcon}>
                <img src={props.pic} />
              </div>        
                <div className={styles.txt}>
									<h4 className="ItemTitle">{props.item.Title}</h4>
									<p>{props.item.Body}</p>
								</div>            
            </li>
        </ul>
  )
}