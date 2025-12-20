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
                    (user) => {
                        if (user.email == newUser.email)
                            return user
                    });

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
    else if (req.method === "GET" && req.url == "/users") {
        readFile(resolve("./users.json"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error getting users");
            }

            const users = JSON.parse(data);
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(users));
        });
    }
    //update using id
    else if (req.method === "PATCH" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2])
        let newData = ""
        req.on("data", (chunk) => {
            newData += chunk
        })
        req.on("end", () => {
            let UserUpdate = JSON.parse(newData)
            readFile(resolve("./users.json"), "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error reading users file");
                }
                const users = JSON.parse(data)
                const userExist = users.find((user) => {
                    if (user.id == id) {
                        user.age = UserUpdate.age
                        return user
                    }
                })
                if (!userExist) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ message: "id was not found" }))
                    return res.end()
                }
                writeFile(
                    resolve("./users.json"),
                    JSON.stringify(users, null, 2),
                    err => {
                        if (err) {
                            res.writeHead(500);
                            return res.end("Error saving user");
                        }

                        res.writeHead(200, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ message: "User updated successfully" }));
                    }
                );

            })
        })
    }
    //get user using id
    else if (req.method === "GET" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2])
        readFile(resolve("./users.json"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error reading users file");
            }
            const users = JSON.parse(data)
            const userExist = users.find((user) => {
                if (user.id == id) {
                    return user
                }
            })
            if (!userExist) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "id was not found" }))
                return res.end()
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(userExist))
            return res.end();
        })
    }

    else if (req.method === "DELETE" && req.url.startsWith("/users/")) {
        const id = Number(req.url.split("/")[2])
        readFile(resolve("./users.json"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error reading users file");
            }
            const users = JSON.parse(data)
            const index = users.findIndex((user) => {
                if (user.id == id) {
                    return user
                }
            })
            if (index == -1) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ message: "id was not found" }))
                return res.end()
            }
            users.splice(index, 1);
            writeFile(resolve("./users.json"), JSON.stringify(users, null, 2), err => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error saving user");
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ message: "User deleted successfully" }));
            }
            );

        })
    }
    else {
        res.writeHead(404);
        res.end("page not found");
    }
});

server.listen(port, () => {
    console.log("Server running on port", port);
});
