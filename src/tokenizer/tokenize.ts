import type { Token } from './types';

export const tokenize = (source: string): Token[] => {
    const tokens: Token[] = [];

    const sourceLength = source.length;

    let pos = 0;

    main: while (pos < sourceLength) {
        const char = source[pos];

        if (char === ' ' || char === '\t') {
            const startPos = pos;

            pos++;
            while (
                (pos < sourceLength && source[pos] === ' ') ||
                source === '\t'
            ) {
                pos++;
            }

            tokens[tokens.length] = {
                type: 'WhiteSpace',
                value: source.slice(startPos, pos),
            };

            continue main;
        }

        if (char === '\n' || char === '\r') {
            if (source[pos] === '\r') {
                pos++;
            }
            pos++;

            tokens[tokens.length] = { type: 'LineBreak', value: '\n' };
        }

        if (char === '#') {
            const startPos = pos;

            pos++;

            while (pos < sourceLength && source[pos] !== '\n') {
                pos++;
            }
            tokens[tokens.length] = {
                type: 'Heading',
                value: source.slice(startPos, pos),
            };

            continue main;
        }

        if (char === '*') {
            pos++;

            if (source[pos] === '*') {
                pos++;

                if (source[pos] === '*') {
                    const boldItalicStart = pos;

                    while (pos < sourceLength && source[pos] !== '*') {
                        pos++;
                    }

                    const contentEnd = pos - 1;

                    pos++;

                    if (source[pos] === '*' && source[pos + 1] === '*') {
                        tokens[tokens.length] = {
                            type: 'BoldItalic',

                            value: source.slice(boldItalicStart, contentEnd),
                        };

                        continue main;
                    }

                    if (source[pos] === '*') {
                    }
                }
            }
        }

        // fallback
        pos++;
    }
};
