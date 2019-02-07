import * as React from 'react';
import { IDHCFfooterProps } from './IDHCFfooterProps'
import { IDHCFfooterState } from './IDHCFfooterState'
import styles from '../footer.module.scss';
import {
    CommandBarButton,
    TextField,
    Panel,
    PanelType,
    PrimaryButton,
    DefaultButton,
    Rating,
    RatingSize
} from 'office-ui-fabric-react';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export default class DHCFfooter extends React.Component<IDHCFfooterProps, IDHCFfooterState> {


    constructor(props: IDHCFfooterProps) {
        super(props);

        this._onTextChange = this._onTextChange.bind(this);

        this.state = {
            editMode: true,
            showPanel: false,
            submited_data: '',
            rating: 0,
            submited: false
        };
    }

    public render(): React.ReactElement<IDHCFfooterProps> {

        const openModal = (): void => {
            this.setState({
                showPanel: true
            })
        };

        let _panel:JSX.Element
        
        console.log(this.state)

        _panel = !this.state.submited ? (
            <div>
                    <Panel
                        isOpen={this.state.showPanel}
                        type={PanelType.smallFixedFar}
                        onDismiss={this.closeModal}
                        headerText="Your feedback"
                        closeButtonAriaLabel="Close"
                        onRenderFooterContent={this._onRenderFooterContent}
                    >
                        <div className={styles.dhcf_feedback_panel}>
                            <div className={styles.this_rating}>
                                <h4> Please rate Intranet site</h4>
                                <Rating
                                    id={'RatingStar'}
                                    min={0}
                                    max={5}
                                    onChange={this._onStarChange}
                                    size={RatingSize.Large}
                                    rating={this.state.rating}                                
                                />
                            </div>
                            <div>
                                <h4> How we can improve it?</h4>
                            </div>
                            <div>
                            <TextField
                                multiline rows={8}
                                onBeforeChange={this._onTextChange}
                            />
                            </div>
                        </div>
                    </Panel>
                </div>
        )
        :
        (
            <div>
                    <Panel
                        isOpen={this.state.showPanel}
                        type={PanelType.smallFixedFar}
                        onDismiss={this.closeModal}
                        closeButtonAriaLabel="Close"
                        onRenderFooterContent={this._onRenderFooterContent}
                    >
                        <div className={styles.dhcf_feedback_panel}>
                            <span>Thank you, your feedback has been submited</span>
                        </div>
                    </Panel>
                </div>
        )

        return (
            <div className="This_footer">
                <CommandBarButton
                    data-automation-id="test2"
                    disabled={false}
                    checked={false}
                    onClick={openModal}
                    iconProps={{ iconName: 'Add' }}
                    text="Give us your feedback"
                />
                {_panel}
            </div>

        );
    }

    private submitModal = (): void => {
        let data = {
            "Text": this.state.submited_data,
            "rating": this.state.rating
        }
        let data_json = JSON.stringify(data)
        console.log(data_json)
        //this.saveFeedback(data_json);
        this.setState({
            submited: true
        })
    };

    private closeModal = (): void => {
        this.setState({
            showPanel: false
        })
    };

    private _onRenderFooterContent = (): JSX.Element => {

        let _butoons = !this.state.submited ? 
        (
            <div>
                <PrimaryButton onClick={this.submitModal} style={{ marginRight: '8px' }}>
                    Submit
                </PrimaryButton>
                <DefaultButton onClick={this.closeModal}>Cancel</DefaultButton>
            </div>
        )
        : 
        (
            <div>
                <PrimaryButton onClick={this.closeModal} style={{ marginRight: '8px' }}>
                    Close
                </PrimaryButton>
            </div>
        )

        return _butoons
    };

    private _onTextChange = (newText: string): void => {
        this.setState({ submited_data: newText });
    };

    private _onStarChange = (event: React.FocusEvent<HTMLElement>, rating?: number): void => {
        this.setState({
            rating: rating
        });
      };
    
    private saveFeedback(data) {
        console.log("going to update",data)
        this.props.context.spHttpClient.post(this.props.context.pageContext.web.serverRelativeUrl + `/_api/lists/GetByTitle('Feedback')/items`,
        SPHttpClient.configurations.v1,  
        {  
          headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': '',  
          },  
          body: data  
        }).then((response: SPHttpClientResponse): void => {  
          console.log(`Item  successfully updated`);  
        }, (error: any): void => {  
          console.log(`Error updating item: ${error}`);  
        });  
      }
}