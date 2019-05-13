import { TestEventCollection } from './../src/TestEventCollection';
import { TestSuiteCollection } from './../src/TestSuiteCollection';
import { Controller } from '../src/Controller';
import { TestRunner } from '../src/TestRunner';
import { projectPath } from './helpers';

describe('Controller Test', () => {
    const path = projectPath('');

    const connection: any = {
        sendNotification: () => {},
        onNotification: () => {},
        sendRequest: () => {},
        onRequest: () => {},
    };

    const suites = new TestSuiteCollection();
    const events = new TestEventCollection();
    const testRunner = new TestRunner();
    const controller = new Controller(connection, suites, events, testRunner);
    const options = { cwd: path.fsPath };

    describe('run tests', () => {
        beforeAll(async () => {
            await suites.load(path);
        });

        beforeEach(() => {
            // spyOn(connection, 'sendNotification');
        });

        afterEach(() => {
            // expect(connection.sendNotification).toHaveBeenCalledTimes(3);
            // expect(connection.sendNotification).toHaveBeenCalledWith('started');
            // expect(connection.sendNotification).toHaveBeenCalledWith(
            //     LogMessageNotification.type,
            //     jasmine.anything()
            // );
            // expect(connection.sendNotification).toHaveBeenCalledWith(
            //     'finished'
            // );
        });

        it('run all', async () => {
            const params = {
                command: 'phpunit.lsp.run-all',
            };

            await controller.executeCommand(params, options);
        });

        // describe('run with text document', () => {
        //     const textPath = 'foo.php';
        //     const textDocument = TextDocument.create(textPath, 'php', 1, '');

        //     beforeEach(() => {
        //         spyOn(documents, 'get').and.returnValue(textDocument);
        //         spyOn(connection, 'sendRequest');
        //     });

        //     afterEach(() => {
        //         expect(documents.get).toHaveBeenCalledWith(textPath);
        //         expect(connection.sendRequest).toHaveBeenCalledWith(
        //             WillSaveTextDocumentWaitUntilRequest.type,
        //             {
        //                 textDocument: textDocument,
        //                 reason: TextDocumentSaveReason.Manual,
        //             }
        //         );
        //     });

        //     it('run file', async () => {
        //         spyOn(testRunner, 'runFile');

        //         await controller.executeCommand({
        //             command: 'phpunit.lsp.run-file',
        //             arguments: [textPath],
        //         });

        //         expect(testRunner.runFile).toHaveBeenCalledWith({
        //             textDocument,
        //         });
        //     });

        //     it('run directory', async () => {
        //         spyOn(testRunner, 'runDirectory');

        //         await controller.executeCommand({
        //             command: 'phpunit.lsp.run-directory',
        //             arguments: [textPath],
        //         });

        //         expect(testRunner.runDirectory).toHaveBeenCalledWith({
        //             textDocument,
        //         });
        //     });

        //     it('run test at cursor', async () => {
        //         const position = Position.create(0, 20);

        //         spyOn(testRunner, 'runTestAtCursor');

        //         await controller.executeCommand({
        //             command: 'phpunit.lsp.run-test-at-cursor',
        //             arguments: [textPath, position],
        //         });

        //         expect(documents.get).toHaveBeenCalledWith(textPath);
        //     });

        //     it('rerun', async () => {
        //         const position = Position.create(0, 20);
        //         spyOn(testRunner, 'rerun');

        //         await controller.executeCommand({
        //             command: 'phpunit.lsp.rerun',
        //             arguments: [textPath, position],
        //         });

        //         expect(testRunner.rerun).toHaveBeenCalledWith({
        //             textDocument,
        //             position,
        //             suites,
        //         });
        //     });
        // });
    });
});