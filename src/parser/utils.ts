/**
 * #### Checks the `source` string section from `start` to `end` on containing any symbol except ' ', '\n', '\r' and '\t'.
 *
 *
 *
 * @param {string} source source string to be checked.
 *
 * @param {number} start start position of part of string that is checking (including).
 *
 * @param {number} end end position of part of string that is checking (excluding).
 *
 * @returns {boolean} `true`, if the `source` contains any symbol expect empty symbols. Otherwise returns `false`.
 *
 *
 *
 * @example
 *
 * ```typescript
 * const string = '\t    abcdef \n';
 * checkHasContent(string, 0, string.length); // `true`, because the string contains non empty symbols
 * ```
 *
 * @example
 *
 * ```typescript
 * const string = '\t \r\n\      \r\n';
 * checkHasContent(string, 0, string.length); // `false`, because the string contains only empty characters
 *
 *
 *
 *
 * ```
 */
export const checkHasContent = (
    source: string,

    start: number,

    end: number,
): boolean => {
    let pos = start;

    while (pos < end) {
        const char = source[pos];

        if (char !== ' ' && char !== '\n' && char !== '\r' && char !== '\t') {
            return true;
        }

        pos++;
    }

    return false;
};

/**
 * #### Checks if the character in `source[pos]` stands on start of line.
 *
 * #### Used for detecting new line in parser for `Heading`, `BlockQuote`, `List`, `FencedCodeBlock`
 *
 *
 * @param source Source string to be checked.
 * @param minPos Min position of `source` that is treated as the start of `source`.
 * @param pos Position in `source` to start from.
 *
 * @returns {boolean} `true` if `source[pos]` stands on new line or `false` if `source[pos]` stands in the middle of line or in the end.
 *
 *
 * @example
 * For what the `checkStartOfLine` used in parser:
 * ```markdown
 * some text in line ### heading
 * ```
 * `checkStartOfLine` will check if the heading here starts with new line and does not have any characters before
 *
 * @example
 *
 * ```typescript
 *
 * const source = '      hello!';
 *
 * checkStartOfLine(source, 0, 6); // Returns `true`, because there are only empty characters from indexes 6 to 0 in string
 * ```
 *
 * @example
 *
 * ```typescript
 *
 * const source = '\n abcde';
 *
 *
 * checkStartOfLine(source, 0, 1); // Returns `true`, because there are only empty characters from index 2 to Line Feed in string
 * ```
 */
export const checkStartOfLine = (
    source: string,
    minPos: number,
    pos: number,
): boolean => {
    let checkPos = pos;

    while (checkPos > minPos && source[checkPos] !== '\n') {
        const char = source[checkPos];

        if (char !== ' ' && char !== '\t') {
            return false;
        }

        checkPos--;
    }

    return true;
};
