=== WP Log Viewer ===
Contributors: maxwellberkel
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl.html
Tags: actions, activity, activate debugging, admin, admin bar, ajax log viewer, best error log, best log viewer, best plugin, clear log, custom error, custom error types, custom reporting, dashboard, debug, debug log, debug plugin, debug theme, debug tool, debugging, development, display errors, download errors, download log, enable debugging, error, error log, error logging, error reporter, error reporting, error tracker, error tracking, errors, free, free debugging, free error log, log, log monitor, log viewer, log viewing, notifications, php errors, php error log, plugin, plugin errors, plugin testing, react, react plugin, react ui, search errors, search log, sort errors, sort log, theme errors, theme testing, track errors, widget error, widget testing, wordpress, wordpress error, wordpress error log, wp error, wp error viewer, wp log viewer, wp_debug
Requires at least: 3.9
Tested up to: 4.4
Stable tag: 1.0.1

One click enable/disable debugging, clear debug.log, search, sort, and filter errors.  See new errors automatically without refreshing.


== Description ==

WP Log viewer makes debugging your Wordpress site easy and stress free.


= Features =

Some features of this plugin.

* Admin bar widget
* Toggle debugging with a click
* Smart download
* One click error filtering
* Clear log with one click
* Group and list views
* Sort entries by date
* Auto refresh
* Realtime search
* Error color legend
* Custom errors
* Debugging status, size and last modified
* Dashboard widget
* Persistent settings

= Admin Bar Widget =

The admin bar widget gives you glanceable information such as debug log mode and error count where ever you are in wp-admin.  You will always know when there are errors and can access the log viewer with on click for additional details.

= Toggle Debugging =

Now you can enable/disable debugging with a click.  No need to manually edit wp-config.php anymore.  Go to the help section, follow the easy instructions to enable this feature and you are ready to go.

= Smart Download =

When you click to download debug.log, a smart log version will be downloaded.  What is a smart log?  It's a version of debug.log that is similar to group view.  Only a the latest unique entry for each error will be included.

This makes it much easier to analyse the file, scan for errors and skip all the redundancy.

= One Click Error Filtering =

You can filter errors with just one click on the error legend.  Click on multiple error types to filter by multiple error types.  Click a second time to deselect an error type.  This feature works great with custom errors.

= Clear Log =

Easily clear your debug.log file with one click.

= Group View =

Log entries are group making it much easier to see each unique error.  You can click to list the date and times when the error occured.  Grouped entries can be sorted by newest or latest.

= List View =

All log entries are listed by date and time and can be sorted by newest or latest.

= Sort By Date =

Log entries can be sorted by date by newest or latest in either list or group views.

= Automatic Refresh =

Log automatically refreshes to display new errors.  No need to manually refresh the screen.  However, there is a link to manually refresh if desired.

= Realtime Search =

Quickly search and find specific errors.

= Error Color Legend =

Errors are color coded to make it easier to identify certain errors such as fatal, notices, warnings, deprecated and database.

= Custom Errors =

Now you can easily define custom error messages.  When that error occures in your log file it can have it's own color coding, count and label.  Testing for custom errors or issues is now much easier.

= Debug Status =

Debugging status is located at the top of the viewer and admin bar to make it easy to see if debugging is enabled or disabled.

You can also see log size and last modified timestamp.  This information automatically updates when changed.

= Dashboard Widget =

This widget gives you a quick summary regarding how many and what type of errors are in the log view.  You can also access the log viewer with just one click.

= Persistent Settings =

Customize your log viewer to your heart's content.  Your settings such as view, sort order, sidebar folding and more persist accross logins.  When you login as your user, log viewer will be just like you left it.


== Installation ==

= From your Wordpress Dashboard =

1. Click on "Plugins > Add New" in the sidebar
2. Search for "WP Log Viewer"
3. Activate WP Log Viewer from the plugins page

= From wordpress.org =

1. Search for "WP Log Viewer"
2. Download the plugin to your local computer
3. Upload the wp-log-viewer directory to your "/wp-content/plugins" directory using your favorite ftp/sftp/scp program
4. Activate WP Log Viewer from the plugins page

= Once Activated =

Click on "Tools > Log Viewer" in the sidebar or "Debug Log" in the admin bar.

= Requirements =
* PHP 5.4.0 or greater
* Wordpress 3.9 or above


== Frequently Asked Questions ==

= How to I access the plugin? =

Once activated, you can access the plugin one of 3 ways:

1. Click on the "Debug Log" link in the admin bar
1. Click on "Tools" in the sidebar, then click on "Log Viewer"
1. Click on "Dashboard", then from the dashboard click the link in the widget

= What is debug toggling? =

This feature allows you to enable/disable debugging with a click.  No more manually updating WP_DEBUG in wp-config.php.

= How do I enable debug toggling? =

Enabling this feature is easy and takes less than a minute.

1.  In your document root, create the following file:  wplv-config.php
2.  Paste the following into wplv-config.php

<?php
if (!defined('ABSPATH')) { header('HTTP/1.0 403 Forbidden'); die; }
define('WPLV_DEBUG', false);

3.  In wp-config.php, add the following line.  Add it before the line where you define WP_DEBUG.

include_once $_SERVER['DOCUMENT_ROOT'] . '/wplv-config.php';

4.  In wp-config.php, replace the line where you define WP_DEBUG with the following

define('WP_DEBUG', defined('WPLV_DEBUG') ? WPLV_DEBUG : false);

5.  That's it.  Refresh the page in the browser and you are ready to go.


= How do I filter errors? =

Errors are grouped by error types.  These error types are listed at the top of the viewer and color coded.  You can click on any of these error to filter results by those errors.

You can click on multiple errors to limit results to only those errors.  Click a second time to deselect that error type.  This feature works great with custom errors.

= What are custom errors? =

In settings, you can define custom errors.  Each custom error has a key, label, and color.  The key is used in your error message to the logviewer can identify your custom errors.  The label and color are used to easily identify the error in the viewer.

= How do I use custom errors? =

When you write an error to the log, you have to start the error message with a # and the custom error key followed by a :.

Example:   If you defined a custom error with a key:  my-custom-error

In your code: error_log('#my-custom-error:  The error message goes here');

= Do I need to refresh the log viewer? =

No.  The log viewer will automatically refresh and display new entries every 15 seconds by default.  This feature is implemented using AJAX to avoid reloading the entire page.

= What is Group View? =

In Group View similar error entries are grouped together making it much easier to see unique errors and when they happened.

= What is the count in the admin bar? =

The count shown in the admin bar represent the number of unique errors in the log.  So if there are 10 entries for the same error, it will only count as 1.

= What is sidebar folding? =

By default the sidebar will be folded when the log viewer is active.  This increases the viewing.  To disable, or toggle this behavior, click on settings then "Fold sidebar ..."

= What is the minimum length for a search query? =

When using the realtime search, the search query must be atleast 3 characters or more in length.

= Where can I report bugs? =

Report bugs and suggest ideas at:  https://wordpress.org/support/plugin/wp-log-viewer


== Screenshots ==

1. ** Grouped view ** - Grouped view makes it easier to analyze errors and debug code
2. ** Error details ** - Error message and details are neatly displayed
3. ** Automagically refreshes ** - No need to refresh, new errors will be automatically displayed
4. ** Realtime search ** - Makes finding what you are looking for super easy
5. ** Filter errors ** - Click error types to filter results.  Only see what you need
6. ** Admin bar count ** - Easily see when you have errors.  Click to go to log viewer
7. ** Settings Pane ** - Customize your experience in one place
8. ** Help section ** - Have questions?  Get answers


== Changelog ==

All notable changes will be tracked in this change log.

= 1.0.1 =
Release date: 2016-01-04

* Feature:
	* Dashboard widget now supports custom errors

* Fix:
	* Fixed logic error that lead to undefined url_path error
	* Fixed auto refresh not updating view

= 1.0.0 =
Release date: 2015-12-30

* Feature:
	* One click enable/disable debugging status
	* One click downloading of smart log file
	* One click error filtering by clicking error legends
	* Smart downloads include only the latest unique entries.  Duplicates are removed to reduce filesize and make reading the file easier
	* Persist selected view, sorting across login sessions
	* Settings pane added for easy management of viewer settings
	* Add and edit custom error types

* UI:
	* Wordpress sidebar is folded to increase viewer space
	* Sidebar is sticky so actions are always present when scrolling
	* Updated the header to display more error messages and to use less vertical space
	* Display count for each error type
	* Smarter display of error legends.  Only legends with errors are displayed
	* Search query is not displayed under search bar
	* Increased error message area to display more horizontally which will reduce scrolling
	* Made error message more readable by removing line number and file path
	* Reorganized error details (type, line number and file path) to make it more space efficient

* Fix:
	* Fixed a bug that was breaking file path regex

= 0.13.0 =
Release date: 2015-10-16

* Fix:
	* Disabled remote api and replaced it with Wordpress Ajax handling.  This should solve problems experienced with Multi-Tenant and extreme custom installs

= 0.12.5 =
Release date: 2015-08-28

* Fix:
	* Fixed an issue where wp installs in sud directories sometimes caused the plugin not to load

= 0.12.4 =
Release date: 2015-08-26

* Fix:
	* Improved loading of needed wp core files from api file

= 0.12.3 =
Release date: 2015-08-24

* Fix:
	* Fixed a bug that cause plugin to not load  based on certain server configurations

= 0.12.2 =
Release date: 2015-08-20

* Fix:
	* Fixed a error that was causing the right debug status to not be displayed sometimes

* UI:
	* Added color indicator for PHP Deprecated and Wordpress database errors

= 0.12.1 =
Release date: 2015-08-14

* Fix:
	* Improved debugging status detection
	* Improved simulation mode detection in app, admin bar and dashboard components

= 0.12.0 =
Release date: 2015-08-14

* Feature:
	* Added debug simulation mode so when debug status can not be determined, user can still browse debug log if present
	* Added dashboard widget
	* Added admin bar menu with summary

* Fix:
	* When clearing log file, if that fails attempt to delete the file.

* UI:
	* Reformat error message to make it easier to read
	* Made search more prominent
	* Add focus to search field when log loads making it easy to search/filter entries without having to click
	* Display error type, line number and path to file on their own line making the information easier to find
	* Added count for number of entries
	* Added color coding for error types fatal, warning and notice for each entry
	* Added color coding legend
	* Admin bar widget synchs realtime as log data updates when log viewer is open

= 0.11.1 =
Release date: 2015-06-22

* Feature:
	* Added group view which groups similar errors making it easier to browse log entries

* Fix:
	* Added support for when toLocaleDateString and toLocaleTimeString are not supported.  Will instead use toDateString and toTimeString then format date/time accordingly.
	* Added support for 401 errors what debug log update checker is running.  A 401 error will not stop the auto checker.

= 0.11.0 =
Release date: 2015-06-01

* Feature:
	* Added realtime search

* UI:
	* Font Awesome support
	* Icons to sidebar links