// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path");
const sudo = require('sudo-prompt');
const os = require("os");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

 class Storage{
	constructor(context){
		this.storage = context.globalState
	}
	set(key, value){
		this.storage.update(key, value)
	}
	
	add(key, value){
		let data = this.storage.get(key)
		if(!data){
			data=[];
		}
		data.push(value);
		this.set(key, data)
	}
	addTabColor(color, title){
		var tabs = this.get("tabs")
		if(!tabs) tabs = {};
		if(!tabs[color]){
			tabs[color]=[]
		}
		for(let i in tabs){
			let _tabsColor = tabs[i]
			tabs[i] = _tabsColor.filter(function(a){
				return a != title;
			})
		}
		tabs[color].push(title)
		this.set("tabs", tabs)
	}
	removeTabColor(title){
		var tabs = this.get("tabs")
		for(let i in tabs){
			let _tabsColor = tabs[i]
			tabs[i] = _tabsColor.filter(function(a){
				return a != title;
			})
		}
		this.set("tabs", tabs)
	}
	emptyTabs(){
		this.set("tabs", {})
	}
	get(key){
		return this.storage.get(key)
	}
}
class Core{
	
	constructor(context, filePath){
		this.context = context
		this.fileContent=fs.readFileSync(filePath, "utf8");
		this.initialContent = this.fileContent;
		this.file = filePath
	}
	startPatch(patchName, isReg = false){
		let patchString = `/* startpatch ${patchName} */`;
		if(isReg) patchString = patchString.replace(/\*/g, "\\*")
		return patchString
	}
	isReadOnly(){
		try {
			fs.writeFileSync(this.file, this.initialContent);
		  }
		  catch (e) {
			return true;
		  }
	}
	chmod(){
		try {
			let result = fs.chmodSync(this.file, 0o700)
		}
		catch (e) {
			console.log("Error Code:", e);
			return false;
		}
		return true;
	}
	hasPatch(patchName){
		return this.fileContent.includes(this.startPatch(patchName))
	}
	endPatch(patchName, isReg = false){
		let patchString = `/* endpatch ${patchName} */`;
		if(isReg) patchString = patchString.replace(/\*/g, "\\*")
		return patchString
	}
	remove(patchName){
		let regString= `(${this.startPatch(patchName, true)})[^]*(${this.endPatch(patchName, true)})`;
		var reg= new RegExp(regString)
		this.fileContent = this.fileContent.replace(reg,"");
		return this;
	}
	add(patchName, code){
		let enclosedCode = `${this.startPatch(patchName)} ${code} ${this.endPatch(patchName)}`;
		this.fileContent = this.fileContent+" "+enclosedCode;
		return this;
	}
	empty(){
		fs.writeFileSync(this.file, "")
		this.initialContent = ""
	}
	write(){
		fs.writeFileSync(this.file, this.fileContent)
		this.initialContent = this.fileContent
	}
	sudoPrompt(func){

		var options = {
			name: 'TabsColor'
		};
		let separator = this.file.includes("/") ? "/" : "\\";
		let baseName = this.file.split(separator).reverse()[0];
		var command=`chmod 777 "${this.file}"`
		switch(os.platform()){
			case "win32":{
				command=`rename "${this.file}" "${baseName}"`
			}
			break;
		}
		sudo.exec(command, options,
		function(error, stdout, stderr) {
			if (error) {
				func(false);
					throw error;
			}
			else{
				func(true)
			}
		}
		);
	}
}

function sourcePath(context) {
	return path.join(context.extensionPath, "modules");
}

function modulesPath(context) {
	return path.join(context.globalStoragePath, "modules");
}

function reloadCss(){
	vscode.window.showInformationMessage("---tab updated---");
}

function formatTitle(title){
	if(os.platform()!="win32") {
		let homeDir = os.homedir()+'/';
		title=title.replace(homeDir,"");
	}
	return title;
}

function generateCssFile(context) {
	let colors = {
		"none": { background: "transparent", color: "inherit" },
		"salmon": { background: "#9d533a", color: "white" },
		"green": { background: "#528752", color: "white" },
		"blue": { background: "#3498DB", color: "white" },
		"orange": { background: "#DC7633", color: "white" },
		"yellow": { background: "#F1C40F", color: "black" },
		"red": { background: "#C0392B", color: "white" },
		"black": { background: "#000000", color: "white" },
		"white": { background: "#ffffff", color: "black" },
	}
	let storage = new Storage(context);
	let rulesBasedStyle = vscode.workspace.getConfiguration('tabsColor');
	let byFileType = rulesBasedStyle.byFileType;
	let byDirectory = rulesBasedStyle.byDirectory;
	let activeTab = rulesBasedStyle.activeTab;
	let cssFile = path.join(modulesPath(context), "inject.css")
	let data = "";
	let tabs = storage.get("tabs")
	let style = "";
	let homeDir = os.homedir()+'/';
	for (let a in byFileType) {
		if (a == "filetype") continue;
		style += `.tab[title$=".${formatTitle(a)}" i]{background-color:${byFileType[a].backgroundColor} !important; opacity:0.6;}
				.tab[title$="${formatTitle(a)}" i] a,.tab[title$="${formatTitle(a)}" i] .monaco-icon-label:after,.tab[title$="${formatTitle(a)}" i] .monaco-icon-label:before{color:${byFileType[a].fontColor} !important;}`
	}
	for (let a in byDirectory) {
		if (a == "my/directory/") continue;
		let title = a.replace(/\\/g, "\\\\")
		style += `.tab[title*="${formatTitle(title)}" i]{background-color:${byDirectory[a].backgroundColor} !important; opacity:0.6;}
				.tab[title*="${formatTitle(title)}" i] a,.tab[title*="${formatTitle(title)}" i] .monaco-icon-label:after,.tab[title*="${formatTitle(title)}" i] .monaco-icon-label:before{color:${byDirectory[a].fontColor} !important;}`
	}
	style += ".tab.active{opacity:1 !important}";
	if (activeTab.backgroundColor != "default") {
		style += `body .tabs-container .tab.active{background-color:${activeTab.backgroundColor} !important; }body .tabs-container .tab.active a,body .tabs-container .tab.active .monaco-icon-label:after,body .tabs-container .tab.active .monaco-icon-label:before{color:${activeTab.fontColor} !important;}`;
	}
	let activeSelectors = "";
	let activeSelectorsArr = [];
	for (let i in tabs) {
		let _colorTabs = tabs[i];
		let backgroundSelectors = "";
		let fontColorSelectors = "";
		let _background = colors[i].background
		let _fontColor = colors[i].color
		let backgroundSelectorsArr = _colorTabs.map(function (a) {
			return `.tab[title*="${formatTitle(a)}" i]`
		})
		activeSelectorsArr.push(..._colorTabs.map(function (a) {
			return `.tab[title*="${formatTitle(a)}" i].active`
		}))
		let fontColorSelectorsArr = _colorTabs.map(function (a) {
			return `.tab[title*="${formatTitle(a)}" i] a,.tab[title="${formatTitle(a)}" i] .monaco-icon-label:after,.tab[title*="${formatTitle(a)}" i] .monaco-icon-label:before`
		})
		if (backgroundSelectorsArr.length > 0) {
			backgroundSelectors = backgroundSelectorsArr.join(",") + `{background-color:${_background} !important; opacity:0.6;}`
		}
  
		if (fontColorSelectorsArr.length > 0) {
			fontColorSelectors = fontColorSelectorsArr.join(",") + `{color:${_fontColor} !important;}`
		}
		style += backgroundSelectors + fontColorSelectors
	}
	if (activeSelectorsArr.length > 0) {
		activeSelectors = activeSelectorsArr.join(",") + `{opacity:1;}`
	}
	style += activeSelectors;
	let dirExists = fs.existsSync(modulesPath(context));
	if (!dirExists) {
		let test = fs.mkdirSync(modulesPath(context), { recursive: true });
		console.log("css", test)
	}
  
	console.log("file", cssFile)
	if (fs.existsSync(cssFile)) {
		fs.writeFileSync(cssFile, style);
	}
	else {
		fs.appendFile(cssFile, style, function (err) {
			if (err) {
				vscode.window
					.showInformationMessage(
						`Could not create a css file. tabscolor won't be able to change your tabs color`,
					)
				throw err
			};
		});
	}
 }
 
function setColor(context, color, title){
		let storage = new Storage(context);
		if(storage.get("patchedBefore")){
			if(storage.get("secondActivation")){
				storage.addTabColor(color, title)
				generateCssFile(context)
				reloadCss()
			}else{
				vscode.window.showErrorMessage("In order for Tabscolor to work, you need to restart your VS Code (not just reload) ");
			}
		}
		else{
			vscode.window.showErrorMessage("Tabscolor was unable to patch your VS Code files. ");
		}
}
function unsetColor(context, title){
	let storage = new Storage(context);
		if(storage.get("patchedBefore")){
			if(storage.get("secondActivation")){
				storage.removeTabColor(title)
				generateCssFile(context)
				reloadCss()
			}else{
				vscode.window.showErrorMessage("In order for Tabscolor to work, you need to restart your VS Code (not just reload) ");
			}
		}
		else{
			vscode.window.showErrorMessage("Tabscolor was unable to patch your VS Code files. ");
		}
}

function promptRestart() {
	vscode.window
	  .showInformationMessage(
		`Restart VS Code (not just reload) in order for tabscolor changes to take effect.`,
	  )
  }

function promptRestartAfterUpdate() {
	vscode.window
	  .showInformationMessage(
		`VS Code files change detected. Restart VS Code (not just reload) in order for tabscolor to work.`,
	  )
  }
function activate(context) {

	let storage = new Storage(context);
	let bootstrapPath=path.join(path.dirname(require.main.filename), "bootstrap-window.js");
	let cssFileLink=path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")
	if(os.platform()=="win32"){ cssFileLink="vscode-file://vscode-app/" + cssFileLink; }
	let bootstrap = new Core(context, bootstrapPath)
	let code=`
	var reloadCss = function(){
		let tabsCss=document.getElementById("tabscss");
		tabsCss.href=tabsCss.href.replace(/\\?refresh=\\d/,"")+"?refresh="+Math.floor(Math.random() * 999999999999)
	}
	var createCss = function(){
		let head = document.getElementsByTagName('head')[0];
				let link = document.createElement('link');
				link.rel = 'stylesheet';
				link.id= 'tabscss';
				link.type = 'text/css';
				link.href = '${cssFileLink}';
				link.media = 'all';
				head.appendChild(link);
		return document.getElementById('tabscss') != null
	}
	var domInsert = function (element, callback=0) {
		var listen = (function(){
			var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
			return function( obj, callback ){
				if( !obj || !obj.nodeType === 1 ) return;  
				if( MutationObserver ){
					var obs = new MutationObserver(function(mutations, observer){
						callback(mutations);
					})
					obs.observe( obj, { childList:true, subtree:true });
				}
				else if( window.addEventListener ){
					obj.addEventListener('DOMNodeInserted', callback, false);
				}
			}
		})();
		let listElm = element;
		listen( listElm, function(m){ 
			var addedNodes = []
			m.forEach(record => record.addedNodes.length & addedNodes.push(...record.addedNodes))
			if(callback!=0)
				callback(addedNodes)
		});
	};
	document.addEventListener("DOMContentLoaded", function(event) {
		setTimeout(function(){
			domInsert(document, function(appeared){
				let updatePopup = appeared.filter(function(a){
					return a.textContent.trim().includes("---tab updated---")
				})
				if(updatePopup.length>0){
					updatePopup.forEach(function(a){
						if(updatePopup && typeof updatePopup!="string"){
							if(a.classList && !a.classList.contains("notifications-toasts"))
								a.remove()
						}
					})
					reloadCss()
				}
				
			})
		},1000)
		var cssCreateProc = setInterval(function(){
			if(createCss()){
				clearInterval(cssCreateProc)
			}
		},500)
	})`
	
	if(!bootstrap.hasPatch("watcher")){
		if(bootstrap.isReadOnly() && !bootstrap.chmod()){
				bootstrap.sudoPrompt(function(result){
					if(result){
						bootstrap.add("watcher", code).write()
						if(storage.get("patchedBefore")){
							storage.set("secondActivation", false)
							storage.set("firstActivation", false)
							promptRestartAfterUpdate()
						}
						else{
							storage.set("patchedBefore", true)
							promptRestart()
						}
					}else{
						vscode.window.showErrorMessage("Tabscolor was unable to write to "+bootstrap.file);
					}
				})
		}
		else{
			bootstrap.add("watcher", code).write()
			if(storage.get("patchedBefore")){
				storage.set("firstActivation", false)
				storage.set("secondActivation", false)
				promptRestartAfterUpdate()
			}
			else{
				storage.set("patchedBefore", true)
				promptRestart()
			}
		}
	}
	else{
		storage.set("patchedBefore", true)
		storage.set("firstActivation", true)
	}
	if(storage.get("firstActivation")){
		generateCssFile(context)
		reloadCss();
		storage.set("secondActivation", true)
	}
	vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('tabsColor')) {
            vscode.window.showInformationMessage('tabs colors updated');
			generateCssFile(context)
			reloadCss();
        }
    });

	storage.set("firstActivation", true)
	let disposable = vscode.commands.registerCommand('tabscolor.test', function () {
		
		bootstrap.sudoPrompt(function(result){})
	});

	disposable = vscode.commands.registerCommand('tabscolor.clearTabsColors', function () {
		let cssFile=path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")
		let css = new Core(context, cssFile);
		storage.emptyTabs()
		css.empty();
		generateCssFile(context)
		reloadCss()
		vscode.window.showInformationMessage('tabs colors cleared. rules based on filetype and directories aren\'t affected ');
	});


	 disposable = vscode.commands.registerCommand('tabscolor.debugColors', function () {
		// Display the stored tabs colors in console
		console.log(storage.get("tabs"));
	});

	 disposable = vscode.commands.registerCommand('tabscolor.debugEraseStorage', function () {
		storage.set("firstActivation",false)
		storage.set("secondActivation",false)
		storage.set("patchedBefore",false)
	});


	 

	 disposable = vscode.commands.registerCommand('tabscolor.none', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		unsetColor(context, file.replace(/\\/g,"\\\\"));
	});

	
	disposable = vscode.commands.registerCommand('tabscolor.repatch', function (a, b) {
		bootstrap.remove("watcher").add("watcher", code).write()
		promptRestart()
	});

	
	disposable = vscode.commands.registerCommand('tabscolor.removePatch', function (a, b) {
		bootstrap.remove("watcher").write()
		promptRestart()
	});


	 disposable = vscode.commands.registerCommand('tabscolor.salmon', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "salmon", file.replace(/\\/g,"\\\\"));
	});


	 disposable = vscode.commands.registerCommand('tabscolor.green', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "green", file.replace(/\\/g,"\\\\"));

	});

	 disposable = vscode.commands.registerCommand('tabscolor.blue', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "blue", file.replace(/\\/g,"\\\\"));

	});

	 disposable = vscode.commands.registerCommand('tabscolor.red', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "red", file.replace(/\\/g,"\\\\"));

	});	

	 disposable = vscode.commands.registerCommand('tabscolor.orange', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "orange", file.replace(/\\/g,"\\\\"));

	});
	 disposable = vscode.commands.registerCommand('tabscolor.yellow', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "yellow", file.replace(/\\/g,"\\\\"));

	});
	 disposable = vscode.commands.registerCommand('tabscolor.black', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "black", file.replace(/\\/g,"\\\\"));

	});
	 disposable = vscode.commands.registerCommand('tabscolor.white', function (a, b) {
		let file = vscode.window.activeTextEditor.document.fileName;
		if(a) file = a.fsPath;
		setColor(context, "white", file.replace(/\\/g,"\\\\"));

	});

	context.subscriptions.push(disposable);
}

function deactivate(context) {
	let storage = new Storage(context);
	let bootstrapPath=path.join(path.dirname(require.main.filename), "bootstrap-window.js");
	let bootstrap = new Core(context, bootstrapPath)
	storage.set("firstActivation", false)
	storage.set("secondActivation", false)
	bootstrap.remove("watcher").write();

}

module.exports = {
	activate,
	deactivate
}
