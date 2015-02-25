//Give each thumbnail a data-yt-index attribute and handle their clicks just like any other elment
//Remove jquery dependency

var ypt_player = document.getElementById('player');
var playlistID = ypt_player.getAttribute('data-pl');
var ypt_thumbs = document.getElementById('ypt_thumbs');
var nowPlaying = "now-playing"; //For marking the current thumb
var nowPlayingClass = "." + nowPlaying;
var ypt_index = 0; //Playlists begin at the first video by default


function yptThumbHeight(){
  ypt_thumbs.style.height = document.getElementById('player').clientHeight + 'px'; //change the height of the thumb list
}
/*
  [].forEach.call( document.querySelectorAll('[data-ypt-index]'), function(el) {
   el.addEventListener('click', function() {
       console.log("clicked");
  }, false);
     });
*/

(function($) {

  $(document).on('click','[data-ypt-index]',function(e){ //Playlist items can be triggered by clicks
    ypt_index = Number($(this).attr('data-ypt-index')); //Get the ypt_index of the clicked item
    player.playVideoAt(ypt_index);  //play the iframe video at whatever index
  });


  //Change video based on thumb clicked
  $(document).on('click','#ypt_thumbs li:not(".now-playing")',function(e){ //click on a thumb that is not currently playing
    ypt_index = $('#ypt_thumbs li').index(this); //get the index of the clicked thumb
    if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)){ //if IOS
       player.cuePlaylist({ //cue is required for IOS 7
          listType: 'playlist',
          list: playlistID,
          index: ypt_index,
          suggestedQuality: 'hd720' //quality is required for cue to work, for now
          // https://code.google.com/p/gdata-issues/issues/detail?id=5411
      }); //player.cuePlaylist
    } else { //yay it's not IOS!
      player.playVideoAt(ypt_index); //Play the new video, does not work for IOS 7
    }
    $(nowPlayingClass).removeClass(nowPlaying); //Remove "now playing" from the thumb that is no longer playing
    //When the new video starts playing, its thumb will get the now playing class
 }); //$(document).on('click','#ypt_thumbs...

})(jQuery); //end (function($) {

// Loads the IFrame Player API code asynchronously.
var tag = document.createElement('script'); //Add a script tag
tag.src = "https://www.youtube.com/iframe_api"; //Set the SRC to get the API
var firstScriptTag = document.getElementsByTagName('script')[0]; //Find the first script tag in the html
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag); //Put this script tag before the first one

var player;
function onYouTubeIframeAPIReady() { // This function creates an <iframe> (and YouTube player) after the API code downloads.
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    playerVars: 
    {
      listType:'playlist',
      list: playlistID
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
} //onYouTubeIframeAPIReady() 

Event.listen = function (eventName, callback) {
    if(document.addEventListener) {
        document.addEventListener(eventName, callback, false);
    } else {    
        document.documentElement.attachEvent('onpropertychange', function (e) {
            if(e.propertyName  == eventName) {
                callback();
            }            
        });
    }
}

Event.trigger = function (eventName) {
    if(document.createEvent) {
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        document.dispatchEvent(event);
    } else {
        document.documentElement[eventName]++;
    }
}
 
// The API calls this function when the player's state changes.
function onPlayerStateChange(event) { //Creating some events 

  var currentIndex = player.getPlaylistIndex();
  var the_thumbs = ypt_thumbs.getElementsByTagName('li');
  var currentThumb = the_thumbs[currentIndex];

  if (event.data == YT.PlayerState.PLAYING) { //A video is playing

    for (var i = 0; i < the_thumbs.length; i++) { //Loop through the thumbs
      the_thumbs[i].className = ""; //Remove nowplaying from each thumb
    }
    currentThumb.className = nowPlaying; //this will also erase any other class belonging to the li
    //need to do a match looking for now playing
  }
  //if a video has finished, and the current index is the last video, and that thumb has the nowplaying class
  if (event.data == YT.PlayerState.ENDED && currentIndex == ypt_thumbs.length - 1 && ypt_thumbs[currentIndex].className == nowPlaying){ 
      Event.trigger('playlistEnd');
   }
} //function onPlayerStateChange(event) 

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  yptThumbHeight(); //Set the thumb height
  //Get the playlist data
  var playListURL = 'http://gdata.youtube.com/feeds/api/playlists/' + playlistID + '?v=2&alt=json&callback=?';
  jQuery(function($) {
  $.getJSON(playListURL, function(data) {
      var list_data= "";
      $.each(data.feed.entry, function(i, item) {
          var feedTitle = item.title.$t;
          var feedURL = item.link[1].href;
          var fragments = feedURL.split("/");
          var videoID = fragments[fragments.length - 2];
          var thumb = "http://img.youtube.com/vi/"+ videoID +"/mqdefault.jpg";
          list_data += '<li><p>' + feedTitle + '</p><span><img alt="'+ feedTitle +'" src="'+ thumb +'"</span></li>';
      });
      $(list_data).appendTo(ypt_thumbs);
  });
  });
}

window.addEventListener('resize', function(event){
      yptThumbHeight(); //change the height of the thumblist
});