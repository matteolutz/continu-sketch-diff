export type ContinuSketchDiffResult<TPatch> =
  | {
      type: "equal";
    }
  | {
      type: "patch";
      patch: TPatch;
    };

export interface ContinuSketchDiffer<TIn, TPatch> {
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

export class ContinuSketchDefaultDiffer<T> implements ContinuSketchDiffer<
  T,
  T
> {
  diff(a: T, b: T): ContinuSketchDiffResult<T> {
    if (a === b) {
      return { type: "equal" };
    }

    return { type: "patch", patch: b };
  }

  apply(_input: T, patch: T): T {
    return patch;
  }
}
