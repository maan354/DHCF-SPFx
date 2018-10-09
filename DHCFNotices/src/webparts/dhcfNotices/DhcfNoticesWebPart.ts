import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DhcfNoticesWebPart.module.scss';
import * as strings from 'DhcfNoticesWebPartStrings';
import { INotice, INotices } from './Notices';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IDhcfNoticesWebPartProps {
  description: string;
}

export default class DhcfNoticesWebPart extends BaseClientSideWebPart<IDhcfNoticesWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
        <div class="${styles.dhcfNotices}">
            <div class="news-title-container">
              <span class="news-title">Important Notices</span>
              <hr class="divider-right"/>
            </div>
            
            <div id="noticesListContainer">
              </div>          
        </div>`;

      this.renderWebpartData();
  }

  private renderWebpartData() {
    this.getAnnouncements().then((response: INotices) => {
      console.log(response.value);
      this.renderHtmlFromData(response.value);
    }).catch((err) => {
      console.log('Error getting announcements : ' + err);
    });
  }

  public getAnnouncements(): Promise<INotices> {        
    return new Promise<INotices>((resolve) => {
        resolve(this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/lists/GetByTitle('Notices')/items`, SPHttpClient.configurations.v1)
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
            }
          ]
        }
      ]
    };
  }
}
