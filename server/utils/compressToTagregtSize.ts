import sharp from "sharp";

const compressToTargetSize = async (
  inputBuffer: Buffer,
  targetSize: number,
  outputFormat: "jpeg" | "png" | "webp" = "jpeg",
): Promise<Buffer> => {
  let minQ = 1;
  let maxQ = 95;
  
  let bestBuffer: Buffer | null = null;
  let smallestBuffer: Buffer | null = null;

  while (minQ <= maxQ) {
    const mid = Math.floor((minQ + maxQ) / 2);
    const output = await sharp(inputBuffer)
      .toFormat(outputFormat, { quality: mid })
      .toBuffer();

    if (!smallestBuffer || output.length < smallestBuffer.length) {
      smallestBuffer = output;
    }

    if (output.length <= targetSize) {
      bestBuffer = output;
      minQ = mid + 1; // Try to get better quality
    } else {
      maxQ = mid - 1; // Decrease quality
    }
  }

  // If we couldn't meet target size, return the smallest we got
  if (!bestBuffer) {
    return smallestBuffer || inputBuffer;
  }

  return bestBuffer;
};

export default compressToTargetSize;
