# IsaacOS Makefile
# Quick build commands

.PHONY: all arm64 amd64 builder clean

all: arm64 amd64

builder:
	docker build -f Dockerfile.builder -t isaacos-builder .

arm64: builder
	docker run --rm --platform linux/arm64 \
		-v "$(PWD)/output:/build/output" \
		-v "$(PWD)/build-isaacos.sh:/build/build-isaacos.sh:ro" \
		isaacos-builder /bin/bash /build/build-isaacos.sh arm64

amd64: builder
	docker run --rm --platform linux/amd64 \
		-v "$(PWD)/output:/build/output" \
		-v "$(PWD)/build-isaacos.sh:/build/build-isaacos.sh:ro" \
		isaacos-builder /bin/bash /build/build-isaacos.sh amd64

clean:
	rm -rf output/
	docker rmi isaacos-builder 2>/dev/null || true
