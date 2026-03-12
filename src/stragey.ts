import type { ContinuSketchDiffer } from "./differ.js";
import { type ContinuSketchTransformer } from "./transformer.js";

export abstract class ContinuSketchFormatStrategy<T, TPatch, TIn = string> {
  protected constructor(
    public readonly transformer: ContinuSketchTransformer<T, TIn>,
    public readonly differ: ContinuSketchDiffer<T, TPatch>,
  ) {}

  decode(a: TIn): T {
    return this.transformer.decode(a);
  }

  diff(a: T, b: T): TPatch | null {
    const patch = this.differ.diff(a, b);
    if (patch.type === "equal") return null;
    return patch.patch;
  }

  diffInputs(a: TIn, b: TIn): TPatch | null {
    const aDecoded = this.transformer.decode(a);
    const bDecoded = this.transformer.decode(b);

    return this.diff(aDecoded, bDecoded);
  }

  apply(a: TIn, patch: TPatch): TIn {
    const aDecoded = this.transformer.decode(a);
    const result = this.differ.apply(aDecoded, patch);
    return this.transformer.encode(a, result);
  }
}
