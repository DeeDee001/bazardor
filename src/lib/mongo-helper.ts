export function normalizeMongoUri(rawUri?: string): string {
  const uri = rawUri || "mongodb://127.0.0.1:27017/bazardor";

  // If this is a legacy MongoDB Atlas shard cluster string (which causes OpenSSL SSL alert 80 on Linux/Vercel):
  // Convert it automatically to standard modern SRV connection string
  if (uri.includes("ac-ckvpxin-shard") && uri.includes("6yif7dp.mongodb.net")) {
    const match = uri.match(/^mongodb:\/\/([^:]+:[^@]+)@/);
    if (match) {
      const authPart = match[1];
      return `mongodb+srv://${authPart}@cluster0.6yif7dp.mongodb.net/bazardor?retryWrites=true&w=majority&appName=Cluster0`;
    }
  }

  return uri;
}
