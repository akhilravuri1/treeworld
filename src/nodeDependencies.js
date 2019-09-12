/**
 * @param {{ contextValue: string; }} element
 */
const vscode = require("vscode");
const path = require("path");
const UIManager = require('./view/UIManager');
const https = require('http');

class DepNodeProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this._uiManager = new UIManager(context)
    }
    
    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        if(element){
            if (element.contextValue == "Aplications"){
                const packageJson1 = {
                    "Teams" : {
                        "Team1":"21",
                        "Team2":"21",
                        "Team3":"21"
                    }
                };
                return Promise.resolve(this.getDeps(packageJson1));
            } else if (element.contextValue == "Teams"){
                const packageJson2 = {
                    "Environment": {
                        "Env1": "^3.3.1",
                        "Env2": "^3.3.1"
                    }
                }
                return Promise.resolve(this.getDeps(packageJson2));
            } else {
                let akhil;
                akhil = path.resolve(process.env.USERPROFILE, ".vscode", "extensions");
                this.akhil = path.resolve(akhil,"DevOps")
                this.akhil1 = path.resolve(this.akhil,"ddl.txt")
                console.log(this.akhil1);
                vscode.window.showTextDocument(vscode.Uri.file(this.akhil1));
            }
        }
        else {
            var packageJson={
                "Aplications" : {
                    "App1":"21",
                    "App2":"21",
                    "App3":"21"
                }
            };
            return Promise.resolve(this.getDeps(packageJson))
            // return this.Load_Instances().then(packageJson =>{
            //     return new Promise((resolve,reject)=>{
            //         return resolve(this.getDeps(packageJson))
            //     })
            // })
        }        
    }

    sleep(delay) {
        console.log("In the sleep")
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    Load_Instances(){
        const options = {
            hostname: 'rs23.rocketsoftware.com',
            port: 9151,
            path: '/ws/policy/instances',
            method: 'GET',
            headers: {
                'Authorization':'Basic '+ Buffer.from('csmvdqe:9JIPIGI').toString('base64')
            }
        }

        return new Promise((resolve,reject) => {
        var chunks = []
        https.request(options,function(res){
            res.on('data', (d) => {
                chunks.push(d)                
            })

            res.on('end',function (){
                var packageJson ={
                    Aplications:{}
                }
                var i;
                var body = Buffer.concat(chunks)
                var data = JSON.parse(body.toString())
                var len = Object.keys(data.instances).length;
                for (i=0;i<len;i++){
                    packageJson.Aplications[data.instances[i].name] = data.instances[i].id;
                }
                resolve(packageJson)
            })
            res.on('error', (error) => {
                reject(error)
            })
        })
        .on('error', (error) => {
            reject(error)
        })
        .end()
        })
    }

    getDeps(packageJson){
        const toDep = (moduleName,type,name) => {
            if(packageJson.moduleName){
                return new Dependency(moduleName, type, name);
            }else{
                return new Dependency(moduleName, type, name, {
                    command: 'extension.openPackageOnNpm',
                    title: '',
                    arguments: [moduleName]
                });
            }
        }
        if (packageJson.Aplications){
            const deps = packageJson.Aplications
                ? Object.keys(packageJson.Aplications).map(dep =>toDep(dep,vscode.TreeItemCollapsibleState.Collapsed,'Aplications'))
                : [];
            return deps;
        } else if (packageJson.Teams){
            const deps = packageJson.Teams
                ? Object.keys(packageJson.Teams).map(dep => toDep(dep,vscode.TreeItemCollapsibleState.Collapsed,'Teams'))
                : [];
            return deps;
        } else if (packageJson.Environment){
            const devDeps = packageJson.Environment
            ? Object.keys(packageJson.Environment).map(dep => toDep(dep,vscode.TreeItemCollapsibleState.None,'Environment'))
            : [];
            return devDeps;
        } else if (packageJson.Objects){
            const devDeps = packageJson.Objects
            ? Object.keys(packageJson.Objects).map(dep => toDep(dep,vscode.TreeItemCollapsibleState.None,'Objects'))
            : [];
            return devDeps;
        } else {
            vscode.window.showInformationMessage("this is out of getdeps")
        }
    }
}

class Dependency extends vscode.TreeItem {
    constructor(label, collapsibleState, type, command) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.command = command
        this.iconPath = {
            light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
        };
        this.contextValue = type;
    }
    get tooltip() {
        return `${this.label}`;
    }
    get description() {
        return "desc";
    }
}

exports.Dependency = Dependency;
exports.DepNodeProvider = DepNodeProvider;