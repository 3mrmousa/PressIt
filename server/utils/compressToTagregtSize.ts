import sharp from "sharp";

const compressToTargetSize = async (
  inputBuffer: Buffer,
  targetSize: number,
  outputFormat: "jpeg" | "png" | "webp" = "jpeg",
): Promise<Buffer> => {
  let minQ = 1;
  let maxQ = 95;
  let bestBuffer: Buffer = await sharp(inputBuffer)
    .toFormat(outputFormat, { quality: maxQ })
    .toBuffer();

  while (minQ <= maxQ) {
    const mid = Math.floor((minQ + maxQ) / 2);
    const output = await sharp(inputBuffer)
      .toFormat(outputFormat, { quality: mid })
      .toBuffer();

    if (output.length <= targetSize) {
      bestBuffer = output;
      minQ = mid + 1;
    } else {
      maxQ = mid - 1;
    }
  }

  return bestBuffer;
};

export default compressToTargetSize;
