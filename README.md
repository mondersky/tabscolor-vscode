
[![Total Installs](https://img.shields.io/visual-studio-marketplace/i/mondersky.tabscolor)](https://marketplace.visualstudio.com/items?itemName=mondersky.tabscolor)

> ⚠️ This extension may not work on mac os and some linux systems

> ⚠️ **IMPORTANT NOTE :**
> * AFTER INSTALLING TABSCOLOR AND RESTARTING VSCODE, YOU WILL GET THE POPUP "*YOUR CODE INSTALLATION IS CORRUPT...*".
> * CLICK ON THE GEAR ICON AND CHOOSE "*DON'T SHOW AGAIN*"
> * PLEASE REFER TO THE **NOTES** AND **UNINSTALL** SECTION FOR MORE INFORMATION

## About tabscolor

![tabsColor preview](https://github.com/mondersky/tabscolor-vscode/raw/master/docs/extension_demo.gif)

This extension lets you color the background/text of your tabs either by right click, by filetype or by directory. Useful when working with many tabs.

> ⚠️ The extension is still in an experimental phase!


## Quickstart

Install the extension, RESTART your vscode (not just reload), right click on any tab and select from the color menu.
You can also use settings for coloring based on path or filetype.

### Customize VSCode tab color by file types

example:
```
"tabsColor.byFileType": {
    "js": {
      "backgroundColor": "yellow",
      "fontColor": "black",
      "opacity" : 0.6
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
    "fontColor": "#ffffff",
    "opacity" : 0.6
  }
}
```

example 2 (partial path):
```
"tabsColor.byDirectory": {
  "\\my_project\\": {
    "backgroundColor": "#00efff",
    "fontColor": "#ffffff",
    "opacity" : 0.6
  }
}
```
Add this to your VS Code user `settings.json`

### Set the active tab color

example:
```
"tabsColor.activeTab": {
  "backgroundColor": "yellow",
  "fontColor": "black",
  "opacity" : 1.0
}
```
Add this to your VS Code user `settings.json`


## Notes :

- This extension doesn't work on some mac os and linux systems
- This extension uses patching in order to allow tabs style editing, so if your vs code files are read-only then Tabscolor may not work.
  - This is what triggers the "Your code installation is corrupt..." message. The ideal would be to avoid doing this but this is the only way to make this feature possible at the moment... https://github.com/mondersky/tabscolor-vscode/issues/20
- This extension doesn't work for "[Floating editor windows](https://code.visualstudio.com/updates/v1_85#_floating-editor-windows)"... https://github.com/mondersky/tabscolor-vscode/issues/40

### Uninstall :

- You MUST use the "remove patch" command before uninstalling to avoid "Your code installation is corrupt..." message in the future
  - There is no current API to execute it automatically when the user is uninstalling the extension... https://github.com/mondersky/tabscolor-vscode/issues/16

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
- [x] New command: clear the color of all open tabs (done by ✓[kobilee](https://github.com/kobilee))
- [x] Allow partial paths when coloring based on directory
- [ ] Add color icons to color options in the contextual menu
- [ ] New command: set random colors to all open tabs
- [ ] New command: sort open tabs by color
- [ ] Add a new item to the explorer contextual menu to quickly set colors based on to the target folder
- [ ] New feature: toggle color of a tab by a shortcut
- [ ] New setting: tab opacity when inactive
