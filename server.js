const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '/build/') });
});
app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
  console.log('listening on port ', server.address().port);
});
