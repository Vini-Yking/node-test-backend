const http = require('http')
const hostname = '127.0.0.1';
const port = '3000'

const usersRoutes = require('./routes/users');

const CONTENT = 'Content-Type'
const APPLICATION = 'application/json'

const routes = {
	...usersRoutes,
};

function handleRequest(req, res) {
	const [path, id] = req.url.split('/').slice(1);

	let routeKey = `${req.method} /${path}`;
	if (id) {
			routeKey += '/:id';
			req.params = { id };
	}

	const routeHandler = routes[routeKey];
	if (routeHandler) {
		try {
			if (req.url === '/error') {
				throw new Error('Something went wrong!');
			}
			routeHandler(req, res);
		} catch (error) {
        console.error('Error occurred:', error.message);
        res.statusCode = 500;
        res.setHeader(CONTENT, APPLICATION);
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
		} else {
			res.statusCode = 404;
			res.setHeader(CONTENT, APPLICATION);
			res.end(JSON.stringify({ error: 'Route not found' }));
	}
}

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
	console.log(`server running on http:${hostname}:${port}`)
})