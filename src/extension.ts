// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { window, workspace, Uri } = vscode;

interface tplItem {
	name: string;
	paths: string[];
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const userTplList: tplItem[] = vscode.workspace.getConfiguration().get('createComponent.useTpl') as tplItem[];
	let disposable = vscode.commands.registerCommand('extension.createComponent', async (uri) => {
		const watcher = fs.watch(uri.fsPath, async function(e: any, name: any) {
			watcher.close();
			
			const dir = path.resolve(uri.fsPath, name);

			// const fileMap = [
			// 	{ id: '1', path: '../assets/index.tsx', name: 'index.tsx' },
			// 	{ id: '2', path: '../assets/index.scss', name: 'index.scss' }
			// ];
			const tplName = await vscode.window.showQuickPick(userTplList.map(item => item.name));
			
			console.log(tplName);

			const fileMap: string[] = userTplList.filter(item => item.name === tplName)[0].paths;

			fileMap.forEach((filePath) => {
				const fileName = path.basename(filePath);

				
				fs.readFile(path.resolve(filePath), function(err: any, data: Buffer) {

					if (!err) {
						const template = ejs.compile(data.toString('utf8'));
						const result = template({ name, date: new Date() });
						fs.writeFileSync(path.resolve(dir, fileName), result);
					} else {
						vscode.window.showErrorMessage(`读取${filePath}失败，${err.toString()}`);
						throw err;
					}
				});
			});
		});

		vscode.commands.executeCommand('explorer.newFolder');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
