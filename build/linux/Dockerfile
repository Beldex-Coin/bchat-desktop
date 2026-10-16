# Builds BChat Linux packages against Ubuntu 20.04's glibc 2.31 so they run on Ubuntu 20.04 - 24.04.
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
# gcc-10/g++-10: Node 24 headers need -std=gnu++20, which focal's default GCC 9 lacks.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    build-essential gcc-10 g++-10 python3 git ca-certificates curl xz-utils rpm file binutils \
  && rm -rf /var/lib/apt/lists/*

ARG NODE_VERSION
RUN test -n "$NODE_VERSION" \
  && curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz" \
    | tar -xJ -C /usr/local --strip-components=1 \
  && npm install -g yarn@1.22.22 pnpm@10.18.1 node-gyp@12.4.0

# rustup only; the toolchain named by @signalapp/sqlcipher's rust-toolchain file is installed at
# build time (build-sqlcipher.sh). Same checksum-pinned rustup-init as upstream node-sqlcipher.
ENV CARGO_HOME=/opt/cargo RUSTUP_HOME=/opt/rustup PATH=/opt/cargo/bin:$PATH
ARG RUSTUP_SHA=ad1f8b5199b3b9e231472ed7aa08d2e5d1d539198a15c5b1e53c746aad81d27b
RUN curl -fsSL -o /tmp/rustup-init \
    https://static.rust-lang.org/rustup/archive/1.21.1/x86_64-unknown-linux-gnu/rustup-init \
  && echo "${RUSTUP_SHA}  /tmp/rustup-init" | sha256sum -c - \
  && chmod +x /tmp/rustup-init \
  && /tmp/rustup-init -y --no-modify-path --profile minimal --default-toolchain none \
  && rm /tmp/rustup-init
