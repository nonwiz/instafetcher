const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const app = express();

// Begin : only_required_for_local
const https = require('https'); // only required for local
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const server = https.createServer({key: key, cert: cert}, app);
server.listen(process.env.PORT);
// End : only_required_for_local

const getPosts = async (accessToken) => {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,permalink,timestamp,media_url&access_token=${accessToken}`
    const posts = await fetch(url).then(d => {
        return d.json()
    });
    const { data } = posts;
    return data;
}

app.get('/', async (req, res) => {
    res.send("Hello World");
});

async function postData(url = '', data = {}) {
    const encoded = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: encoded
    })
    return resp.json();
}

app.get('/secret', async (req, res) => {
    const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTA_CLIENT}&redirect_uri=${process.env.REDIRECT_URL}&scope=user_profile,user_media&response_type=code`
    res.redirect(url);
});

app.get("/auth", async (req, res) => {
    const {code} = req.query;
    const access = await postData(
        'https://api.instagram.com/oauth/access_token',
        {
            client_id: process.env.INSTA_CLIENT,
            client_secret: process.env.INSTA_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.REDIRECT_URL,
            code: code
        });
    res.send(`<pre>${JSON.stringify({access, code}, null, 2)}</pre>`);
});

app.get("/posts", async (req, res) => {
    const { access } = req.query;
    if (!access) {
        return res.error("Missing 'access' on the url parameter");
    }
    const posts = await getPosts(access);
    return res.json(posts);
})

module.exports = app;