import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle,
  PopupWindowPosition
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import * as strings from 'DhcfDesignPackWebPartStrings';
import { SPComponentLoader } from '@microsoft/sp-loader';
import browser from 'browser-detect';

export interface IDhcfDesignPackWebPartProps {
  description: string;
  applycss: boolean;
  applycss2: boolean;
  applycss3: boolean;
}

export default class DhcfDesignPackWebPart extends BaseClientSideWebPart<IDhcfDesignPackWebPartProps> {

  public onInit(): Promise<void> {
     return super.onInit();
   } 

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


    this.domElement.innerHTML = `
      <div class="DHCF-Design">
        <span> Designed by Alexander Kitaev for DHCF</span>
      </div>`;
      
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
                  label: "Apply footer CSS",
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
