/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "undefined",
  }
};
