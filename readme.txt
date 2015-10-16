=== Plugin Name ===
Contributors: maxwellberkel
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: admin, admin bar, dashboard, debug, debugging, error_log, errors, log, log viewer, plugin, wordpress
Requires at least: 3.9
Tested up to: 4.3.1
Stable tag: 0.13.0

Easily search, sort and group log entries.  Click the log file with one click.  See new errors automatically without refreshing.

== Description ==

WP Log viewer makes debugging your Wordpress site easy and stress free.

= Features =

Some features of this plugin.

* Admin bar widget
* Clear log with one click
* Group and list views
* Sort entries by date
* Auto refresh
* Realtime search
* Error color legend
* Debugging status, size and last modified
* Dashboard widget

= Admin Bar Widget =

The admin bar widget gives you glanceable information such as debug log mode and error count where ever you are in wp-admin.  You will always know when there are errors and can access the log viewer with on click for additional details.

This is one of my favourite features.

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

= Debug Status =

Debugging status is located at the top of the viewer and admin bar to make it easy to see if debugging is enabled or disabled.

You can also see log size and last modified timestamp.  This information automatically updates when changed.

= Dashboard Widget =

This widget gives you a quick summary regarding how many and what type of errors are in the log view.  You can also access the log viewer with just one click.


== Installation ==

This section describes how to install the WP Log Viewer plugin and get it working.

1. Install WP Log Viewer automatically, or by downloading and uploading the zip file
2. Activate the plugin through the 'Plugins' menu in WordPress
3. To to Tools in the sidebar and you will see the link for the "Log Viewer".  You can also click on the "Debug Log" link in the admin bar

= Requirements =
* PHP 5.4.0 or greater
* Wordpress 3.9 or above


== Frequently Asked Questions ==

= How to I access the plugin? =

Once activated, you can access the plugin one of 3 ways:

1. Click on the "Debug Log" link in the admin bar
1. Click on "Tools" in the sidebar, then click on "Log Viewer"
1. Click on "Dashboard", then from the dashboard click the link in the widget

= Do I need to refresh the log viewer? =

No.  The log viewer will automatically refresh and display new entries every 15 seconds by default.  This feature is implemented using AJAX to avoid reloading the entire page.

= What is Group View? =

In Group View similar error entries are grouped together making it much easier to see unique errors and when they happened.

= What is the count in the admin bar? =

The count shown in the admin bar represent the number of unique errors in the log.  So if there are 10 entries for the same error, it will only count as 1.

= What is Simulation mode? =

If the plugin cannot determine whether WP_DEBUG is enabed but you know that it is enabled, start the simulation mode.  In simulation mode the log viewer will work like normal under the assumption that WP_DEBUG is enabled.

This feature is handy for those with complex wp-config.php files.

= What is the minimum length for a search query? =

When using the realtime search, the search query must be atleast 3 characters or more in length.


== Screenshots ==

1. Grouped view makes it easy to see unique errors
1. Get notified automatically when there is a new error, no need to refresh
1. Realtime search makes it easy to find what you are looking for
1. Dashboard widget with glanceable information

== Changelog ==

All notable changes will be tracked in this change log.

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