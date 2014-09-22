var express = require('express');

var app = express();

app.use(express.static(__dirname));

var port = process.env.PORT || 6060;
app.listen(port);
console.log('Express app started on port ' + port);


module.exports = app;