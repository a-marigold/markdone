/**
 * #### Logs the current line of code, position in source and content in formatted output.
 * #### Used only for development.
 *
 * @param {number} codeLine The current line of code where `__parserLog__` was run.
 * @param {number} sourcePosition The current position in `source`.
 * @param {stirng} content Content to be logged.
 *
 *
 *
 */
export const __parserLog__ = (
    codeLine: number,
    sourcePosition: number,

    content?: string,
) => {
    const output =
        'Code Line: ' +
        codeLine +
        ';\n' +
        'Source Position: ' +
        sourcePosition +
        ';\n' +
        'Content: ' +
        (content ?? '') +
        ';\n\n';

    process.stdout.write(output);
};
