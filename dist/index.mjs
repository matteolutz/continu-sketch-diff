import LZString from "lz-string";
//#region src/transformer.ts
var ContinuSketchDefaultTransformer = class {
	decode(input) {
		return input;
	}
	encode(output) {
		return output;
	}
};
//#endregion
//#region src/stragey.ts
var ContinuSketchFormatStrategy = class {
	constructor(transformer, differ) {
		this.transformer = transformer;
		this.differ = differ;
	}
	decode(a) {
		return this.transformer.decode(a);
	}
	diff(a, b) {
		const patch = this.differ.diff(a, b);
		if (patch.type === "equal") return null;
		return patch.patch;
	}
	diffInputs(a, b) {
		const aDecoded = this.transformer.decode(a);
		const bDecoded = this.transformer.decode(b);
		return this.diff(aDecoded, bDecoded);
	}
	apply(a, patch) {
		const aDecoded = this.transformer.decode(a);
		const result = this.differ.apply(aDecoded, patch);
		return this.transformer.encode(a, result);
	}
};
//#endregion
//#region src/utils/markdown.ts
/**
* Finds the first code block in the given markdown text
* and also returns the prefix and suffix of the block.
* If no code block is found, returns null.
*
* @param text input markdown
*/
const findFirstCodeBlock = (text) => {
	const match = /(.*)\`\`\`((\w|-)+)\n(.*?)\n\`\`\`(.*)/s.exec(text);
	if (!match) return null;
	const prefix = match[1];
	const codeLanguage = match[2];
	return {
		code: match[4],
		codeLanguage,
		prefix,
		suffix: match[5]
	};
};
//#endregion
//#region src/utils/text.ts
/**
* Removes any \n or \r characters from the string.
*/
const removeNewlines = (str) => {
	return str.replace(/[\n\r]/g, "");
};
//#endregion
//#region src/formats/excalidraw.ts
var ExcalidrawFormatTransformer = class {
	getExcalidrawJson(codeBlock, codeLanguage) {
		switch (codeLanguage) {
			case "json": return JSON.parse(codeBlock);
			case "compressed-json":
				const decomp = LZString.decompressFromBase64(removeNewlines(codeBlock));
				return JSON.parse(decomp);
			default: return null;
		}
	}
	stringifyExcalidrawJson(board, compressed) {
		if (!compressed) return JSON.stringify(board);
		const compressedJson = LZString.compressToBase64(JSON.stringify(board));
		let result = "";
		const chunkSize = 256;
		for (let i = 0; i < compressedJson.length; i += chunkSize) result += compressedJson.slice(i, i + chunkSize) + "\n\n";
		return result.trim();
	}
	decode(input) {
		const codeBlock = findFirstCodeBlock(input);
		const board = this.getExcalidrawJson(codeBlock.code, codeBlock.codeLanguage);
		return {
			prefix: codeBlock.prefix,
			suffix: codeBlock.suffix,
			compressed: codeBlock.codeLanguage === "compressed-json",
			excalidraw: board
		};
	}
	encode(_oldContents, output) {
		const board = this.stringifyExcalidrawJson(output.excalidraw, output.compressed);
		return `${output.prefix}\`\`\`${output.compressed ? "compressed-json" : "json"}\n${board}\n\`\`\`${output.suffix}`;
	}
};
var ExcalidrawFormatDiffer = class {
	diff(_a, b) {
		return {
			type: "patch",
			patch: b
		};
	}
	apply(_input, patch) {
		return patch;
	}
};
var ExcalidrawFormatStrategy = class extends ContinuSketchFormatStrategy {
	constructor() {
		super(new ExcalidrawFormatTransformer(), new ExcalidrawFormatDiffer());
	}
};
//#endregion
//#region src/differ.ts
var ContinuSketchDefaultDiffer = class {
	diff(a, b) {
		if (a === b) return { type: "equal" };
		return {
			type: "patch",
			patch: b
		};
	}
	apply(_input, patch) {
		return patch;
	}
};
//#endregion
//#region src/formats/fallback.ts
var FallbackStrategy = class extends ContinuSketchFormatStrategy {
	constructor() {
		super(new ContinuSketchDefaultTransformer(), new ContinuSketchDefaultDiffer());
	}
};
//#endregion
export { ContinuSketchDefaultTransformer, ContinuSketchFormatStrategy, ExcalidrawFormatStrategy, FallbackStrategy };

//# sourceMappingURL=index.mjs.map