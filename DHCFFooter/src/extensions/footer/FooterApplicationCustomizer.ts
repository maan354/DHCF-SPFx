import * as React from 'react';
import * as ReactDom from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'FooterApplicationCustomizerStrings';

import { IDHCFfooterProps } from './components/IDHCFfooterProps'
import DHCFfooter from './components/DHCFfooter'

require('./footer.css')

const LOG_SOURCE: string = 'FooterApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IFooterApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string; 
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class FooterApplicationCustomizer
  extends BaseApplicationCustomizer<IFooterApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {

    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      // The extension should not assume that the expected placeholder is available.
      if (!this._bottomPlaceholder) {
        console.error("The expected placeholder (Bottom) was not found.");
        return;
      }


      let bottomString = "Here I am"

      const element: React.ReactElement<IDHCFfooterProps> = React.createElement(
        DHCFfooter,
        {
          context: this.context,
        }
      );
  
      ReactDom.render(element, this._bottomPlaceholder.domElement);
    }
}

private _onDispose(): void {
  console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
}

}


