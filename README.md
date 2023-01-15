# Basic Instagram Api

Minimalist Expressjs server use to obtain Authorization Code and Long term access code (60 days).

## Main Function
1. Get Authorization Code from Instagram Graph Api
2. Convert the authorization code to the long access code
3. Return the access (long live token) and authorization code back to user

## How to run it (locally)

### Prerequisite

#### Account

Create an APP on `developers.facebook.com`

#### Node libraries
- node
- node-fetch
- express
- dotenv
#### OS App 
- openssl

### Create HTTPS Server on the local
```bash
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
```
This will generate Keys and Certificate you need for the https

```bash
openssl rsa -in keytmp.pem -out key.pem
```
Copy the output of `key.pem` and `cert.pem` to your project directory

### Update ENV
Create `.env` file or rename `.env.example` to `.env`

### Run Expressjs
```bash
node ./index.js
```
or
```bash
node --watch ./index.js
```

### Connect your instagram account with the app

```http request
https://localhost:3001/secret
```
If you put `https://localhost:3001/auth` as your `Valid OAuth Redirect`

## Route:

### Starter - Hello World
```http request
GET /
```

### Access (Long live token)

```http request
GET /secret
```

1. This route will redirect you to login your instagram fetching the code.
2. It will redirect to `/auth?code=23f23...`, code that fetched from the above. And display the access code and your user id.   

### Get user posts 
```http request
GET /posts?access=g434g34g....
```

1. Access is the long live token which you obtain previously.

### Credits: 
- Nitin Patel - How to create https server: https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28
- Mark Amery & Narongdej Sarnsuwan - Fetch with Encoding Form URL: https://stackoverflow.com/a/37562814
- Get Access Token: https://developers.facebook.com/docs/instagram-basic-display-api/guides/getting-access-tokens-and-permissions