#!/bin/bash

# Copyright Tomer Figenblat.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#     http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

##############################################################################
############################ Usage Instructions ##############################
##############################################################################

show_usage() {
  echo "Script for automating semantic version bumps based on conventional commits"
  echo "--------------------------------------------------------------------------"
  echo "Usage: -h/--help"
  echo "Usage: [options]"
  echo ""
  echo "Options:"
  echo "--label, Optionally set a development build label"
  echo "  defaults to '.dev'"
  echo "--changelog, Optionally create a new changelog-X.md (X the next version)"
  echo "  defaults to 'false'"
  echo "--preset, Optionally set the preset for creating the change log"
  echo "  defaults to 'conventionalcommits'"
  echo "--outputtype, can be either 'stdout' or 'file', file name is 'version-bumper-output'"
  echo "  defaults to 'stdout'"
  echo "--repopath, the path of the git repository to work with"
  echo "  defaults to './'"
  echo ""
  echo "Full example:"
  echo "--label .dev --changelog true --preset conventionalcommits"
  echo ""
  echo "Output when the latest tag is 2.1.16 will be:"
  echo "2.1.17 2.1.18.dev"
  echo ""
}

if [[ ($1 == "--help") || $1 == "-h" ]]; then
  show_usage
  exit 0
fi

##############################################################################
############################# Prepare Workspace ##############################
##############################################################################

# utility function for incrementations
increment() { echo $(("$1" + 1)); }

# iterate over arguments and create named parameters
while [ $# -gt 0 ]; do
  if [[ $1 == *"--"* ]]; then
    param="${1/--/}"
    declare $param="$2"
  fi
  shift
done

# default named parameters
label=$(echo "${label:-.dev}" | xargs)
changelog=${changelog:-false}
preset=${preset:-conventionalcommits}
outputtype=${outputtype:-stdout}
repopath=${repopath:-./}

# verify git repository
if [ ! $(git rev-parse --is-inside-work-tree 2>&1) ]; then
  echo "volume is not a git repository workspace"
  exit 1
fi

# step into repopath
cd $repopath

##############################################################################
################################ Bump Version ################################
##############################################################################

# use git-semver-tags to get the latest semver tag
last_semver=$(git-semver-tags | head -n 1)

# if no tags found, set 1.0.0 as initial version
if [[ $last_semver == "" ]]; then
  new_version="1.0.0"
else
  # else read the semantic parts from the latest tag
  read last_major last_minor last_patch <<<$(sed "s/\./ /g" <<<$last_semver)

  # use conventional-recommended-bump to get the next bump recommendation
  rec_bump=$(conventional-recommended-bump -p conventionalcommits -t "")

  # create the next semver version based on the bump recomendation
  if [ $rec_bump = "major" ]; then
    # bump major preserving the v prefix if exists
    if [[ $last_major == v* ]]; then
      new_version=v$(increment $(cut -c 2- <<<$last_major)).0.0
    else
      new_version=$(increment $last_major).0.0
    fi
  elif [ $rec_bump = "minor" ]; then
    # bump minor
    new_version=$last_major.$(increment $last_minor).0
  else
    # bump patch
    new_version=$last_major.$last_minor.$(increment $last_patch)
  fi
fi

##############################################################################
######################### Next Development Iteration #########################
##############################################################################

# get the new version semantic parts
new_major_minor=$(cut -f1,2 -d"." <<<$new_version)
new_patch=$(cut -d"." -f3- <<<$new_version)

# increment the new patch part
next_patch=$(increment $new_patch)

# concatenate the new major, minor, and next patch parts with the build label
next_iteration=$new_major_minor.$next_patch$label

##############################################################################
################################## Changelog #################################
##############################################################################

# if changelog requested
if "$changelog"; then
  # remove previous changelog-x.md file
  rm -f changelog-$new_version.md

  # create a temporary release context file
  echo "{\"version\": \"$new_version\"}" >release-context-$new_version.json

  # use conventional-change-log to generate the changelog-*.md file
  conventional-changelog -p $preset -t "" -c release-context-$new_version.json -o changelog-$new_version.md

  # delete the temporary release context file
  rm -f release-context-$new_version.json
fi

##############################################################################
############################### Output Results ###############################
##############################################################################

if [ $outputtype = "stdout" ]; then
  echo $new_version $next_iteration
elif [ $outputtype = "file" ]; then
  echo $new_version $next_iteration >version-bumper-output
else
  echo "unknown outputtype"
  show_usage
  exit 1
fi

exit 0
