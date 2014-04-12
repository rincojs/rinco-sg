<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io.connect('http://localhost');
  socket.on('refresh', function (data) {
  	if(data.action === "refresh") {
  		window.location.reload();
  	}
    	console.log(data.action);	    
  });
</script>