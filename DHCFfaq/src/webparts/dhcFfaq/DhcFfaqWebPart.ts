import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';

import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PropertyFieldSPListQuery, PropertyFieldSPListQueryOrderBy } from 'sp-client-custom-fields/lib/PropertyFieldSPListQuery';
import * as strings from 'DhcFfaqWebPartStrings';
import DhcFfaq from './components/DhcFfaq';
import { IDhcFfaqProps } from './components/IDhcFfaqProps';
import { SPComponentLoader } from '@microsoft/sp-loader';

require('./faq.css');

export interface IDhcFfaqWebPartProps {
  description: string;
  applycss: boolean;
  query: string;
  featured: boolean;
  adjust: boolean;
}

export interface ResponceDetails {
  Title: string;
  id: string;
}

export interface ResponceCollection {
  value: ResponceDetails[];  
  length: Number;
}

export default class DhcFfaqWebPart extends BaseClientSideWebPart<IDhcFfaqWebPartProps> {

  private Q_Options: IPropertyPaneDropdownOption[] = [];

  public render(): void {

    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.3.1/css/all.css')
    if (this.properties.applycss == true) {
      SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/FAQ.css');
      console.log("CSS applied");
    }
    else console.log ("CSS not applied");

    if (this.properties.featured) {
      this.getFAQs().then(responce => {
        this.Q_Options = this._getDropDownCollection(responce, 'Title_x0020__x0028_Question_x002', 'Title_x0020__x0028_Question_x002');
        this.context.propertyPane.refresh();
      })
    }

    const element: React.ReactElement<IDhcFfaqProps > = React.createElement(
      DhcFfaq,
      {
        allProps: this.properties,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private getFAQs(): Promise<any> {
    let url:string = this.context.pageContext.site.serverRelativeUrl + `/_api/lists/GetByTitle('FAQ')/items?$select=Title_x0020__x0028_Question_x002&$orderby=Title_x0020__x0028_Question_x002 asc`;
    return this.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse) => {
      return response.json();
    });
  }

  private _getDropDownCollection(response: ResponceCollection, key: string, text: string): IPropertyPaneDropdownOption[] {
    var dropdownOptions: IPropertyPaneDropdownOption[] = [];
    for (var itemKey in response.value) {
        dropdownOptions.push({ key: response.value[itemKey][key], text: response.value[itemKey][text] });
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
                }),
                PropertyPaneToggle('applycss', {
                  label: "Apply CSS",
                  offText: "Off",
                  onText: "On",
                }),
                PropertyPaneToggle('featured', {
                  label: "Featured FAQs",
                  offText: "All FAQs",
                  onText: "Featured FAQs",
                }),
                PropertyPaneDropdown('ItemsDropDown1',{ 
                  disabled: !this.properties.featured, 
                  label: "Select Item to display",  
                  options: this.Q_Options,  
                }),
                PropertyPaneDropdown('ItemsDropDown2',{ 
                  disabled: !this.properties.featured, 
                  label: "Select Item to display",  
                  options: this.Q_Options,  
                }),
                PropertyPaneDropdown('ItemsDropDown3',{ 
                  disabled: !this.properties.featured, 
                  label: "Select Item to display",  
                  options: this.Q_Options,  
                }),
                PropertyPaneToggle('adjust', {
                  label: "Title direction",
                  offText: "Left",
                  onText: "Right",
                }),
                PropertyFieldSPListQuery('query', {
                  label: '',
                  disabled: true, 
                  query: this.properties.query,
                  includeHidden: false,
                  baseTemplate: 100,
                  orderBy: PropertyFieldSPListQueryOrderBy.Title,
                  showOrderBy: false,
                  showMax: false,
                  showFilters: false,
                  max: 20,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  context: this.context,
                  properties: this.properties,
                  key: 'sliderGalleryQueryField'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
