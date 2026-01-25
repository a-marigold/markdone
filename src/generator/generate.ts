import type { Token } from '../parser';

import type { MarkdownCSSClasses } from './types';
import {
    OPENED_SPAN,
    CLOSED_SPAN,
    OPENED_CODE,
    CLOSED_CODE,
    OPENED_PRE,
    CLOSED_PRE,
    defaultCssClasses,
} from './constants';

/**
 *
 * @param tokens
 * @param cssClasses
 *
 * @returns
 */
export const generate = (
    tokens: Token[],

    cssClasses: MarkdownCSSClasses,
): string => {
    let generated = '';

    const tokensLength = tokens.length;

    let tokenPos = 0;

    while (tokenPos < tokensLength) {
        const currentToken = tokens[tokenPos];

        if (currentToken.type === 'WhiteSpace') {
            generated +=
                OPENED_SPAN +
                defaultCssClasses.whitespace +
                ' ' +
                cssClasses.whitespace +
                '">' +
                currentToken.value +
                CLOSED_SPAN;

            tokenPos++;

            continue;
        }

        if (currentToken.type === 'Heading') {
            let headingNumber = 0;

            while (
                headingNumber < currentToken.value.length &&
                currentToken.value[headingNumber] === '#'
            ) {
                headingNumber++;
            }

            generated +=
                '<h' +
                headingNumber +
                ' ' +
                'class="' +
                cssClasses.heading +
                '">' +
                currentToken.value.slice(headingNumber + 1) +
                '</h' +
                headingNumber +
                '>';

            tokenPos++;

            continue;
        }

        if (currentToken.type === 'CodeBlock') {
            generated +=
                OPENED_CODE +
                cssClasses.codeBlock +
                '">' +
                currentToken.value +
                CLOSED_CODE;

            tokenPos++;

            continue;
        }

        if (currentToken.type === 'FencedCodeBlock') {
            generated +=
                OPENED_PRE +
                cssClasses.fencedCodeBlock +
                '">' +
                '<code>' +
                currentToken.value +
                CLOSED_CODE;

            tokenPos++;

            continue;
        }

        // fallback

        tokenPos++;
    }

    return generated;
};
