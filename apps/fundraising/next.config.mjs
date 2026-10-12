/** @type {import('next').NextConfig} */
const nextConfig = {
  // The data room files are read from disk at request time (behind the
  // password gate), so the serverless bundles must carry them.
  outputFileTracingIncludes: {
    '/dataroom': ['./content/dataroom/**'],
    '/dataroom/[slug]': ['./content/dataroom/**'],
    '/dataroom/files/[name]': ['./content/dataroom/**'],
  },
};

export default nextConfig;
