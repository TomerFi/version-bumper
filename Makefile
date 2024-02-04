# Copyright Tomer Figenblat.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

default: single

VERSION ?= $(strip $(shell bash entrypoint.sh | cut -f1 -d" " | xargs ))
IMAGE_NAME ?= tomerfi/version-bumper
IMAGE_BUILDER ?= podman

GIT_COMMIT = $(strip $(shell git rev-parse --short HEAD))
CURRENT_DATE = $(strip $(shell date -u +"%Y-%m-%dT%H:%M:%SZ"))
FULL_IMAGE_NAME = $(strip $(IMAGE_NAME):$(VERSION))

PLATFORMS = linux/amd64,linux/arm/v7,linux/arm64/v8

single:
	$(IMAGE_BUILDER) build \
	--build-arg VCS_REF=$(GIT_COMMIT) \
	--build-arg BUILD_DATE=$(CURRENT_DATE) \
	--build-arg VERSION=$(VERSION) \
	--tag $(FULL_IMAGE_NAME) \
	--tag $(IMAGE_NAME):latest .

multi: enable-multiarch
	$(IMAGE_BUILDER) buildx build \
	--build-arg VCS_REF=$(GIT_COMMIT) \
	--build-arg BUILD_DATE=$(CURRENT_DATE) \
	--build-arg VERSION=$(VERSION) \
	--platform $(PLATFORMS) \
	--tag $(FULL_IMAGE_NAME) \
	--tag $(IMAGE_NAME):latest .

lint:
	$(IMAGE_BUILDER) run --rm \
	-e RUN_LOCAL=true -e IGNORE_GITIGNORED_FILES=true -e IGNORE_GENERATED_FILES=true \
	-e VALIDATE_DOCKERFILE=true -e VALIDATE_EDITORCONFIG=true -e VALIDATE_GITHUB_ACTIONS=true \
	-e VALIDATE_MARKDOWN=true -e VALIDATE_YAML=true -e VALIDATE_SHELL_SHFMT=true \
	-v $PWD:/tmp/lint ghcr.io/github/super-linter:slim-v4

enable-multiarch:
	$(IMAGE_BUILDER) run --rm --privileged multiarch/qemu-user-static --reset -p yes

.PHONY: single multi lint enable-multiarch
