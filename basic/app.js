const http = require("http");

function rqListener(req, res) {
  console.log(req.url);
  console.log(req.method);
  console.log(req.headers);

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello Node World</h1></body>");
  res.write("</html>");
  res.end();
}

const server = http.createServer(rqListener);

server.listen(3000);
