import { ContinuSketchDefaultDiffer } from "../differ.js";
import { ContinuSketchFormatStrategy } from "../stragey.js";
import { ContinuSketchDefaultTransformer } from "../transformer.js";

export class FallbackStrategy extends ContinuSketchFormatStrategy<
  string,
  string,
  string
> {
  constructor() {
    super(
      new ContinuSketchDefaultTransformer(),
      new ContinuSketchDefaultDiffer(),
    );
  }
}
