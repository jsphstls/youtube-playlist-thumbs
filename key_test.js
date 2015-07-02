function verifyKey() { //Makes a single request to Youtube Data API
  var theUrl =
  'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=&key=' + document.getElementById('api_key').value;
  var xmlHttp = null;
  xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, true);
  xmlHttp.send( null );
  xmlHttp.onload = function (e) {
    var res = JSON.parse(xmlHttp.responseText);
    if(res.error.code == 404){
      document.getElementById('valid_notice').innerHTML = 'Key is valid.';
      document.getElementById('ypt_valid').value = 1;
      document.getElementById('submit').disabled = false;

    } else {
      document.getElementById('valid_notice').innerHTML = 'Key is not valid.';
      document.getElementById('submit').disabled = true;
      document.getElementById('ypt_valid').value = 0;
    }
  };
}

jQuery(function($) {

  $(document).ready(function() {
    document.getElementById('submit').disabled = true;
    verifyKey();

    $('#api_key').each(function() {
      var elem = $(this);

      // Save current value of element
      elem.data('oldVal', elem.val());

      // Look for changes in the value
      elem.bind("propertychange change click keyup input paste", function(event){
        // If value has changed...
        if (elem.data('oldVal') != elem.val()) {
          // Updated stored value
          elem.data('oldVal', elem.val());

          verifyKey();

        }
      });
    });
  });
});
