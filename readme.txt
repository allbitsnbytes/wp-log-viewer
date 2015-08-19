=== Plugin Name ===

Contributors: maxwellberkel
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl.html
Tags: debug, log viewer, debugging, error_log, debug.log
Requires at least: 3.9
Tested up to: 4.3
Stable tag: 0.12.1

Wordpress plugin to make reviewing, analyzing and managing the debug.log file easier.

== Description ==

Wordpress plugin to make reviewing, analyzing and managing the debug.log file easier.

## Features

Some features of this plugin.

- Admin bar widget
- Clear log with one click
- Group and list views
- Sort entries by date
- Auto refresh
- Debugging status, size and last modified
- Dashboard widget

### Admin Bar Widget

The admin bar widget gives you glanceable information such as debug log mode and error count where ever you are in wp-admin.  You will always know when there are errors and can access the log viewer with on click for additional details.

This is one of my favourite features.

### Clear Log 

Easily clear your debug.log file with one click.

### Group View

Log entries are group making it much easier to see each unique error.  You can click to list the date and times when the error occured.  Grouped entries can be sorted by newest or latest.

### List View
	
All log entries are listed by date and time and can be sorted by newest or latest.

### Sort By Date

Log entries can be sorted by date by newest or latest in either list or group views.

### Automatic Refresh

Log automatically refreshes to display new errors.  No need to manually refresh the screen.  However, there is a link to manually refresh if desired.

### Debug Status

Debugging status is located at the top of the viewer and admin bar to make it easy to see if debugging is enabled or disabled.  
	
You can also see log size and last modified timestamp.  This information automatically updates when changed.

### Dashboard Widget

This widget gives you a quick summary regarding how many and what type of errors are in the log view.  You can also access the log viewer with just one click.


== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload `wp-log-viewer` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress


== Frequently Asked Questions ==

= Do I need to refresh the log viewer? =

No.  The log viewer will automatically refresh and display new entries every 15 seconds by default.  This feature is implemented using AJAX to avoid reloading the entire page.

= What is simulation mode? =

If the plugin cannot determine whether WP_DEBUG is enabed but you know that it is enabled, start the simulation mode.  In simulation mode the log viewer will work like normal under the assumption that WP_DEBUG is enabled.

This feature is handy for those with complex wp-config.php files.


