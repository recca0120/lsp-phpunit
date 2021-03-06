const commands = {
    executeCommand: jest.fn(),
    registerTextEditorCommand: jest.fn(),
};

const workspace = {
    getConfiguration: () => {
        return {
            get: function() {},
        };
    },
    onDidChangeConfiguration: () => {},
};

export { workspace, commands };

export enum ProgressLocation {
    Notification = 15,
}

export class Uri {
    static parse(path: string) {
        return path;
    }
}

export class EventEmitter {
    fire(...args: any[]) {
        return args;
    }
    dispose() {}
}
