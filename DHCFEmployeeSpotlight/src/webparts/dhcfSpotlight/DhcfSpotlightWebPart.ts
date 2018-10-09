import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as strings from 'DhcfSpotlightWebPartStrings';
import DhcfSpotlight from './components/DhcfSpotlight';
import { IDhcfSpotlightProps } from './components/IDhcfSpotlightProps';
import { SPComponentLoader } from '@microsoft/sp-loader';


require('./membersStyle.css');

export interface IDhcfSpotlightWebPartProps {
  description: string;
  maxitems: number;
  useProfPics: boolean;
}


export default class DhcfSpotlightWebPart extends BaseClientSideWebPart<IDhcfSpotlightWebPartProps> {

  public onInit(): Promise<void> {
    SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/DHCFStyles.css');
    return super.onInit();
  } 

  

  private myData = [];

  public render(): void {
    
    this.getListData().then(res => {

      this.myData = res.value;
      console.log(this.myData);
      const element: React.ReactElement<IDhcfSpotlightProps> = React.createElement(
        DhcfSpotlight,
        {
          data: this.myData,
          showmax: this.properties.maxitems,
          profpic: this.properties.useProfPics          
        }
      );
      ReactDom.render(element, this.domElement);
    }); 
  }

  private getListData() {
    let today = new Date();
    //let url = this.context.pageContext.web.absoluteUrl + `/intranet/_api/web/lists/getByTitle('EmployeeSpotlight')/items?$select=Title,Employee/EMail,Employee/Office,Employee/JobTitle,Employee/FirstName,Employee/LastName,order0,Description,Until&$expand=Employee&$filter=Until ge datetime ` + today.toISOString() + `&$orderby=order0 asc`;
    let url = this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('Spotlight')/items?$select=FileRef,Employee/EMail,Employee/Office,Employee/JobTitle,Employee/FirstName,Employee/LastName,order0,Description0,until0&$expand=Employee&$orderby=order0 asc &$filter=until0 ge datetime'`  + today.toISOString() + `'`;
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {     
      return response.json();
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: "DHCF Employee Spotlight Web Part is designed to desplay users with short description on modern pages."
          },
          groups: [
            {
              groupName: "Main settings",
              groupFields: [
                
                PropertyPaneSlider('maxitems', {
                  label: 'Max Items',
                  min: 1,
                  max: 4,
                  value: 3,
                  step: 1,
                  showValue: true
                }),
                PropertyPaneToggle('useProfPics', {
                  label: 'Use Profile Pictures?'
                }),                
              ]              
            },
            {
              groupName: "List settings",
              groupFields: [
                PropertyPaneToggle('defaultList', {
                  label: 'Use default list?',
                  disabled: true
                })
              ]

            }

          ]
        }
      ]
    };
  }
}
