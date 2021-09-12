#!/bin/bash

# iterate over arguments and create named parameters
while [ $# -gt 0 ]; do
	if [[ $1 == *"--"* ]]; then
		param="${1/--/}"
		if [[ $param == "changelog" ]]; then
			declare $param="true"
		else declare $param="$2"
		fi
	fi
	shift
done

# default named parameters
label=${label:-.dev}
changelog=${changelog:-false}
preset=${preset:-conventionalcommits}

# step into the repo folder
cd /usr/share/repo

# utility function for incrementing the bump number
increment() { echo $(("$1" + 1)); }

# use git-semver-tags to get the latest semver tag and read its parts seperately
last_semver=$(git-semver-tags | head -n 1)
read last_major last_minor last_patch <<<$(sed "s/\./ /g" <<<$last_semver)

# use conventional-recommended-bump to get the next bump recommendation
rec_bump=$(conventional-recommended-bump -p conventionalcommits -t "")

# create the next semver release based on the bump recomendation
if [ $rec_bump = "major" ]; then
	# bump major
	new_version=$(increment $last_major).0.0
elif [ $rec_bump = "minor" ]; then
	# bump minor
	new_version=$last_major.$(increment $last_minor).0
else
	# bump patch
	new_version=$last_major.$last_minor.$(increment $last_patch)
fi

# get next semver parts
new_major_minor=$(cut -f1,2 -d"." <<<$new_version)
new_patch=$(cut -d"." -f3- <<<$new_version)

# increment the patch part
next_patch=$(increment $new_patch)

# concatenate the new major, minor, and next patch parts with the .dev suffix
next_iteration=$new_major_minor.$next_patch$label

if "$changelog"; then
	# remove previous CHANGELOG.md file
	rm -f CHANGELOG.md

	# create a temporary release context file
	echo "{\"version\": \"$new_version\"}" >release-context.json

	# use conventional-change-log to generate the CHANGELOG.md file
	conventional-changelog -p $preset -t "" -c release-context.json -o CHANGELOG.md

	# delete the temporary release context file
	rm -f release-context.json
fi

# return results
echo $new_version $next_iteration

