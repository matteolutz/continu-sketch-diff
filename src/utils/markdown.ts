export type CodeBlock = {
  code: string;
  codeLanguage: string;

  prefix: string;
  suffix: string;
};

/**
 * Finds the first code block in the given markdown text
 * and also returns the prefix and suffix of the block.
 * If no code block is found, returns null.
 *
 * @param text input markdown
 */
export const findFirstCodeBlock = (text: string): CodeBlock | null => {
  const codeBlockRegex = /(.*)\`\`\`((\w|-)+)\n(.*?)\n\`\`\`(.*)/s;
  const match = codeBlockRegex.exec(text);

  if (!match) return null;

  const prefix = match[1]!;
  const codeLanguage = match[2]!;
  const code = match[4]!;
  const suffix = match[5]!;

  return {
    code,
    codeLanguage,
    prefix,
    suffix,
  };
};
