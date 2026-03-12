import { ExcalidrawFormatStrategy } from "../src/index.js";
import fs from "fs/promises";
import path from "path";

describe("excalidraw strategy", () => {
  it("diff the same file", async () => {
    const file = await fs.readFile(
      path.join(import.meta.dirname, "excalidraw.md"),
    );
    const fileContents = file.toString();

    const strat = new ExcalidrawFormatStrategy();
    strat.diff(fileContents, fileContents);
  });
});
