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

# dogfooding
VERSION = $(strip $(shell bash entrypoint.sh | cut -f1 -d" "))

IMAGE_NAME = tomerfi/version-bumper
GIT_COMMIT = $(strip $(shell git rev-parse --short HEAD))
CURRENT_DATE = $(strip $(shell date -u +"%Y-%m-%dT%H:%M:%SZ"))
FULL_IMAGE_NAME = $(strip $(IMAGE_NAME):$(VERSION))

PLATFORMS = linux/amd64,linux/arm/v7,linux/arm64/v8

single:
	docker buildx build \
	--build-arg VCS_REF=$(GIT_COMMIT) \
	--build-arg BUILD_DATE=$(CURRENT_DATE) \
	--build-arg VERSION=$(VERSION) \
	--output type=docker \
	--tag $(FULL_IMAGE_NAME) \
	--tag $(IMAGE_NAME):latest .

multi:
	docker buildx build \
	--build-arg VCS_REF=$(GIT_COMMIT) \
	--build-arg BUILD_DATE=$(CURRENT_DATE) \
	--build-arg VERSION=$(VERSION) \
	--platform $(PLATFORMS) \
	--tag $(FULL_IMAGE_NAME) \
	--tag $(IMAGE_NAME):latest .
