export interface ContinuSketchTransformer<TOut, TIn = string> {
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

export class ContinuSketchDefaultTransformer<
  T,
> implements ContinuSketchTransformer<T, T> {
  decode(input: T): T {
    return input;
  }

  encode(output: T): T {
    return output;
  }
}
