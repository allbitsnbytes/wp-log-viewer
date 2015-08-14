# Change Log

All notable changes will be tracked in this change log.  This project uses [Semantic Versioning](http://semver.org/)

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
