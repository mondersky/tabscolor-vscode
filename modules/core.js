const fs = require('fs');
const os = require("os");
module.exports = class Core {

    constructor(context, filePath) {
      this.context = context;
      this.fileContent = fs.readFileSync(filePath, "utf8");
      this.initialContent = this.fileContent;
      this.file = filePath;
    }
    exists() {
      return fs.existsSync(this.file);
    }
    startPatch(patchName, isReg = false) {
      let patchString = `
          /* startpatch ${patchName} */
          `;
      if (isReg) patchString = patchString.replace(/\*/g, "\\*");
      return patchString;
    }
    isReadOnly() {
      try {
        fs.writeFileSync(this.file, this.initialContent);
      }
      catch (e) {
        return true;
      }
    }
    chmod() {
      try {
        fs.chmodSync(this.file, 0o700);
      }
      catch (e) {
        console.log("Error Code:", e);
        return false;
      }
      return true;
    }
    hasPatch(patchName) {
      return this.fileContent.includes(this.startPatch(patchName));
    }
    endPatch(patchName, isReg = false) {
      let patchString = `
          /* endpatch ${patchName} */
          `;
      if (isReg) patchString = patchString.replace(/\*/g, "\\*");
      return patchString;
    }
    remove(patchName) {
      const regString = `(${this.startPatch(patchName, true)})[^]*(${this.endPatch(patchName, true)})`;
      const reg = new RegExp(regString);
      this.fileContent = this.fileContent.replace(reg, "");
      return this;
    }
    add(patchName, code) {
      const enclosedCode = `${this.startPatch(patchName)} ${code} ${this.endPatch(patchName)}`;
      this.fileContent = " " + enclosedCode + " " + this.fileContent;
      return this;
    }
    empty() {
      fs.writeFileSync(this.file, "");
      this.initialContent = "";
    }
    write() {
      console.log(this.fileContent);
      fs.writeFileSync(this.file, this.fileContent);
      this.initialContent = this.fileContent;
    }
    sudoPrompt(func) {
  
      const options = {
        name: 'TabsColor'
      };
      const separator = this.file.includes("/") ? "/" : "\\";
      const baseName = this.file.split(separator).reverse()[0];
      let command = `chmod 777 "${this.file}"`;
      switch (os.platform()) {
        case "win32": {
          command = `rename "${this.file}" "${baseName}"`;
        }
          break;
      }
      sudo.exec(command, options,
        function (error, stdout, stderr) {
          if (error) {
            func(false);
            throw error;
          }
          else {
            func(true);
          }
        }
      );
    }
  }