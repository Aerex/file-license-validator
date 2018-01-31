#!/bin/bash
set -x

echo "Running pre-release checks and scans"
CURRENT_PKG_VER=`node -e "console.log(require('./package.json').version);"`
echo "Determining current version: ${CURRENT_PKG_VER}"
LINE="bumping version in package.json from ${CURRENT_PKG_VER} to"
PKG_VER_NEXT=$(standard-version --dry-run | grep 'package.json from' | awk -v FS="${LINE}" -v OFS="" '{$1 = ""; print}')
PKG_VER_NEXT="$(echo -e "${PKG_VER_NEXT}" | tr -d '[:space:]')"

echo "Determining next version: ${PKG_VER_NEXT}"

USER_EMAIL=$(git --no-pager show -s --format='%ae' "${TRAVIS_COMMIT}")
USER_NAME=$(git --no-pager show -s --format='%an' "${TRAVIS_COMMIT}")

git config user.email "${USER_EMAIL}"
git config user.name "${USER_NAME}"

npm run version
git push --follow-tags origin master
