const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const UIManager = require('./view/UIManager');
const https = require('http')
class DepNodeProvider1 {
    constructor(context) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.akhil = undefined;
        this.akhil1 = undefined;
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
                        "obj1":"21",
                        "obj2":"21",
                        "obj3":"21"
                    }
                };
                return Promise.resolve(this.getDeps(packageJson1));
            }  else {
                let akhil;
                akhil = path.resolve(process.env.USERPROFILE, ".vscode", "extensions");
                this.akhil = path.resolve(akhil,"DevOps")
                this.akhil1 = path.resolve(this.akhil,"ddl.txt")
                console.log(this.akhil1);
                vscode.window.showTextDocument(vscode.Uri.file(this.akhil1));
            }
        }
        else {
            // console.log("else getchildren")
            // this._uiManager.callingApplications(css =>{
            //     console.log(css)
            // })
           
            //var akhil = await this.akhil_func()
            //console.log(akhil)
            //var akhil = this.akhil_func() 
            //return Promise.resolve(this.getDeps(akhil))
            // if(a==1){
            //     console.log(akhil);
            //     return Promise.resolve(this.getDeps(akhil))
            // }
            const packageJson1 = {
                "Aplications" : {
                    "Inst1":"21",
                    "Inst2":"21",
                    "Inst3":"21"
                }
            }
            return Promise.resolve(this.getDeps(packageJson1))

            // const options = {
            //     hostname: 'rs22.rocketsoftware.com',
            //     port: 9152,
            //     path: '/ws/policy/applications',
            //     method: 'GET',
            //     headers: {
            //         'Authorization':'Basic '+ Buffer.from('csmvdqe:9JIPIGI').toString('base64')
            //     }
            // }
            // var packageJson={
            //     Aplications:{}
            // }
            // var check;
            // var chunks = []
            // const req = await  https.request(options, async (res) => {
            //     await res.on('data', (d) => {
            //         chunks.push(d)               
            //     })
    
            //     await res.on('end',function(){
            //         console.log("end")
            //         var i;
            //         var body = Buffer.concat(chunks)
            //         var data = JSON.parse(body.toString())
            //         var len = Object.keys(data.applications).length;
            //         for (i=0;i<len;i++){
            //             packageJson.Aplications[data.applications[i].name] = data.applications[i].id;
            //         }
            //         console.log(packageJson)
            //         check = packageJson
            //     })
            //     res.on('error', (error) => {
            //         console.log(error)
            //     })
            // })
            // req.on('error', (error) => {
            //     console.error(error)
            // })
            // req.end()
            // this.akhil_func(this)
            // return Promise.resolve(this.getDeps(packageJson1))
        }        
    }

    sleep(delay) {
        console.log("In the sleep")
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    }

    akhil_func (parent_this){
        const options = {
            hostname: 'rs22.rocketsoftware.com',
            port: 9152,
            path: '/ws/policy/applications',
            method: 'GET',
            headers: {
                'Authorization':'Basic '+ Buffer.from('csmvdqe:9JIPIGI').toString('base64')
            }
        }
        var packageJson={
            Aplications:{}
        }
        var chunks = []
        const req = https.request(options,function(res){
            res.on('data', (d) => {
                chunks.push(d)                
            })

            var akhi = res.on('end',function (){
                var i;
                var body = Buffer.concat(chunks)
                var data = JSON.parse(body.toString())
                var len = Object.keys(data.applications).length;
                for (i=0;i<len;i++){
                    packageJson.Aplications[data.applications[i].name] = data.applications[i].id;
                }
                //var akhil = Promise.resolve(this.getdeps(packageJson))
                //cb(packageJson)
                console.log(packageJson.Aplications)
                parent_this.getDeps(packageJson); 
            })
            console.log(akhi)
            res.on('error', (error) => {
                console.log(error)
            })
        })
        req.on('error', (error) => {
            console.error(error)
        })
        req.end()  
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
                ? Object.keys(packageJson.Teams).map(dep => toDep(dep,vscode.TreeItemCollapsibleState.None,'Teams'))
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
exports.DepNodeProvider1 = DepNodeProvider1;