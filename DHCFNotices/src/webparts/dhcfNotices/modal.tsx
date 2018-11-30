import * as React from 'react';
import { Modal, Button } from 'react-bootstrap'

export class NoticeModal extends React.Component<any, any> {

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
                            <div className="project-members-right-cell-m">
                                <span className="person-modal-name"> {this.props.item} </span> <br/>
                                <span className="person-modal-title"> </span>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body><div dangerouslySetInnerHTML={{ __html: this.props.item}}/></Modal.Body>

            </Modal>
        )
    }
}