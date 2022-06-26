// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

class Core{
	constructor(context, filePath){
		this.context = context
		this.fileContent=fs.readFileSync(filePath, "utf8");
		this.file = filePath
	}
	startPatch(patchName, isReg = false){
		let patchString = `/* startpatch ${patchName} */`;
		if(isReg) patchString = patchString.replace(/\*/g, "\\*")
		return patchString
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
	write(){
		fs.writeFileSync(this.file, this.fileContent)
	}
}

function sourcePath(context) {
	return path.join(context.extensionPath, "modules");
}

function modulesPath(context) {
	return path.join(context.globalStoragePath, "modules");
}

function reloadCss(){
	vscode.window.showInformationMessage("---update---");
}
function generateStyle(color, title){
	let colors={
		"salmon":{ background:"#9d533a",color:"white"},
		"green":{ background:"#8fbc8f",color:"white"},
	}
	let target= colors[color];
	return `.tab[title="${title}" i]{
		background-color:${target.background} !important;
		color:${target.color} !important;
		}
		.tab[title="${title}" i] a,.tab[title="${title}" i] .monaco-icon-label:after{
		color:${target.color} !important;
		}`;
}
function activate(context) {
	let disposable = vscode.commands.registerCommand('tabscolor.blue', function () {
	   vscode.window.showInformationMessage('blue');
   });

   context.subscriptions.push(disposable);
	 disposable = vscode.commands.registerCommand('tabscolor.helloWorld', function () {
		let bootstrapPath=path.join(path.dirname(require.main.filename), "bootstrap-window.js");
		let cssFileLink="vscode-file://vscode-app/"+path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")
		let bootstrap = new Core(context, bootstrapPath)
		let code=`
		var reloadCss = function(){
			let tabsCss=document.getElementById("tabscss");
			tabsCss.href=tabsCss.href.replace(/\\?refresh=\d/,"")+"?refresh="+Math.floor(Math.random() * 11)
		}
		var createCss = function(){
			let head = document.getElementsByTagName('head')[0];
					let link = document.createElement('link');
					link.rel = 'stylesheet';
					link.id= 'tabscss';
					link.type = 'text/css';
					link.href = 'vscode-file://vscode-app/c:/Users/MAWAKI3/AppData/Roaming/Code - Insiders/User/globalStorage/mondersky.tabscolor/modules/inject.css';
					link.media = 'all';
					head.appendChild(link);
		}
		var domInsert = function (element, callback=0) {
			console.log(this)
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
			console.log("dddonee");
			setTimeout(function(){

				
				domInsert(document, function(appeared){
					let updatePopup = appeared.find(function(a){

						return a.textContent.trim()=="---update---"
					})
					console.log(updatePopup)
					if(updatePopup){
						reloadCss()
					}
				})
				createCss()
			},1000)
		})`

		bootstrap.remove("watcher").add("watcher", code).write()
		// Display a message box to the user
		reloadCss()
		vscode.window.showInformationMessage("test");
	});

	context.subscriptions.push(disposable);

	 let disposable2 = vscode.commands.registerCommand('tabscolor.salmon', function (a, b) {
		let cssFile=path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")
		let title= a.fsPath.replace(/\\/g,"\\\\")
		let data = fs.readFileSync(cssFile,"utf8");
		let cssRule =generateStyle("salmon",title)
		data = data + cssRule;
		fs.writeFileSync(cssFile, data);
		reloadCss()
	});

	context.subscriptions.push(disposable2);

	 let disposable3 = vscode.commands.registerCommand('tabscolor.green', function (a, b) {
		console.log(a, b);
		let cssFile=path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")
		let title= a.fsPath.replace(/\\/g,"\\\\")
		let data = fs.readFileSync(cssFile,"utf8");
		let cssRule =generateStyle("green",title)
		data = data + cssRule;
		fs.writeFileSync(cssFile, data);
		vscode.window.showInformationMessage("---update---");
	});

	context.subscriptions.push(disposable3);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
