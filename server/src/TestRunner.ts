import { TextDocument, Position } from 'vscode-languageserver-protocol';
import Parser, { Test } from './Parser';
import _files from './Filesystem';
import { Process } from './Process';
import { PathLike } from 'fs';
import URI from 'vscode-uri';

export class TestRunner {
    private phpBinary = '';
    private phpUnitBinary = '';
    private args: string[] = [];
    private lastArgs: string[] = [];

    constructor(
        private process = new Process(),
        private files = _files,
        private parser = new Parser()
    ) {}

    setPhpBinary(phpBinary: PathLike | URI) {
        this.phpBinary = this.files.asUri(phpBinary).fsPath;

        return this;
    }

    setPhpUnitBinary(phpUnitBinary: PathLike | URI) {
        this.phpUnitBinary = this.files.asUri(phpUnitBinary).fsPath;

        return this;
    }

    setArgs(args: string[]) {
        this.args = args;

        return this;
    }

    async runSuite() {
        return await this.doRun();
    }

    async runDirectory(textDocument: TextDocument) {
        return await this.doRun([
            this.files.dirname(this.files.asUri(textDocument.uri).fsPath),
        ]);
    }

    async runFile(textDocument: TextDocument) {
        return await this.doRun([this.files.asUri(textDocument.uri).fsPath]);
    }

    async runNearest(textDocument: TextDocument, position?: Position) {
        const tests: Test[] = this.parser.parseTextDocument(textDocument);
        const line = position && position.line ? position.line : 0;

        let test = tests.find(test => {
            const start = test.range.start.line;
            const end = test.range.end.line;

            return test.kind === 'class'
                ? start >= line || end <= line
                : test.kind !== 'class' && end >= line;
        });

        return test ? await this.doRun(test.asArguments()) : '';
    }

    async runLast(textDocument: TextDocument, position?: Position) {
        if (this.lastArgs.length === 0) {
            return await this.runNearest(textDocument, position);
        }

        return await this.doRun(this.lastArgs);
    }

    async run(
        method: string,
        textDocument?: TextDocument,
        position?: Position
    ) {
        const map = {
            suite: 'runSuite',
            directory: 'runDirectory',
            file: 'runFile',
            last: 'runLast',
            nearest: 'runNearest',
        };

        method = method
            .replace(/^phpunit\.lsp\.test\.(run)?/, '')
            .toLowerCase();

        method = map[method] || 'runNearest';

        return await this[method](textDocument, position);
    }

    async doRun(args: string[] = []) {
        this.lastArgs = args;

        const [phpBinary, phpUnitBinary] = await Promise.all([
            await this.getPhpBinary(),
            await this.getPhpUnitBinary(),
        ]);

        const command = [phpBinary, phpUnitBinary]
            .concat(this.args, args)
            .filter(arg => !!arg);

        return await this.process.run({
            title: 'PHPUnit LSP',
            command: command.shift(),
            arguments: command,
        });
    }

    private async getPhpBinary(): Promise<string> {
        if (this.phpBinary) {
            return this.phpBinary;
        }

        return await this.files.findup(['php']);
    }

    private async getPhpUnitBinary(): Promise<string> {
        if (this.phpUnitBinary) {
            return this.phpUnitBinary;
        }

        return await this.files.findup(['vendor/bin/phpunit', 'phpunit']);
    }
}
