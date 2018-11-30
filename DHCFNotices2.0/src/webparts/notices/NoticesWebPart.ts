import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';

import * as strings from 'NoticesWebPartStrings';
import Notices from './components/Notices';
import { INotice, INotices } from './Notices';
import { INoticesProps } from './components/INoticesProps';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';

require('./notices.css');

export interface INoticesWebPartProps {
  description: string;
  showAll: boolean;
  ItemsDropDown: string;
}

export interface ResponceDetails {
  Title: string;
  id: string; 
}

export interface ResponceCollection {
  value: ResponceDetails[];  
  length: Number;
}

export default class NoticesWebPart extends BaseClientSideWebPart<INoticesWebPartProps> {

  private Q_Options: IPropertyPaneDropdownOption[] = [];
  private myData = [];

  public render(): void {

    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

    if (!this.properties.showAll) {    
      this.getFields().then(responce => {
        this.Q_Options = this._getDropDownCollection(responce, 'Department', 'Department');
        this.context.propertyPane.refresh();
      })}
    
    let select;
    
    if (this.properties.showAll)
      select = null;
    else       
      select = this.properties.ItemsDropDown || null 

    this.getAnnouncements(select).then(res => {

        this.myData = res.value;
        console.log(this.myData);

    const element: React.ReactElement<INoticesProps > = React.createElement(
      Notices,
      {
        data: this.myData
      }
    );

    ReactDom.render(element, this.domElement);
    });
  }

  public getAnnouncements(select): Promise<INotices> {
    let url;
    if (select === null) {
      url = this.context.pageContext.web.absoluteUrl + `/_api/lists/GetByTitle('Notices')/items?$select=Title,Body,Department,Author/FirstName,Author/LastName,Author/Title,Created,FullBody&$expand=Author`
    }
    else {
      url = this.context.pageContext.web.absoluteUrl + `/_api/lists/GetByTitle('Notices')/items?$select=Title,Body,Department,Author/FirstName,Author/LastName,Author/Title,Created,FullBody&$expand=Author&$filter=Department eq '`+ this.properties.ItemsDropDown +`'`;
    }        
    return new Promise<INotices>((resolve) => {
        resolve(this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            }));
    });
  }

  private getFields(): Promise<any> {
    let url:string = this.context.pageContext.site.serverRelativeUrl + `/_api/web/lists/getByTitle('Notices')/items?$select=Department&$orderby=Department`;
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _getDropDownCollection(response: ResponceCollection, key: string, text: string): IPropertyPaneDropdownOption[] {
    var dropdownOptions: IPropertyPaneDropdownOption[] = [];
    for (var itemKey in response.value) {
        dropdownOptions.push({ key: response.value[itemKey][key], text: response.value[itemKey][text]});
    }
    return dropdownOptions;
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
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            },
            {
              groupName: "List settings",
              groupFields: [
                PropertyPaneToggle('showAll', {
                  label: "Show All",
                  offText: "Off",
                  onText: "On",
                }),                
                PropertyPaneDropdown('ItemsDropDown',{ 
                  label: "Select Item to display",  
                  options: this.Q_Options,  
                  disabled: this.properties.showAll,
                }),
              ]

            }
          ]
        }
      ]
    };
  }
}
