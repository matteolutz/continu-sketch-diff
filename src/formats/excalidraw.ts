import type {
  ContinuSketchDiffer,
  ContinuSketchDiffResult,
} from "../differ.js";
import { ContinuSketchFormatStrategy } from "../stragey.js";
import type { ContinuSketchTransformer } from "../transformer.js";
import { findFirstCodeBlock } from "../utils/markdown.js";
import LZString from "lz-string";
import { removeNewlines } from "../utils/text.js";

export type ExcalidrawBoard = Record<string, unknown>;
export type ExcalidrawData = {
  prefix: string;
  suffix: string;
  compressed: boolean;

  excalidraw: ExcalidrawBoard;
};

export type ExcalidrawDiff = ExcalidrawData;

class ExcalidrawFormatTransformer implements ContinuSketchTransformer<
  ExcalidrawData,
  string
> {
  private getExcalidrawJson(
    codeBlock: string,
    codeLanguage: string,
  ): ExcalidrawBoard | null {
    switch (codeLanguage) {
      case "json":
        return JSON.parse(codeBlock);
      case "compressed-json":
        const decomp = LZString.decompressFromBase64(removeNewlines(codeBlock));
        return JSON.parse(decomp);
      default:
        return null;
    }
  }

  private stringifyExcalidrawJson(
    board: ExcalidrawBoard,
    compressed: boolean,
  ): string {
    if (!compressed) return JSON.stringify(board);

    const compressedJson = LZString.compressToBase64(JSON.stringify(board));

    let result = "";
    const chunkSize = 256;
    for (let i = 0; i < compressedJson.length; i += chunkSize) {
      result += compressedJson.slice(i, i + chunkSize) + "\n\n";
    }

    return result.trim();
  }

  decode(input: string): ExcalidrawData {
    const codeBlock = findFirstCodeBlock(input)!;
    const board = this.getExcalidrawJson(
      codeBlock.code,
      codeBlock.codeLanguage,
    )!;

    return {
      prefix: codeBlock.prefix,
      suffix: codeBlock.suffix,
      compressed: codeBlock.codeLanguage === "compressed-json",
      excalidraw: board,
    };
  }

  encode(_oldContents: string, output: ExcalidrawData): string {
    const board = this.stringifyExcalidrawJson(
      output.excalidraw,
      output.compressed,
    );

    return `${output.prefix}\`\`\`${output.compressed ? "compressed-json" : "json"}\n${board}\n\`\`\`${output.suffix}`;
  }
}

class ExcalidrawFormatDiffer implements ContinuSketchDiffer<
  ExcalidrawData,
  ExcalidrawDiff
> {
  diff(
    _a: ExcalidrawData,
    b: ExcalidrawData,
  ): ContinuSketchDiffResult<ExcalidrawDiff> {
    // for now, let's just return the entire new contents
    // as the diff
    return { type: "patch", patch: b };
  }

  apply(_input: ExcalidrawData, patch: ExcalidrawDiff): ExcalidrawData {
    // currently, the patch is the entire new contents
    // so we return it directly
    return patch;
  }
}

export class ExcalidrawFormatStrategy extends ContinuSketchFormatStrategy<
  ExcalidrawData,
  ExcalidrawDiff,
  string
> {
  constructor() {
    super(new ExcalidrawFormatTransformer(), new ExcalidrawFormatDiffer());
  }
}
