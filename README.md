
[![Total Installs](https://img.shields.io/vscode-marketplace/d/mondersky.tabscolor)](https://marketplace.visualstudio.com/items?itemName=mondersky.tabscolor)
> This extension isn't supported on Mac OS yet

## About tabscolor

![tabsColor preview](https://github.com/mondersky/tabscolor-vscode/raw/master/docs/tabscolor.gif)

This extension lets you color the background of your tabs either by right click, by filetype or by directory. Useful when working with multiple tabs. 
The extension is still in an experimental phase.

## Quickstart

Install the extension, restart your vs code (not just reload), right click on any tab and select from the color menu

## Set tabs color based on filetypes

example: 
```
"tabsColor.byFileType": {
    "js": {
      "backgroundColor": "yellow",
      "fontColor": "black"
    }
  }
```
Add this to your VS Code user settings.json
## Set tabs color based on directories

example:
```
"tabsColor.byDirectory": {
  "C:\\wamp\\www\\my_project\\css": {
    "backgroundColor": "#00efff",
    "fontColor": "#ffffff"
  }
  }
```
Add this to your VS Code user settings.json

The directoy path must be absolute
## Set the active tab color

example:
```
"tabsColor.activeTab": {
  "backgroundColor": "yellow",
  "fontColor": "black"
}
```
Add this to your VS Code user settings.json

## This extension can :

- change the background color of any tab header using the contextual menu

- automatically change the background color of tabs based on filetypes

- automatically change the background color of tabs based on directories

## This extension can't (yet) :

- change the whole background of the tab page

- change the background color of tabs based on regex

- set custom colors in the contextual menu

## Notes :

- This extension doesn't work on mac os and some linux systems

- This extension uses patching in order to allow tabs style editing, if your vs code files are read-only then Tabscolor may not work.

## Available commands:

- clear all tabs colors

## Contributors Welcome

Don't hesitate to contribute to this extension.

## TODO 

Add more colors

Add color icons to color options in the contextual menu

Allow custom color options

Allow partial paths when coloring based on directory

new command: set random colors to all open tabs  

new command: clear the color of all open tabs

new command: sort open tabs by color 

new setting: display/hide language icon on tabs

Add an option on the explorer contextual menu to set colors accoding to the target folder 