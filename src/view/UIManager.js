const vscode = require("vscode");
const htmlContent = require('./htmlContent');
const http = require("http");
const request = require("request")

class  UIManager {
    constructor(context){
        this._context = context 
    }

    callingApplications(cb){
        console.log("This is callingApplications")
        const panel = vscode.window.createWebviewPanel(
            "DevOps",
            "",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true
            }
        );
        panel.webview.html = htmlContent.applications();
        panel.webview.onDidReceiveMessage(message => {
            panel.dispose();
            if(message){
                console.log(message.msg);
                cb(message.msg)
                panel.dispose()
            } else {
                vscode.window.showInformationMessage("This is else");
            }
        });
    }
}
module.exports = UIManager