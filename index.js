const http = require('http')
const url = require('url')
const fs = require('fs')
const jsonPath = `${__dirname}/data/data.json`

const data = fs.readFileSync(jsonPath, 'utf-8', (error, data) => {
    const jsonReply = JSON.parse(data);
//test
  

})
  console.log(data);

http.createServer((req, res) => {
    const urlpath = req.url
    if (urlpath === '/') {
        res.writeHead(200, {
            "content-type": 'application/json'
        })
        res.end(data)
    }


 
    else if (urlpath === '/about') {
    res.end('<h1> About page </h1>')


}
else {
    res.end('<h1>Not Found</h1>')
}}
).listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})

