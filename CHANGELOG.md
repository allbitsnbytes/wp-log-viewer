# Change Log

All notable changes will be tracked in this change log.  This project uses [Semantic Versioning](http://semver.org/)

## [1.0.1] - 2016-01-04
### Feature

- Dashboard widget now supports custom errors

### Fix

- Fixed logic error that lead to undefined url_path error
- Fixed auto refresh not updating view

## [1.0.0] - 2015-12-30
### Feature

- One click enable/disable debugging status
- One click downloading of smart log file
- One click error filtering by clicking error legends
- Smart downloads include only the latest unique entries.  Duplicates are removed to reduce filesize and make reading the file easier
- Persist selected view, sorting across login sessions
- Settings pane added for easy management of viewer settings
- Add and edit custom error types

### UI

- Wordpress sidebar is folded to increase viewer space
- Sidebar is sticky so actions are always present when scrolling
- Updated the header to display more error messages and to use less vertical space
- Display count for each error type
- Smarter display of error legends.  Only legends with errors are displayed
- Search query is not displayed under search bar
- Increased error message area to display more horizontally which will reduce scrolling
- Made error message more readable by removing line number and file path
- Reorganized error details (type, line number and file path) to make it more space efficient

### Fix

- Fixed a bug that was breaking file path regex

## [0.13.0] - 2015-10-16
### Fix

- Disabled remote api and replaced it with Wordpress Ajax handling.  This should solve problems experienced with Multi-Tenant and extreme custom installs

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
