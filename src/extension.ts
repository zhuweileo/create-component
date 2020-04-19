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
	console.log('Congratulations, your extension "create-component" is now active!');
	console.log(context);
	


	let disposable = vscode.commands.registerCommand('extension.showFileDir', async (uri) => {
		
		const watcher = fs.watch(uri.fsPath,function (e: any, name:any) {
			console.log(uri.fsPath, name);
			
			
			const dir = path.resolve(uri.fsPath,name);

			const fileMap = [
				{ id: '1', path: '../assets/index.js', name: 'index.js' },
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
		
		const res = await vscode.commands.executeCommand('explorer.newFolder');
		// console.log(uri);
		// console.log(
		// 	workspace.workspaceFile,
		// 	workspace.workspaceFolders,
		// 	);
		

		

		// const name = await window.showInputBox({placeHolder: '请输入组件名'})
		// if(!name) return;
		
		// const dir = path.resolve(uri.fsPath,name);
		// const myUri = Uri.file(dir);
		// fs.mkdirSync(dir);

		// const fileMap = [
		// 	{ id: '1', path: '../assets/index.js', name: 'index.js' },
		// 	{ id: '2', path: '../assets/index.scss', name: 'index.scss' }
		// ];

		// fileMap.forEach((file) => {
		// 	const fileContent = fs.readFileSync(path.join(__dirname, file.path), { encoding: 'utf8' });
		// 	let result = fileContent;
		// 	if(file.id === '1') {
		// 		const template = ejs.compile(fileContent)
		// 		result = template({name})
		// 	}
			
		// 	fs.writeFileSync(path.resolve(dir, file.name), result);
		// });

		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
