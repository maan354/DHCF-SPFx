import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GraphCalendarWebPartStrings';
import GraphCalendar from './components/GraphCalendar';
import { IGraphCalendarProps } from './components/IGraphCalendarProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IGraphCalendarWebPartProps {
  description: string;
}

export default class GraphCalendarWebPart extends BaseClientSideWebPart<IGraphCalendarWebPartProps> {

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
    this.getGraphUsers();
    const element: React.ReactElement<IGraphCalendarProps > = React.createElement(
      GraphCalendar,
      {
        description: this.properties.description
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

  private getGraphUsers(): Promise<any> {
    if (!this.graphClient) {
      return;
    }

    this.graphClient
    //  .api("users")
    //  .version("v1.0")
    .api("users/DHCFCapital9thOCFO938@dc.gov/calendarview?startdatetime=2019-1-28T04:00:00.000Z&enddatetime=2019-1-29T03:59:59.000Z")
    .version("beta")   
      .get((err: any, res: any): void => {
        if (err) {
          // Something failed calling the MS Graph          
          console.log("error: ", err.message);                      
          return;
        }

        // Check if a response was retrieved
        if (res && res.value && res.value.length > 0) {
          console.log(res);
        }
        else {
          // No messages found
          console.log("Nada!")
        }
      });

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
            }
          ]
        }
      ]
    };
  }
}
