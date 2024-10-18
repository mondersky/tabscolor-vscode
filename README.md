
[![Total Installs](https://img.shields.io/visual-studio-marketplace/i/mondersky.tabscolor)](https://marketplace.visualstudio.com/items?itemName=mondersky.tabscolor)

> ⚠️ This extension may not work on mac os and some linux systems

> ⚠️ **IMPORTANT NOTE : AFTER INSTALLING TABSCOLOR YOU MAY GET THE POPUP "YOUR CODE INSTALLATION IS CORRUPT..." UPON RESTART. JUST CLICK ON THE GEAR ICON AND CHOOSE DON'T SHOW AGAIN.**

## About tabscolor

![tabsColor preview](https://github.com/mondersky/tabscolor-vscode/raw/master/docs/extension_demo.gif)

This extension lets you color the background/text of your tabs either by right click, by filetype or by directory. Useful when working with many tabs.

> ⚠️ The extension is still in an experimental phase!


## Quickstart

Install the extension, restart your vs code (not just reload), right click on any tab and select from the color menu.
You can also use settings for coloring based on path or filetype.

### Customize VSCode tab color by file types

example:
```
"tabsColor.byFileType": {
    "js": {
      "backgroundColor": "yellow",
      "fontColor": "black"
    }
  }
```
Add this to your VS Code user `settings.json`

### Customize VSCode tab color by directory path

example:
```
"tabsColor.byDirectory": {
  "C:\\wamp\\www\\my_project\\css": {
    "backgroundColor": "#00efff",
    "fontColor": "#ffffff"
  }
}
```

example 2 (partial path):
```
"tabsColor.byDirectory": {
  "\\my_project\\": {
    "backgroundColor": "#00efff",
    "fontColor": "#ffffff"
  }
}
```
Add this to your VS Code user `settings.json`

### Set the active tab color

example:
```
"tabsColor.activeTab": {
  "backgroundColor": "yellow",
  "fontColor": "black"
}
```
Add this to your VS Code user `settings.json`


## Notes :

- This extension doesn't work on mac os and some linux systems
- This extension uses patching in order to allow tabs style editing, if your vs code files are read-only then Tabscolor may not work.

### This extension can :

- change the background/text color of any tab header using the contextual menu
- automatically change the background/text color of tabs based on filetypes
- automatically change the background/text color of tabs based on directories (absolute or partial)
- change the background/text color of the active tab

### This extension can't (*yet*) :

- change the whole background of the tab page
- change the background color of tabs based on regex (but partial exact paths are possible)


## Available commands:

- clear all tabs colors
- clear all open tab colors
- set tab random color
- set tab specific color (from a list of colors)
- add/delete custom color
- reapply patch
- remove patch (required for uninstalling)


## Contributors Welcome

Don't hesitate to contribute to this extension!

### TODO

- [x] Allow custom color options  (done by ✓[ntkhang03](https://github.com/ntkhang03))
- [x] new command: clear the color of all open tabs (done by ✓[kobilee](https://github.com/kobilee))
- [x] Allow partial paths when coloring based on directory
- [ ] Add more colors
- [ ] Add color icons to color options in the contextual menu
- [ ] new command: set random colors to all open tabs
- [ ] new command: sort open tabs by color
- [ ] new setting: display/hide language icon on tabs
- [ ] Add an option on the explorer contextual menu to set colors accoding to the target folder
- [ ] new feature: toggle color of a tab by double click
