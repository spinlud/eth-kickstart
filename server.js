const { createServer } = require('http');
const next = require('next');

const app = next({
    dev: process.env.NODE !== 'production'
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    createServer(async (req, res) => {
        return await handle(req, res);
    }).listen(3000, (err) => {
        if (err) {
            throw err;
        }

        console.log(`Server listening on port 3000...`);
    });
});
