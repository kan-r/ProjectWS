<!--
title: 'Connected service websocket for realtime updates'
description: 'AWS API Gate Websocket implementation for feed management realtime updates'
framework: v1
platform: AWS
language: nodeJS
-->

# Simple Websockets

* Deploy the example service.
* connect to the outputted wss url using `wscat`:

```
wscat -c <wss-url>
```

* Connection should fail. If you try again, this time specifying an `Auth` header:

```
wscat -c <wss-url> -H Auth:secret
```


