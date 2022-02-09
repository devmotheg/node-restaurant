/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

const fs = require("fs"),
  http = require("http"),
  url = require("url");

const PORT_NUMBER = process.env.PORT || 8000;

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
),
  tempOverview = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
  ),
  tempProduct = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
  ),
  tempNotFound = fs.readFileSync(
    `${__dirname}/templates/template-not-found.html`,
    "utf-8"
  );

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"),
  dataObj = JSON.parse(data);

const replaceTemplate = (temp, productObj) => {
  let output = temp,
    match;
  while ((match = /{h::([^{}]+)}/.exec(output)))
    output = output.replace(match[0], productObj[match[1]]);
  return output;
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  // Overview route
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    res.end(tempOverview.replace("{h::cards}", cardsHtml));
    // Product route
  } else if (
    pathname === "/product" &&
    query.id !== undefined &&
    dataObj[query.id]
  ) {
    res.writeHead(200, { "Content-type": "text/html" });
    const productHtml = replaceTemplate(tempProduct, dataObj[query.id]);
    res.end(productHtml);
    // API route
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
    // Not found route
  } else {
    res.writeHead(404, "not found", { "Content-type": "text/html" });
    res.end(tempNotFound);
  }
});

server.listen(PORT_NUMBER);
