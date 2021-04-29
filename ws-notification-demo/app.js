angular.module('WsDemoApp', [])
.controller('WsDemoController', function($scope, $http) {
  $scope.clientId = 'Kan';
  $scope.endPoint = 'wss://2e4hcbdp5e.execute-api.ap-southeast-2.amazonaws.com/dev';
  $scope.message = 'Hello from the Client';
  $scope.restEndPoint = 'http://localhost:8082/notify';
  
  let logs = [];
  
  $scope.connect = function(endPoint, clientId) {
    const url = `${endPoint}?clientId=${clientId}`;
    console.log('connect: ', url);
    this.websocket = new WebSocket(url);

    this.websocket.onopen = (evt) => {
      console.log('onopen: ', evt);
      addTolog("CONNECTED");
    };

    this.websocket.onclose = (evt) => {
      console.log('onclose: ', evt);
      addTolog("DISCONNECTED");
    };

    this.websocket.onmessage = (evt) => {
      console.log('onmessage: ', evt);
    //   let data = JSON.parse(evt.data);
    //   addTolog('RECEIVED: ' + data.message);
      addTolog('RECEIVED: ' + evt.data);
    };

    this.websocket.onerror = (evt) => {
      console.log('onerror: ', evt);
      addTolog('ERROR: ' + evt.data);
    };
  }

  $scope.disconnect = function() {
    this.websocket.close();
  };

  $scope.send = function(message) {
    this.websocket.send(
      JSON.stringify({ action: 'message', data: message })
    );

    addTolog('SENT (WS): ' + message);
  };

  $scope.clear = function() {
    clearLog();
  };

  $scope.notify = function(restEndPoint, clientId, message) {
    let payload = {
        clientId: clientId,
        message: message
    }

    let data = JSON.stringify(payload);

    console.log(data);

    $http.post(restEndPoint, data).then((response) => {
        console.log('Notify response: ', response);
    });

    addTolog('SENT (REST): ' + message);
  }

  function addTolog(text){
    logs.push(text);
    document.getElementById('log').value = logs.join('\n\n'); 
  }

  function clearLog(){
    logs = [];
    document.getElementById('log').value = ''; 
  }
});