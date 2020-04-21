// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { window, workspace, Uri } = vscode;


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.showFileDir', async (uri) => {
		
		const watcher = fs.watch(uri.fsPath,function (e: any, name:any) {
			
			const dir = path.resolve(uri.fsPath,name);

			const fileMap = [
				{ id: '1', path: '../assets/index.tsx', name: 'index.tsx' },
				{ id: '2', path: '../assets/index.scss', name: 'index.scss' }
			];
			

			fileMap.forEach((file) => {
				const fileContent = fs.readFileSync(path.join(__dirname, file.path), { encoding: 'utf8' });
				let result = fileContent;
				if(file.id === '1') {
					const template = ejs.compile(fileContent)
					result = template({name})
				}
				
				fs.writeFileSync(path.resolve(dir, file.name), result);
			});
			watcher.close();
		})
		
		vscode.commands.executeCommand('explorer.newFolder');
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
