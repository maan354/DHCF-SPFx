import * as React from 'react';
import { Modal, Button } from 'react-bootstrap'

export class NoticeModal extends React.Component<any, any> {

    constructor(props) {
        super(props);
    }

   
    render() {
        return (
            <Modal {...this.props} bsSize="large">
                <Modal.Header>
                    <Modal.Title>
                        <div className="notices-modal">
                                <h2 className="notices-modal-title"> {this.props.item.Title}</h2>                                 
                        </div>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body><div dangerouslySetInnerHTML={{ __html: this.props.item.FullBody}}/></Modal.Body>                
                <Modal.Footer>
                    <div className="notices-modal-footer">
                            <span className="notices-modal-by">Created by {this.props.item.Author.FirstName} {this.props.item.Author.LastName} on {this.props.item.Created} </span> <br/>                            
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}