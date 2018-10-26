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
//require('./jquery.morelines.js');

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
    


    allNews = allNews.slice(0, 5);
    //console.log(allNews);
    
    allNews.forEach(function(item){
      $('#all-news').append(`

        <div class="news-item">
          <div class="news-date">
            <span class="month">` + item.Date.toLocaleDateString('en-GB', {month: "long"}) + `</span>
            <br/>
            <span class="day">`+ item.Date.getDate() +`</span>
          </div>
          <div class="news-info">
            <div class="news-header">` + item.Header + `
            </div>
            <div class="news-desc b-description_readmore js-description_readmore">`+item.Description+`
            </div>            
          </div>
        </div>
        
        `);
    });

    
    $(function(){
        $('.js-description_readmore').moreLines({      
          linecount: 3      
        });
       
      });
      (function ( $ ) {
      $.fn.moreLines = function (options) {

      
          this.each(function(){            
            var element = $(this), 
              textelement = element.find("p"),
              baseclass = "b-morelines_",
              basejsclass = "js-morelines_",
              currentclass = "section",
              singleline = parseFloat(element.css("line-height")),
              auto = 1,
              fullheight = element.innerHeight(),
              settings = $.extend({
                linecount: auto,
                baseclass: baseclass,
                basejsclass: basejsclass,
                classspecific: currentclass,
                buttontxtmore: "more lines",
                buttontxtless: "less lines",
                animationspeed: 300
              }, options ),
              
              ellipsisclass = settings.baseclass+settings.classspecific+"_ellipsis",
              buttonclass = settings.baseclass+settings.classspecific+"_button",
              wrapcss = settings.baseclass+settings.classspecific+"_wrapper",
              wrapjs = settings.basejsclass+settings.classspecific+"_wrapper",
              wrapper = $("<div>").addClass(wrapcss+ ' ' +wrapjs).css({'max-width': element.css('width')}),
              linescount = singleline * settings.linecount;
             
              
            element.wrap(wrapper);
      
            if (element.parent().not(wrapjs)) {

              if (fullheight > linescount) {
      
              element.addClass(ellipsisclass).css({'min-height': linescount, 'max-height': linescount, 'overflow': 'hidden'});
      
              var moreLinesButton = $("<div>", {
                "class": buttonclass,
                click: function() {
      
                  element.toggleClass(ellipsisclass);
                  $(this).toggleClass(buttonclass+'_active');
      
                  if (element.css('max-height') !== 'none') {
                    element.css({'height': linescount, 'max-height': ''}).animate({height:fullheight}, settings.animationspeed, function () {
                      moreLinesButton.html(settings.buttontxtless);
                    });
      
                  } else {
                    element.animate({height:linescount}, settings.animationspeed, function () {
                      moreLinesButton.html(settings.buttontxtmore);
                      element.css('max-height', linescount);
                    });
                  }
                },
      
                html: settings.buttontxtmore
              });
      
              element.after(moreLinesButton);
      
              }
            }
          });
      
          return this;
        };
      }($));
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
