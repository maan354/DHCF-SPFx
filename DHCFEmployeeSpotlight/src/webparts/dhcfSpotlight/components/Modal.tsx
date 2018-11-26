import * as React from 'react';
import { Modal, Button } from 'react-bootstrap'

export class PersonaModal extends React.Component<any, any> {

    constructor(props) {
        super(props);
    }

   
    render() {
        console.log(this.props)
        return (
            <Modal {...this.props} bsSize="small">
                <Modal.Header>
                    <Modal.Title>
                        <div className="project-members-row">
                            <div className="project-members-left-cell-m">
                                
                                {(() => {
                                    if (this.props.ProfPic) {
                                        return (<img className="profile-modal-picture" src={"https://dcgovict.sharepoint.com/sites/dhcf/_layouts/15/userphoto.aspx?size=L&accountname=" + this.props.item.Employee.EMail} />)
                                    }
                                    else {
                                        return (<img className="profile-modal-picture" src={"https://dcgovict.sharepoint.com/" + this.props.item.FileRef} />)
                                    }
                                })()}
                            </div>
                            <div className="project-members-right-cell-m">
                                <span className="person-modal-name"> {this.props.item.Employee.FirstName} {this.props.item.Employee.LastName} </span> <br/>
                                <span className="person-modal-title"> {this.props.item.Employee.JobTitle} </span>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body><div dangerouslySetInnerHTML={{ __html: this.props.item.FullDescription}}/></Modal.Body>

            </Modal>
        )
    }
}