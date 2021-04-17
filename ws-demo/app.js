angular.module('WsDemoApp', [])
.controller('WsDemoController', function($scope, $http) {
  $scope.endPoint = 'wss://9gd7gaaro0.execute-api.ap-southeast-2.amazonaws.com/dev';
  $scope.message = 'Hello from the Client';
  $scope.restEndPoint = 'http://localhost:8082/notify';
  
  let logs = [];
  let connectionId = '';
  
  $scope.connect = function(endPoint) {
    this.websocket = new WebSocket(endPoint);

    this.websocket.onopen = (evt) => {
      console.log('onopen: ', evt);
      addTolog("CONNECTED");
    };

    this.websocket.onclose = (evt) => {
      addTolog("DISCONNECTED");
    };

    this.websocket.onmessage = (evt) => {
      console.log('onmessage: ', evt);
      let data = JSON.parse(evt.data);
      connectionId = data.connectionId;
      addTolog('RECEIVED: ' + data.message);
    };

    this.websocket.onerror = (evt) => {
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

  $scope.notify = function(restEndPoint, message) {
    let payload = {
        connectionId: connectionId,
        body: message
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