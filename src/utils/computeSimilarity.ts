import cosineSimilarity from "compute-cosine-similarity";
import dot from "compute-dot";

const computeSimilarity = (x: number[], y: number[]): number => {
  if (process.env.SIMILARITY_MEASURE === "cosine") {
    return cosineSimilarity(x, y);
  } else if (process.env.SIMILARITY_MEASURE === "dot") {
    return dot(x, y);
  }

  throw new Error("Invalid Similarity Measure");
};

export default computeSimilarity;
