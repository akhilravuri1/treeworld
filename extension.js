const vscode = require('vscode');
const nodeDependencies_1 = require("./src/nodeDependencies");
const path = require("path")
const Instance_Dep = require('./src/Instance_Dep')

// method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		const TreeProvider = new nodeDependencies_1.DepNodeProvider(context);
		console.log("THIS IS EXT PATH",context.extensionPath)
		vscode.window.registerTreeDataProvider('Manage',TreeProvider); 
		vscode.commands.registerCommand('Manage.refreshEntry',() => TreeProvider.refresh()),
		vscode.commands.registerCommand('Manage.addEntry',() => add()),
		
		vscode.commands.registerCommand('extension.openPackageOnNpm1', moduleName => documenttree(moduleName));
}

function add(){
	vscode.window.showInputBox({ placeHolder: 'Enter the new label' }).then(value =>{
		vscode.window.showInformationMessage(value)
		const TreeProvider1 = new Instance_Dep.DepNodeProvider1();
		vscode.window.registerTreeDataProvider('Instance',TreeProvider1);
		vscode.commands.registerCommand('Instance.refreshEntry',() => TreeProvider1.refresh()),
		vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => {
			var extPath = path.resolve(process.env.USERPROFILE, ".vscode", "extensions", "DevOps", "dll.txt");

			console.log(vscode.Uri.file(extPath))
			vscode.workspace.openTextDocument(vscode.Uri.file(extPath)).
		then(value => {
			console.log("THIS IS VALUE ",value)
			vscode.window.showTextDocument(value).then(value1 =>{
				console.log("THIS IS VALUE1 ",value1)
			vscode.workspace.onDidCloseTextDocument((cose )=>{
				console.log("THIS IS COSE",cose)
				if(value1.document.getText()){
				const pickListItems = [];
				const option1 = {
					label: "Yes",
					description: "To submit the chnages",
				};
				const option2 = {
					label: "No",
					description: "Delete the changes",
				};
				pickListItems.push(option1,option2)
				vscode.window.showQuickPick(pickListItems,{ 
					ignoreFocusOut: true,
					placeHolder: "Choose one of the action below",
				}).then( selected => {
					if(selected){
						if(selected == option1){
							console.log(value1.document.getText())
						} else{
							console.log("No")
						}
					}
					
				});
			}})
		})
		})})
	})
	const TreeProvider = new nodeDependencies_1.DepNodeProvider();
	TreeProvider.refresh();
}

// function key(value){
// 	vscode.window.onDidChangeActiveTextEditor(function(){
// 		if(value.document.getText()){
// 		const pickListItems = [];
// 		const option1 = {
// 			label: "Yes",
// 			description: "To submit the chnages",
// 		};
// 		const option2 = {
// 			label: "No",
// 			description: "Delete the changes",
// 		};
// 		pickListItems.push(option1,option2)
// 		vscode.window.showQuickPick(pickListItems,{ 
// 			ignoreFocusOut: true,
// 			placeHolder: "Choose one of the action below",
// 		}).then( selected => {
// 			if(selected){
// 				if(selected == option1){
// 					console.log(value.document.getText())
// 				} else{
// 					console.log("No")
// 				}
// 			}
			
// 		});
// 	}})
// }

function documenttree(moduleName){
	console.log(moduleName);
	// const doc = vscode.workspace.openTextDocument({content:"akhil",language:'string'})
	// vscode.window.showTextDocument(doc).then(value =>{ vscode.window.onDidChangeActiveTextEditor(function(){console.log(value.document.getText())});});
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
