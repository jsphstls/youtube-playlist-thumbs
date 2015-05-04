=== Youtube Playlist Thumbs ===
Contributors: jsphstls
Donate link: http://wikimediafoundation.org/wiki/Ways_to_Give
Tags: youtube, playlist, iframe, thumbnails, video, responsive, shortcode
Requires at least: 2.8.0
Tested up to: 4.2
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Use the [ypt playlist_id=] shortcode to show a Youtube playlist with side thumbnails. Playlist videos can be triggered by links in page content.

== Description ==

[Demo](http://codepen.io/jsphstls/full/aOOqzg)

Install and activate the plugin. Insert the [ypt playlist_id=] shortcode in your page or post and insert your playlist ID ater the equal. When that content is published and viewed, a Youtube player will appear and a column of thumbnails will load to the right of the player. Clicking the thumbnails switches between videos.

This plugin includes a small CSS file for minimal styling that was written to target the specific IDs of the thumb list and player.

Youtube Playlist Thumbs plugin depends on the Youtube Iframe API. Any bugs experienced with that service will affect this plugin. Please check for bugs with Youtube Iframe API before reporting a bug for this plugin.

See "Other Notes" for usage.

== Installation ==

1. Upload `youtube-playlist-thumbs.zip` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress

== Frequently Asked Questions ==

= Why develop this plugin? =

Youtube recently changed their playlist Iframe layout so that the thumb navigation is collapsed.
Youtube Iframes, without the API, do not work well with modals and similar dynmaic elements.
The Youtube Iframe API allows player control by other page elements such as links and buttons.

= How many shortcodes can I use on one post/page? =

Just one. Youtube Iframe API is designed to work with one player at a time. Notice that on Youtube.com there is only one video player and links to multiple videos.

= How many videos can I have in a playlist? =

As of Version 0.5.0 the limit is 200, which is also the maximum number of videos that Youtube allows in one playlist.

== Screenshots ==

1. How the player should appear.
2. Using the shortcode.
3. Getting a Youtube Playlist ID.
4. Adding an element to trigger a video in the playlist.

== Changelog ==

= 0.1 =
Initial release

= 0.2 =
Improved 'playlistEnd' event.

= 0.2.5 =
More global variables for use in custom JS.

= 0.3.0 =
.js only loads if shortcode is present.

= 0.4.0 =
Thumbnail list limit raised from 25 to 50.

= 0.5.0 =
Thumbnail list limit raised to 200. Speed increase.

== Upgrade Notice ==

= 0.2 =
This update changs the way 'playlistEnd' is used.

= 0.3.0 =
Pagespeed increase.

= 0.4.0 =
Thumbnail list limit raised from 25 to 50.

= 0.5.0 =
Thumbnail list limit raised to 200. Speed increase.

== Usage ==

Place this shortcode in your posts or pages and insert your Youtube Playlist ID after the equal.

	[ypt playlist_id=]

To get a Youtube Playlist ID, copy the string after '&list=' when viewing a playlist on Youtube.com. See screenshot #3.

To trigger the playback of an ordered video in the playlist, add this attribute to the clickable element:

	data-ypt-index="X"

Where 'X' is the order number of the video with the first video starting at 0. The **third video would be 2**. For example:

	<button data-ypt-index="2">Click to play the third video.</button>

The 'Now Playing' thumbnail text and arrow is inserted by CSS. Add this rule to your CSS to change it:

	#ypt_thumbs .ypt-now-playing > span::after {
	  content: "YOUR NEW TEXT" !important;
	}

The height of the list of thumbnails is set by Javascript. It is first set when the player is ready and it adjusts when the window changes size. If you are using modals or any dynamic method to show/hide the player, you will need to trigger this function when the player is shown:

	yptThumbHeight();

For example, with Bootstrap modals:

    $('#videoModal').on('shown.bs.modal', function (e) { //modal shows
		 yptThumbHeight(); //update the thumb height
    });

A Javascript event triggers at the end of a playlist. It can used to trigger other events:

	jQuery(document).on('playlistEnd', function () { //playlist finished last video
	    alert("That's all, thanks for watching!"); //do something
	});
