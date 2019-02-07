import * as React from 'react';
import styles from './DesignPack.module.scss';
import { IDesignPackProps } from './IDesignPackProps';
import { IDesignPackState } from './IDesignPackState';
import { escape } from '@microsoft/sp-lodash-subset';
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

const feedback_listname: string = "'Feedback'";

export default class DesignPack extends React.Component<IDesignPackProps, IDesignPackState> {


  constructor(props: IDesignPackProps) {
      super(props);

      this._onTextChange = this._onTextChange.bind(this);
      this._validate = this._validate.bind(this);

      this.state = {
          editMode: true,
          showPanel: false,
          submited_data: '',
          rating: 0,
          submited: false,
          valid: true
      };
  }

  public render(): React.ReactElement<IDesignPackProps> {

      const openModal = (): void => {
          this.setState({
              showPanel: true
          })
      };

      let _panel:JSX.Element

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
                                  onChanged={this._onStarChange}
                                  size={RatingSize.Large}
                                  rating={this.state.rating}                                
                              />
                          </div>
                          <div>
                              <h4> How we can improve it?</h4>
                          </div>
                          <div>
                          <TextField
                              multiline rows={14}
                              onBeforeChange={this._onTextChange}
                              onGetErrorMessage={this._validate}
                              validateOnLoad={false}
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
          <div>          
          <div className="This_footer">
              <div className="FeedButton">
              <CommandBarButton
                  data-automation-id="test2"                    
                  checked={false}
                  onClick={openModal}
                  iconProps={{ iconName: 'Lightbulb' }}
                  text="Give us your feedback"
                  className="F_ckButton"
              />
              </div>
              {_panel}              
          </div>
          <div className="DHCF-Design">
            <span> Designed by Alexander Kitaev for DHCF</span>
          </div>
          </div>
      );
  }

  private submitModal = (): void => {
      let data = {
          "Text": this.state.submited_data,
          "rating": this.state.rating
      }
      let data_json = JSON.stringify(data)
      this.saveFeedback(data_json);
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
              <PrimaryButton 
                  onClick={this.submitModal} 
                  style={{ marginRight: '8px' }}
                  disabled={!this.state.valid}>
                      Submit
              </PrimaryButton>
              <DefaultButton 
                  onClick={this.closeModal}>
                      Cancel
              </DefaultButton>
          </div>
      )
      : 
      (
          <div>
              <PrimaryButton 
                  onClick={this.closeModal} 
                  style={{ marginRight: '8px' }}>
                      Close
              </PrimaryButton>
          </div>
      )

      return _butoons
  };

  private _onTextChange = (newText: string): void => {
      this.setState({ submited_data: newText });
  };

  private _onStarChange = (rating?: number): void => {
      this.setState({
          rating: rating
      });
    };
  
  private _validate(value: string): string {
      if (value.length > 1000) {
          this.setState({
              valid: false
          });
          return `Please limit your feedback to 1000 characters, actual is ${value.length} characters.`;
      }
      else {
          this.setState({
              valid: true
          });
          return '';
      }        
  }


  private saveFeedback(data) {
      console.log("going to update",data)
      this.props.context.spHttpClient.post(this.props.context.pageContext.web.serverRelativeUrl + `/_api/lists/GetByTitle(${feedback_listname})/items`,
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
