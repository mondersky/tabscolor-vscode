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
function sourcePath(context) {
	return path.join(context.extensionPath, "modules");
}
function modulesPath(context) {
	return path.join(context.globalStoragePath, "modules");
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
	// copyModule(context, "test.js");
	let monkeyPatch = vscode.extensions.getExtension("iocave.monkey-patch");
	console.log(modulesPath(context))
	if (monkeyPatch !== undefined) {
		monkeyPatch.exports.contribute("mondersky.tabscolor",
			{
				folderMap: {
					"tabscolor": modulesPath(context),
				},
				browserModules: [
					"tabscolor/test"
				],
				mainProcessModules: [
					"tabscolor/test",
				]
			}
		);
	} else {
		vscode.window.showWarningMessage("Please install the Monkey Patch Otherwise this extension will not work.");
	}
	
	let disposable = vscode.commands.registerCommand('tabscolor.blue', function () {
	   console.log("blue");
	   vscode.window.showInformationMessage('blue');
   });

   context.subscriptions.push(disposable);
	 disposable = vscode.commands.registerCommand('tabscolor.helloWorld', function () {
		let bootstrap=path.join(path.dirname(require.main.filename), "bootstrap-window.js");
		let cssFileLink="vscode-file://vscode-app/"+path.join(modulesPath(context),"inject.css").replace(/\\/g,"/")

		let data = fs.readFileSync(bootstrap,"utf8");
		// data.replace(/(//patched).*(//patched-end)/,"");
		data=data+`
		//patched
		document.addEventListener("DOMContentLoaded", function(event) {
			console.log("dddonee");
			setTimeout(function(){
				document.querySelector(".tabs-container").onclick=function(){
					let head = document.getElementsByTagName('head')[0];
					let link = document.createElement('link');
					link.rel = 'stylesheet';
					link.type = 'text/css';
					link.href = '${cssFileLink}';
					link.media = 'all';
					head.appendChild(link);
				}
			},1000)
		});
		//patched-end
		`
		fs.writeFileSync(bootstrap,data);
		// Display a message box to the user
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
	});

	context.subscriptions.push(disposable3);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
