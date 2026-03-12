//#region src/differ.d.ts
type ContinuSketchDiffResult<TPatch> = {
  type: "equal";
} | {
  type: "patch";
  patch: TPatch;
};
interface ContinuSketchDiffer<TIn, TPatch> {
  /**
   * Diff two inputs and produce a patch that when applied to `a` produces `b`.
   *
   * @param a First input
   * @param b Second input
   * @returns A diff result indicating whether the inputs are equal or a patch to transform `a` into `b`.
   */
  diff(a: TIn, b: TIn): ContinuSketchDiffResult<TPatch>;
  /**
   * Apply a patch to an input to produce a new output.
   *
   * @param input Input to apply the patch to.
   * @param patch Patch to apply.
   * @returns The result of applying the patch to the input.
   */
  apply(input: TIn, patch: TPatch): TIn;
}
//#endregion
//#region src/transformer.d.ts
interface ContinuSketchTransformer<TOut, TIn = string> {
  /**
   * Decodes the input file contents into an object.
   *
   * @param input The encoded file contents to decode
   * @returns The decoded object
   */
  decode(input: TIn): TOut;
  /**
   * Encodes the output object into a file contents string.
   *
   * @param oldContents The old file contents to use as a base for encoding
   * (i.e. when the decoding strips away some headers, that will be needed to reconstruct the output)
   * @param output Data in the encoded format
   * @returns The encoded file contents
   */
  encode(oldContents: TIn, output: TOut): TIn;
}
declare class ContinuSketchDefaultTransformer<T> implements ContinuSketchTransformer<T, T> {
  decode(input: T): T;
  encode(output: T): T;
}
//#endregion
//#region src/stragey.d.ts
declare abstract class ContinuSketchFormatStrategy<T, TPatch, TIn = string> {
  readonly transformer: ContinuSketchTransformer<T, TIn>;
  readonly differ: ContinuSketchDiffer<T, TPatch>;
  protected constructor(transformer: ContinuSketchTransformer<T, TIn>, differ: ContinuSketchDiffer<T, TPatch>);
  decode(a: TIn): T;
  diff(a: T, b: T): TPatch | null;
  diffInputs(a: TIn, b: TIn): TPatch | null;
  apply(a: TIn, patch: TPatch): TIn;
}
//#endregion
//#region src/formats/excalidraw.d.ts
type ExcalidrawBoard = Record<string, unknown>;
type ExcalidrawData = {
  prefix: string;
  suffix: string;
  compressed: boolean;
  excalidraw: ExcalidrawBoard;
};
type ExcalidrawDiff = ExcalidrawData;
declare class ExcalidrawFormatStrategy extends ContinuSketchFormatStrategy<ExcalidrawData, ExcalidrawDiff, string> {
  constructor();
}
//#endregion
//#region src/formats/fallback.d.ts
declare class FallbackStrategy extends ContinuSketchFormatStrategy<string, string, string> {
  constructor();
}
//#endregion
export { ContinuSketchDefaultTransformer, type ContinuSketchDiffResult, type ContinuSketchDiffer, ContinuSketchFormatStrategy, type ContinuSketchTransformer, type ExcalidrawData, type ExcalidrawDiff, ExcalidrawFormatStrategy, FallbackStrategy };
//# sourceMappingURL=index.d.mts.map