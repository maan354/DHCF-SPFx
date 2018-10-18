import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
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
}

export default class DhcFfaqWebPart extends BaseClientSideWebPart<IDhcFfaqWebPartProps> {

  public render(): void {

    SPComponentLoader.loadCss('https://use.fontawesome.com/releases/v5.3.1/css/all.css')
    if (this.properties.applycss == true) {
      SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/FAQ.css');
      console.log("CSS applied");
    }
    else console.log ("CSS not applied");

    const element: React.ReactElement<IDhcFfaqProps > = React.createElement(
      DhcFfaq,
      {
        description: this.properties.description,
        context: this.context
      }
    );

    
    console.log(this.properties.query);

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
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle('applycss', {
                  label: "Apply page-wide CSS",
                  offText: "CSS not applied",
                  onText: "CSS applied",
                }),
                PropertyFieldSPListQuery('query', {
                  label: '',
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
