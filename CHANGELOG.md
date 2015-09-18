# Change Log

All notable changes will be tracked in this change log.  This project uses [Semantic Versioning](http://semver.org/)

## Unreleased
### Fix

- Fixed issue to improve support for installes with custom plugin directory name

## [0.12.5] - 2015-08-28
### Fix

- Fixed an issue where wp installs in sud directories sometimes caused the plugin not to load

## [0.12.4] - 2015-08-26
### Fix

- Improved loading of needed wp core files from api file

## [0.12.3] - 2015-08-24
### Fix

- Fixed a bug that cause plugin to not load  based on certain server configurations

## [0.12.2] - 2015-08-20
### Fix

- Fixed a error that was causing the right debug status to not be displayed sometimes

### UI

- Added color indicator for PHP Deprecated and Wordpress database errors

## [0.12.1] - 2015-08-14
### Fix

- Improved debugging status detection
- Improved simulation mode detection in app, admin bar and dashboard components

## [0.12.0] - 2015-08-14
### Feature

- Added debug simulation mode so when debug status can not be determined, user can still browse debug log if present
- Added dashboard widget
- Added admin bar menu with summary

### Fix

- When clearing log file, if that fails attempt to delete the file.

### UI

- Reformat error message to make it easier to read
- Made search more prominent
- Add focus to search field when log loads making it easy to search/filter entries without having to click
- Display error type, line number and path to file on their own line making the information easier to find
- Added count for number of entries
- Added color coding for error types fatal, warning and notice for each entry
- Added color coding legend
- Admin bar widget synchs realtime as log data updates when log viewer is open

## [0.11.1] - 2015-06-22
### Feature

- Added group view which groups similar errors making it easier to browse log entries

### Fix

- Added support for when toLocaleDateString and toLocaleTimeString are not supported.  Will instead use toDateString and toTimeString then format date/time accordingly.
- Added support for 401 errors what debug log update checker is running.  A 401 error will not stop the auto checker.

## [0.11.0] - 2015-06-01
### Feature

- Added realtime search

### UI

- Font Awesome support
- Icons to sidebar links
