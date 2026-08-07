# IsaacOS ISO Builder Dockerfile
# Uses Debian live-build to create custom ISOs
# Works for both arm64 and amd64 architectures

FROM debian:bookworm-slim AS base

# Install build dependencies (only avail for host arch)
RUN apt-get update && apt-get install -y --no-install-recommends \
    live-build \
    debootstrap \
    xorriso \
    isolinux \
    syslinux-efi \
    mtools \
    squashfs-tools \
    cpio \
    patch \
    curl \
    wget \
    git \
    ca-certificates \
    sudo \
    dosfstools \
    fdisk \
    && rm -rf /var/lib/apt/lists/*

# Install architecture-specific grub packages
RUN arch=$(uname -m) && \
    if [ "$arch" = "aarch64" ]; then \
        apt-get update && apt-get install -y --no-install-recommends \
            grub-efi-arm64 \
            grub-efi-arm64-bin \
            && rm -rf /var/lib/apt/lists/*; \
    elif [ "$arch" = "x86_64" ]; then \
        apt-get update && apt-get install -y --no-install-recommends \
            grub-efi-amd64 \
            grub-efi-amd64-bin \
            grub-pc-bin \
            && rm -rf /var/lib/apt/lists/*; \
    fi

# Create build user and build directory
RUN useradd -m -s /bin/bash builder && echo "builder ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
RUN mkdir -p /build && chown builder:builder /build
WORKDIR /build
USER builder

# Default command - override with the architecture-specific build script
CMD ["/bin/bash"]
