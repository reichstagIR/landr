import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    cacheComponents: true,
    reactCompiler: true,
    serverExternalPackages: ["esbuild-wasm"],
};

export default nextConfig;
