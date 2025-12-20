const http = require("node:http");
const { resolve } = require("node:path");
const { readFile, writeFile } = require("node:fs");

const port = 3000;

const server = http.createServer((req, res) => {

    //  POST users 
    if (req.method === "POST" && req.url === "/users") {
        let newData = "";

        req.on("data", chunk => {
            newData += chunk;
        });

        req.on("end", () => {
            let newUser;
            try {
                newUser = JSON.parse(newData);
            } catch {
                res.writeHead(400);
                return res.end("Invalid JSON");
            }

            readFile(resolve("./users.json"), "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error reading users file");
                }

                const users = JSON.parse(data);

                const userExist = users.find(
                    user => user.email === newUser.email
                );

                if (userExist) {
                    res.writeHead(409, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        message: "email already exists"
                    }));
                }

                users.push(newUser);

                writeFile(
                    resolve("./users.json"),
                    JSON.stringify(users, null, 2),
                    err => {
                        if (err) {
                            res.writeHead(500);
                            return res.end("Error saving user");
                        }

                        res.writeHead(201, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({
                            message: "User added successfully"
                        }));
                    }
                );
            });
        });
    }

    //  GET users 
    else if (req.method === "GET" && req.url === "/users") {
        readFile(resolve("./users.json"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error getting users");
            }

            const users = JSON.parse(data);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(users));
        });
    }
    else if (req.method==="PATCH" && req.url=="/users"){
        
    }

    else {
        res.writeHead(404);
        res.end("Route not found");
    }
});

server.listen(port, () => {
    console.log("Server running on port", port);
});
