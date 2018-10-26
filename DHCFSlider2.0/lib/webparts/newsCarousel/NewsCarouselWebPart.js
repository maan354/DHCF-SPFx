"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file
 * News Carousel Web Part for SharePoint Framework SPFx
 *
 * Author: Olivier Carpentier
 * Copyright (c) 2016
 */
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var strings = require("NewsCarouselStrings");
//Imports property pane custom fields
var PropertyFieldCustomList_1 = require("sp-client-custom-fields/lib/PropertyFieldCustomList");
var PropertyFieldColorPickerMini_1 = require("sp-client-custom-fields/lib/PropertyFieldColorPickerMini");
var PropertyFieldFontPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontPicker");
var PropertyFieldFontSizePicker_1 = require("sp-client-custom-fields/lib/PropertyFieldFontSizePicker");
var PropertyFieldAlignPicker_1 = require("sp-client-custom-fields/lib/PropertyFieldAlignPicker");
//Loads external JS libs
var $ = require("jquery");
require('unitegallery');
require('ug-theme-slider');
//Loads external CSS files
require('../../css/unitegallery/unite-gallery.scss');
var NewsCarouselWebPart = (function (_super) {
    __extends(NewsCarouselWebPart, _super);
    /**
     * @function
     * Web part contructor.
     */
    function NewsCarouselWebPart(context) {
        var _this = _super.call(this) || this;
        _this.guid = _this.getGuid();
        _this.onPropertyPaneFieldChanged = _this.onPropertyPaneFieldChanged.bind(_this);
        return _this;
    }
    Object.defineProperty(NewsCarouselWebPart.prototype, "dataVersion", {
        /**
         * @function
         * Gets WP data version
         */
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @function
     * Renders HTML code
     */
    NewsCarouselWebPart.prototype.render = function () {
        if (this.properties.items == null || this.properties.items.length == 0) {
            //Display select a list message
            this.domElement.innerHTML = "\n        <div class=\"ms-MessageBar\">\n          <div class=\"ms-MessageBar-content\">\n            <div class=\"ms-MessageBar-icon\">\n              <i class=\"ms-Icon ms-Icon--Info\"></i>\n            </div>\n            <div class=\"ms-MessageBar-text\">\n              " + strings.ErrorSelectList + "\n            </div>\n          </div>\n        </div>\n      ";
            return;
        }
        var outputHtml = '';
        outputHtml += "\n              <div id=\"" + this.guid + "-gallery\" style=\"display:none;\">\n    ";
        for (var i = 0; i < this.properties.items.length; i++) {
            var newsItem = this.properties.items[i];
            var newsTitle = newsItem['Title'];
            var newsDesc = newsItem['Description'];
            var newsEnable = newsItem['Enable'];
            var newsPicUrl = newsItem['Picture'];
            var newsLink = newsItem['Link Url'];
            if (newsEnable == "false")
                continue;
            //Render the item
            outputHtml += "\n        <a href=\"" + newsLink + "\"><img alt=\"" + newsTitle + "\" src=\"" + newsPicUrl + "\"\n         data-image=\"" + newsPicUrl + "\"\n         data-description=\"" + newsDesc + "\"></a>\n      ";
        }
        outputHtml += '</div>';
        this.domElement.innerHTML = outputHtml;
        this.renderContents();
    };
    NewsCarouselWebPart.prototype.renderContents = function () {
        try {
            $("#" + this.guid + "-gallery").unitegallery({
                gallery_theme: "slider",
                slider_enable_arrows: this.properties.enableArrows,
                slider_enable_bullets: this.properties.enableBullets,
                slider_transition: this.properties.transition,
                gallery_preserve_ratio: this.properties.preserveRatio,
                gallery_autoplay: this.properties.autoplay,
                gallery_play_interval: this.properties.speed,
                gallery_pause_on_mouseover: this.properties.pauseOnMouseover,
                gallery_carousel: this.properties.carousel,
                gallery_mousewheel_role: "none",
                slider_enable_progress_indicator: this.properties.enableProgressIndicator,
                slider_enable_play_button: this.properties.enablePlayButton,
                slider_enable_fullscreen_button: this.properties.enableFullscreenButton,
                slider_enable_zoom_panel: this.properties.enableZoomPanel,
                slider_controls_always_on: this.properties.controlsAlwaysOn,
                slider_enable_text_panel: this.properties.textPanelEnable,
                slider_textpanel_always_on: this.properties.textPanelAlwaysOnTop,
                slider_textpanel_bg_color: this.properties.textPanelBackgroundColor,
                slider_textpanel_bg_opacity: this.properties.textPanelOpacity,
                slider_textpanel_title_color: this.properties.textPanelFontColor,
                slider_textpanel_title_font_family: this.properties.textPanelFont,
                slider_textpanel_title_text_align: this.properties.textPanelAlign,
                slider_textpanel_title_font_size: this.properties.textPanelFontSize != null ? this.properties.textPanelFontSize.replace("px", "") : ''
            });
        }
        finally {
        }
    };
    /**
    * @function
    * Generates a GUID
    */
    NewsCarouselWebPart.prototype.getGuid = function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    };
    /**
     * @function
     * Generates a GUID part
     */
    NewsCarouselWebPart.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    /**
     * @function
     * PropertyPanel settings definition
     */
    NewsCarouselWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPageGeneral
                    },
                    displayGroupsAsAccordion: true,
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldCustomList_1.PropertyFieldCustomList('items', {
                                    label: strings.Items,
                                    value: this.properties.items,
                                    headerText: strings.ManageItems,
                                    fields: [
                                        { id: 'Title', title: 'Title', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Enable', title: 'Enable', required: true, type: PropertyFieldCustomList_1.CustomListFieldType.boolean },
                                        { id: 'Description', title: 'Description', required: false, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.string },
                                        { id: 'Picture', title: 'Picture', required: true, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.picture },
                                        { id: 'Link Url', title: 'Link Url', required: true, hidden: true, type: PropertyFieldCustomList_1.CustomListFieldType.string }
                                    ],
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    context: this.context,
                                    properties: this.properties,
                                    key: 'newsCarouselListField'
                                })
                            ]
                        },
                        {
                            groupName: strings.GeneralGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('enableArrows', {
                                    label: strings.EnableArrows
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableBullets', {
                                    label: strings.EnableBullets
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableProgressIndicator', {
                                    label: strings.EnableProgressIndicator
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enablePlayButton', {
                                    label: strings.EnablePlayButton
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableFullscreenButton', {
                                    label: strings.EnableFullscreenButton
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('enableZoomPanel', {
                                    label: strings.EnableZoomPanel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('controlsAlwaysOn', {
                                    label: strings.ControlsAlwaysOn
                                })
                            ]
                        },
                        {
                            groupName: strings.EffectsGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneDropdown('transition', {
                                    label: strings.Transition,
                                    options: [
                                        { key: 'slide', text: 'Slide' },
                                        { key: 'fade', text: 'Fade' }
                                    ]
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('preserveRatio', {
                                    label: strings.PreserveRatio
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('pauseOnMouseover', {
                                    label: strings.PauseOnMouseover
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('carousel', {
                                    label: strings.Carousel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('autoplay', {
                                    label: strings.Autoplay
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('speed', {
                                    label: strings.Speed,
                                    min: 0,
                                    max: 7000,
                                    step: 100
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: strings.PropertyPageTextPanel
                    },
                    groups: [
                        {
                            groupName: strings.TextPanelGroupName,
                            groupFields: [
                                sp_webpart_base_1.PropertyPaneToggle('textPanelEnable', {
                                    label: strings.TextPanelEnableFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneToggle('textPanelAlwaysOnTop', {
                                    label: strings.TextPanelAlwaysOnTopFieldLabel
                                }),
                                sp_webpart_base_1.PropertyPaneSlider('textPanelOpacity', {
                                    label: strings.TextPanelOpacityFieldLabel,
                                    min: 0,
                                    max: 1,
                                    step: 0.1
                                }),
                                PropertyFieldAlignPicker_1.PropertyFieldAlignPicker('textPanelAlign', {
                                    label: strings.TextPanelAlignFieldLabel,
                                    initialValue: this.properties.textPanelAlign,
                                    onPropertyChanged: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsCarouselAlignField'
                                }),
                                PropertyFieldFontPicker_1.PropertyFieldFontPicker('textPanelFont', {
                                    label: strings.TextPanelFontFieldLabel,
                                    initialValue: this.properties.textPanelFont,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsCarouselFontField'
                                }),
                                PropertyFieldFontSizePicker_1.PropertyFieldFontSizePicker('textPanelFontSize', {
                                    label: strings.TextPanelFontSizeFieldLabel,
                                    initialValue: this.properties.textPanelFontSize,
                                    usePixels: true,
                                    preview: true,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsCarouselFontSizeField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelFontColor', {
                                    label: strings.TextPanelFontColorFieldLabel,
                                    initialColor: this.properties.textPanelFontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsCarouselFontColorField'
                                }),
                                PropertyFieldColorPickerMini_1.PropertyFieldColorPickerMini('textPanelBackgroundColor', {
                                    label: strings.TextPanelBackgroundColorFieldLabel,
                                    initialColor: this.properties.textPanelBackgroundColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    render: this.render.bind(this),
                                    disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                                    properties: this.properties,
                                    key: 'newsCarouselBgColorField'
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return NewsCarouselWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = NewsCarouselWebPart;

//# sourceMappingURL=NewsCarouselWebPart.js.map
