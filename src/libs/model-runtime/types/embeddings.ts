export interface EmbeddingsPayload {
  /**
   * The number of dimensions the resulting output embeddings should have. Only
   * supported in `text-embedding-3` and later models.
   */
  dimensions?: number;

  /**
   * The format to return the embeddings in.
   * `float`: Return the embeddings as a list of floats for `nomic-embed-text`, `bge-m3` etc.
   * `base64`: Return the embeddings as a base64-encoded string for `text-embedding-3`
   */
  encoding_format?: 'float' | 'base64';

  /**
   * Input text to embed, encoded as a string or array of tokens. To embed multiple
   * inputs in a single request, pass an array of strings .
   * The input must not exceed the max input tokens for the model (8192 tokens for
   * `text-embedding-ada-002`), cannot be an empty string, and any array must be 2048
   * dimensions or less.
   */
  input: string | Array<string>;

  model: string;
}

export interface EmbeddingsOptions {
  headers?: Record<string, any>;
  signal?: AbortSignal;
  /**
   * userId for the embeddings
   */
  user?: string;
}

/**
 * The embedding vector, which is a list of floats. The length of vector depends on
 * the model as listed in the
 * [embedding guide](https://platform.openai.com/docs/guides/embeddings).
 */
export type Embeddings = Array<number>;
