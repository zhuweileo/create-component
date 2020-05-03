// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { window, workspace, Uri } = vscode;

interface tplItem {
	name: string;
	default?: boolean;
	paths: string[];
}

function createFiles(fileMap: string[], componentName: string, dir: string) {
	fileMap.forEach((filePath) => {
		const fileName = path.basename(filePath);
		fs.readFile(path.resolve(filePath), function(err: any, data: Buffer) {
			if (!err) {
				const template = ejs.compile(data.toString('utf8'));
				const result = template({ name: componentName, date: new Date() });
				fs.writeFileSync(path.resolve(dir, fileName), result);
			} else {
				vscode.window.showErrorMessage(`读取${filePath}失败，${err.toString()}`);
				throw err;
			}
		});
	});
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const userTplList: tplItem[] = vscode.workspace.getConfiguration().get('createComponent.userTpl') as tplItem[];

	let disposable = vscode.commands.registerCommand('extension.createComponent', async (uri) => {
		const watcher = fs.watch(uri.fsPath, async function(e: any, name: any) {
			watcher.close();

			const dir = path.resolve(uri.fsPath, name);
			let fileMap: string[] = [];
			const tplName = await vscode.window.showQuickPick(userTplList.map((item) => item.name));
			fileMap = userTplList.filter((item) => item.name === tplName)[0].paths;
			createFiles(fileMap, name, dir);
		});

		vscode.commands.executeCommand('explorer.newFolder');
	});

	// 创建默认组件
	let disposable2 = vscode.commands.registerCommand('extension.createDefaultComponent', async (uri) => {
		const watcher = fs.watch(uri.fsPath, async function(e: any, name: any) {
			watcher.close();

			const dir = path.resolve(uri.fsPath, name);

			const userDefault = userTplList.filter((item) => item.default);
			const hasUserDefault = userDefault.length;

			let fileMap: string[] = [];
			if (hasUserDefault) {
				// 用户指定了默认项
				fileMap = userDefault[0].paths;
			} else {
				const tplName = await vscode.window.showQuickPick(userTplList.map((item) => item.name));
				fileMap = userTplList.filter((item) => item.name === tplName)[0].paths;
			}

			createFiles(fileMap, name, dir);
		});

		vscode.commands.executeCommand('explorer.newFolder');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
