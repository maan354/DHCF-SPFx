import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import { escape } from '@microsoft/sp-lodash-subset';

import * as $ from 'jquery';
import * as strings from 'DhcfNewsWebPartStrings';

require('./News.css');
//require('./jquery.morelines.js');

export interface IDhcfNewsWebPartProps {
  description: string;
  list: string;
  showAll: boolean;
  ItemsDropDown: string;
  selected_list: string;
}

export interface ResponceDetails {
  Title: string;
  id: string; 
}

export interface ResponceCollection {
  value: ResponceDetails[];  
  length: Number;
}

export default class DhcfNewsWebPart extends BaseClientSideWebPart<IDhcfNewsWebPartProps> {

  private Q_Options: IPropertyPaneDropdownOption[] = [];

  public render(): void {

    let _URL = this.context.pageContext.web.absoluteUrl + "/_api/web/Lists(guid'" + this.properties.selected_list + "')/items?"+
  "$top=10&$orderby=Announcement_x0020_Date desc";

    if (!this.properties.showAll) {    
    this.getFields().then(responce => {
      this.Q_Options = this._getDropDownCollection(responce, 'Admin', 'Admin');
      this.context.propertyPane.refresh();
    })}
    
    if (this.properties.ItemsDropDown) {
       _URL = this.context.pageContext.web.absoluteUrl + "/_api/web/Lists(guid'" + this.properties.selected_list + "')/Items"+
       "?$select=Title,Description,Announcement_x0020_Date,Admin/Title&$expand=Admin&$filter=Admin/Title eq '"+ this.properties.ItemsDropDown +"'&$top=10&$orderby=Announcement_x0020_Date desc"
    }     

    if (this.properties.showAll) {
      _URL = this.context.pageContext.web.absoluteUrl + "/_api/web/Lists(guid'" + this.properties.selected_list + "')/items?"+"$top=10&$orderby=Announcement_x0020_Date desc";
    }
        

    this.domElement.innerHTML = `
    <div class="news-title-container">
	    <span class="news-title-left">Announcements</span>
	    <hr class="divider"/>
    </div>
    <div id="all-news" class="row"></div> 
    `;

    let allNews = [];
    $.ajax({

        url: _URL,
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
    
    if (!this.properties.selected_list) {
      $('#all-news').append(`
      <div class="SelectList" style="font-size: 18px; color: red">Select a list on property pane</div>
      `)
    }
    allNews = allNews.slice(0, 5);
    
    if (allNews.length < 1) {
      $('#all-news').append(`
      <div class="SelectList">No Announcements found on the selected list</div>
      `)
    }

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

  private getFields(): Promise<any> {
    let url:string = this.context.pageContext.site.serverRelativeUrl + `/_api/Lists(guid'` + this.properties.selected_list + `')/items?$select=Title,Admin/Title&$expand=Admin&$orderby=Title%20asc`;
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _getDropDownCollection(response: ResponceCollection, key: string, text: string): IPropertyPaneDropdownOption[] {
    var dropdownOptions: IPropertyPaneDropdownOption[] = [];
    for (var itemKey in response.value) {
        if (response.value[itemKey][text])
        dropdownOptions.push({ key: response.value[itemKey][key].Title, text: response.value[itemKey][text].Title});
    }
    console.log(dropdownOptions)
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
                }),                
                PropertyFieldListPicker('selected_list', {
                  label: 'Select a list',
                  selectedList: this.properties.selected_list,
                  includeHidden: false,
                  baseTemplate: 100,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
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
