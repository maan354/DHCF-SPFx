import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'DesignPackWebPartStrings';
import { SPComponentLoader } from '@microsoft/sp-loader';
import browser from 'browser-detect';
import DesignPack from './components/DesignPack';
import { IDesignPackProps } from './components/IDesignPackProps';

export interface IDesignPackWebPartProps {
  description: string;
  applycss: boolean;
  applycss2: boolean;
  applycss3: boolean;
}

require('./local.css')

export default class DesignPackWebPart extends BaseClientSideWebPart<IDesignPackWebPartProps> {

  public render(): void {

    const browser_ver = browser();
    if (browser_ver.name == 'ie') 
      window.alert("Dear user, we detected that you are running Internet Explorer browser. Unfortunatelly this browser is no longer supported by modern web pages. Please use Chrome, Firefox, Opera, EDGE or Safari.")

    if (this.properties.applycss == true) {
        SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/DHCFStyles-landing.css');
      }
    if (this.properties.applycss2 == true) {
        SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/DHCFStyles-menu.css');
    }
    if (this.properties.applycss3 == true) {
        SPComponentLoader.loadCss('https://dcgovict.sharepoint.com/sites/dhcf/cdn/DHCFStyles-footer.css');
    }

    const element: React.ReactElement<IDesignPackProps > = React.createElement(
      DesignPack,
      {
        description: this.properties.description,
        context: this.context
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
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle('applycss', {
                  label: "Apply landing page CSS",
                  offText: "CSS not applied",
                  onText: "CSS applied",
                }),
                PropertyPaneToggle('applycss2', {
                  label: "Apply top menu CSS",
                  offText: "CSS not applied",
                  onText: "CSS applied",
                }),
                PropertyPaneToggle('applycss3', {
                  label: "Apply wide page CSS",
                  offText: "CSS not applied",
                  onText: "CSS applied",
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
