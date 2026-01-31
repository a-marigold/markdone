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
