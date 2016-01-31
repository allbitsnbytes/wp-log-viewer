#!/bin/bash
#
# Helper script for managing plugin tasks


# Error codes
readonly ERR_COMMAND_MISSING=30
readonly ERR_PARAM_MISSING=35
readonly ERR_VERSION_NOT_DETECTED=40


# Variables
readonly PLUGIN_FILES=("api" "assets" "libs" "autoload.php" "humans.txt" "readme.txt" "wp-log-viewer.php")


# Display error message
#
# @params
# $1 - The message to display
err () {
  printf "\033[0;31m${1}\033[0m\n"
}


# Check if required commands are installed
check_required_commands () {
  local COMMAND
  local COMMANDS=("rsync" "zip")
  local MISSING=()

  for COMMAND in ${COMMANDS[@]}; do
    if [[ -z "$(which ${COMMAND})" ]]; then
      MISSING+=("${COMMAND}")
    fi
  done

  if [[ ${#MISSING} -gt 0 ]]; then
    err "Missing required commands."
	printf "%s\n" ${MISSING[@]}
	err "Please install to continue"
	return 1
  fi

  return 0
}


# Get current version
get_current_version () {
  local CURRENT_VERSION="$(cat wp-log-viewer.php | grep "* Version:" | cut -d: -f2 | sed -e 's/^[ \t]*//')"

  if [[ -z "${CURRENT_VERSION}" ]]; then
    err "Current version was not detected in file: wp-log-viewer.php"
    exit $ERR_VERSION_NOT_DETECTED
  fi

  echo "${CURRENT_VERSION}"
}


# Bump version number
#
# @params
# $1 - The version number to change to
#
# TODO: Check to make sure file was changed and display error if it wasn't
bump_version () {
  local NEW_VERSION=""
  local CURRENT_VERSION="$(get_current_version)"

  echo "The current version is ${CURRENT_VERSION}"

  while [[ -z "${NEW_VERSION}" ]]; do
    read -p "Enter the new version: " NEW_VERSION

	# Check if new version is SEM
	if ! [[ "${NEW_VERSION}" =~ [0-9]+.[0-9]+.[0-9]+ ]]; then
	  err "${NEW_VERSION} is not a valid SEM Version"
	  NEW_VERSION=""
	fi
  done

  # Update version in files
  sed -i "" "s/\"version\": \".*\"/\"version\": \"${NEW_VERSION}\"/" bower.json
  sed -i "" "s/\"version\": \".*\"/\"version\": \"${NEW_VERSION}\"/" package.json
  sed -i "" "s/Stable tag: .*/Stable tag: ${NEW_VERSION}/" readme.txt
  sed -i "" "s/Version: .*/Version:     ${NEW_VERSION}/" wp-log-viewer.php

  # Update timestamp in files
  sed -i "" "s/Updated: .*/Updated: $(date +%m-%d-%Y)/" humans.txt

  return 0
}


# Release copies the latest files to svn trunk, create new tag if needed, get latest from repo, add new files, then checks in changes
release () {
  local FILE
  local SRC
  local DEST="svn"
  local CURRENT_VERSION="$(get_current_version)"
  local TAG_DIR="${DEST}/tags/${CURRENT_VERSION}"
  local TRUNK_DIR="${DEST}/trunk"

  # Create new tag directory if needed
  if [[ ! -d "${TAG_DIR}" ]]; then
    echo "Making directory for tag:  ${TAG_DIR}"
    mkdir -p ${TAG_DIR}
  fi

  # Create trunk if needed
  if [[ ! -d "${TRUNK_DIR}" ]]; then
    echo "Making directory for trunk: ${TRUNK_DIR}"
	mkdir -p ${TRUNK_DIR}
  fi

  # Get latest from repo
  svn up

  # Copy files to tag and trunk directories
  for FILE in ${PLUGIN_FILES[@]}; do
    if [[ -d ${FILE} ]]; then
      SRC="${FILE}/"
    else
      SRC="${FILE}"
    fi

    rsync -arq ${SRC} ${TAG_DIR}
	rsync -arq ${SRC} ${TRUNK_DIR}
  done

  # Get list of new files and add them
  FILES_TO_ADD="$(svn stat | grep ^? | cut -d' ' -f2)"

  # If there are new files to add, add them
  if [[ -n "${FILES_TO_ADD}" ]]; then
    svn add ${FILES_TO_ADD}
  fi

  printf "\nEnter a message for checking: (q to cancel) "
  read

  if [[ "${REPLY}" != 'q' ]]; then
    svn ci -m "${REPLY}"
  fi

  return 0
}


# Creates a zip of plugin files.  This zip can then be used to install the plugin in Wordpress.
#
# @params
# $1 - The destination directory for the zip file
zip () {
  local DEST=".."
  local ZIP="$(which zip)"
  local FILENAME="${PWD##*/}.zip"

  ${ZIP} -qr ${DEST}/${FILENAME} ${PLUGIN_FILES[@]}

  return 0
}


# Check for required commands
check_required_commands

if [[ $? -ne 0 ]]; then
  exit ${ERR_COMMAND_MISSING}
fi


# Change to plugin root
cd "$(dirname "${BASH_SOURCE[0]}")/.."


# Let's perform task
case "${1}" in

  "bump" )
    bump_version
    ;;

  "release" )
    release
    ;;

  "zip" )
    zip
    ;;

  * )
    err "Please specify a task to run"
	echo "Available tasks: bump, release or zip"
	exit ${ERR_PARAM_MISSING}

esac

exit 0