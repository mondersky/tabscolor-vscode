let storage_ = null;
module.exports = class Storage {
    constructor(context) {
      this.storage = context.globalState;
    }
    set(key, value) {
      this.storage.update(key, value);
      storage_ = this.storage;
    }
  
    add(key, value) {
      let data = this.storage.get(key);
      if (!data) {
        data = [];
      }
      data.push(value);
      this.set(key, data);
    }
    addTabColor(color, title) {
      let tabs = this.get("tabs");
      if (!tabs) tabs = {};
      if (!tabs[color]) {
        tabs[color] = [];
      }
      for (const i in tabs) {
        const _tabsColor = tabs[i];
        tabs[i] = _tabsColor.filter(function (a) {
          return a != title;
        });
      }
      tabs[color].push(title);
      this.set("tabs", tabs);
    }
    removeTabColor(title) {
      const tabs = this.get("tabs");
      for (const i in tabs) {
        const _tabsColor = tabs[i];
        tabs[i] = _tabsColor.filter(function (a) {
          return a != title;
        });
      }
      this.set("tabs", tabs);
    }
    addCustomColor(color) {
      const colors = this.get("customColors") || {};
      const colorName = Object.keys(color)[0];
      colors[colorName] = {
        background: color[colorName].background,
        color: color[colorName].color
      };
      this.set("customColors", colors);
    }
    removeCustomColor(colorName) {
      const colors = this.get("customColors") || {};
      delete colors[colorName];
      this.set("customColors", colors);
    }
    emptyTabs() {
      this.set("tabs", {});
    }
    get(key) {
      return this.storage.get(key);
    }
  }