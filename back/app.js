const express = require('express');
const app = express();

const postRouter = require('./routes/post');

app.get('/', (req, res) => {
  res.send('hello express');
});

app.get('/api', (req, res) => {
	res.send('hello api');
})

app.get('/api/posts', (req, res) => {
	res.json([
		{id: 1, content: 'hello'},
		{id: 2, content: 'hello2'},
		{id: 3, content: 'hello3'},
	]);
});

app.use('/post', postRouter);

app.listen(3065, () => {
	console.log('Server running on port 3065');
})