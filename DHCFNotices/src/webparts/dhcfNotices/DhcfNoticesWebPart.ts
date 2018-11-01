import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DhcfNoticesWebPart.module.scss';
import * as strings from 'DhcfNoticesWebPartStrings';
import { INotice, INotices } from './Notices';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IDhcfNoticesWebPartProps {
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

export default class DhcfNoticesWebPart extends BaseClientSideWebPart<IDhcfNoticesWebPartProps> {

  private Q_Options: IPropertyPaneDropdownOption[] = [];

  public render(): void {

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

    this.domElement.innerHTML = `
        <div class="${styles.dhcfNotices}">
            <div class="news-title-container">
              <span class="news-title">Important Notices</span>
              <hr class="divider-right"/>
            </div>
            
            <div id="noticesListContainer">
              </div>          
        </div>`;

      this.renderWebpartData(select);
  }

  private renderWebpartData(select) {
    this.getAnnouncements(select).then((response: INotices) => {
      console.log(response.value);
      this.renderHtmlFromData(response.value);
    }).catch((err) => {
      console.log('Error getting announcements : ' + err);
    });
  }

  public getAnnouncements(select): Promise<INotices> {
    let url;
    if (select === null) {
      url = this.context.pageContext.web.absoluteUrl + `/_api/lists/GetByTitle('Notices')/items?$select=Title,Body,Department`
    }
    else {
      url = this.context.pageContext.web.absoluteUrl + `/_api/lists/GetByTitle('Notices')/items?$select=Title,Body,Department&$filter=Department eq '`+ this.properties.ItemsDropDown +`'`;
    }        
    return new Promise<INotices>((resolve) => {
        resolve(this.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse) => {
                return response.json();
            }));
    });
  }

  private renderHtmlFromData(announcements: INotice[]): void {
    let html: string = '';    
    let announcementLogo: string = '';
    announcements.forEach((item: INotice) => {
      console.log(item.Department);
      if (item.Department === "IT") announcementLogo = String(require('./images/IT.jpg'));
      else announcementLogo = String(require('./images/Announcement.png'));
      html += `      
        <ul class="${styles.announcementsList}">
            <li>    
              <div class="${styles.announcementIcon}">
                <img src="${announcementLogo}" />
              </div>        
                <div class="${styles.txt}">
									<h4 class="ItemTitle">${item.Title}</h4>
									<p>${item.Body}</p>
								</div>            
            </li>
        </ul>`;
    });
    const listContainer: Element = this.domElement.querySelector('#noticesListContainer');
    listContainer.innerHTML = html;
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
