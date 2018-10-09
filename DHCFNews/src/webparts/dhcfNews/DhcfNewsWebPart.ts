import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as $ from 'jquery';
import * as strings from 'DhcfNewsWebPartStrings';

require('./News.css');

export interface IDhcfNewsWebPartProps {
  description: string;
}

export default class DhcfNewsWebPart extends BaseClientSideWebPart<IDhcfNewsWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
    <div class="news-title-container">
	    <span class="news-title-left">Announcements</span>
	    <hr class="divider"/>
    </div>
    <div id="all-news" class="row"></div> 
    `;

    var allNews = [];
    $.ajax({
        url: this.context.pageContext.web.absoluteUrl + "/_api/web/Lists/GetByTitle('Announcements')/items?"+
            "$top=5&$orderby=Announcement_x0020_Date desc" +
            "",
        type: "Get",
        async: false,
        headers: { 
            "Accept": "application/json;odata=verbose",
            "content-Type": "application/json;odata=verbose"
        }
    }).done(function(data){
           var data = data.d.results;
           $.each(data, function(i, item){
                let itemDate = new Date(item.Announcement_x0020_Date)
                allNews.push({
                 Header: item.Title,
                 Description: item.Description,
                 Date: itemDate
             });
          });
    });
    
    //allNews.sort(function(a,b) {
    //    return  new Date(b.Date) - new Date(a.Date);
    //});

    allNews = allNews.slice(0, 5);
    console.log(allNews);
    
    allNews.forEach(function(item){
      $('#all-news').append('<div class="news-item"><div class="news-date"><span class="month">' + item.Date.toLocaleDateString('en-GB', {month: "long"}) + '</span><br/><span class="day">'+ item.Date.getDate() +'</span></div><div class="news-info"><div class="news-header">' + item.Header + '</div><div class="news-desc">'+item.Description+'</div><div class="news-actions"><a href="#">Read more</a></div></div></div>');
    })

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
