/**
 * Plain JS config, deliberately not .ts — a TypeScript config file needs the
 * native SWC binary to parse at build time, and that binary is broken on
 * some shared-hosting build containers (ELF/libc mismatches), which fails
 * the build before it even starts. This avoids that dependency entirely.
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
