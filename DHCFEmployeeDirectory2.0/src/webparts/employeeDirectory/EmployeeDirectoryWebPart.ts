import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import ReactCSSTransitionGroup from 'react-transition-group';

import { SPComponentLoader } from '@microsoft/sp-loader';
import * as strings from 'EmployeeDirectoryWebPartStrings';
import EmployeeDirectory from './components/EmployeeDirectory';
import { IEmployeeDirectoryProps } from './components/IEmployeeDirectoryProps';
import { IEmployeeDirectoryWebPartProps } from './IEmployeeDirectoryWebPartProps';
import { MSGraphClient } from '@microsoft/sp-http';

require('./employeedirectory.css');

export default class EmployeeDirectoryWebPart extends BaseClientSideWebPart<IEmployeeDirectoryWebPartProps> {

  private graphClient: MSGraphClient;
  
  public onInit(): Promise<void> {
    
    //return super.onInit();

    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient): void => {
          this.graphClient = client;
          resolve();
        }, err => reject(err));
    });

  } 

  public render(): void {

    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.3.1/css/all.css')
    if (this.properties.applycss == true) {
      SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/EmployeeDirectory.css');
      console.log("CSS applied");
    }
    else console.log ("CSS not applied");

    const element: React.ReactElement<IEmployeeDirectoryProps > = React.createElement(
            

      EmployeeDirectory,
      {
        title: this.properties.title,
        exclude: this.properties.exclude,
        sortBy: this.properties.sortBy,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        context: this.context,
        graphClient: this.graphClient,
        useGraph: this.properties.useGraph
      }
    );

    ReactDom.render(element, this.domElement);
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
              groupFields: [                
                PropertyPaneTextField('exclude', {
                  multiline: true,
                  placeholder: strings.ExcludeFieldPlaceholder,
                  label: strings.ExcludeFieldLabel,
                  rows: 8
                }),
                PropertyPaneToggle('applycss', {
                  label: "Apply page-wide CSS",
                  offText: "CSS not applied",
                  onText: "CSS applied",
                }),
                PropertyPaneDropdown('sortBy', {
                  label: strings.SortByFieldLabel,
                  options: [
                    { key: 'Title', text: 'Last Name' },
                    { key: 'FirstName', text: 'First Name' },
                    { key: 'Department', text: 'Department' },
                    { key: 'JobTitle', text: 'Job Title' },
                    { key: 'Office', text: 'Office' }
                  ]
                }),
                PropertyPaneToggle('useGraph', {
                  label: "Use Graph API?",
                  offText: "No",
                  onText: "Yes",
                }),

              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}
