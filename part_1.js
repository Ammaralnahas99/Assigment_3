//1)
const fs = require("node:fs")
const path = require("node:path")
const zlib = require("node:zlib");
const { pipeline } = require("node:stream");

// const q1 = function () {
//     const stream = fs.createReadStream(path.resolve("./destination.txt"), { encoding: "utf8", highWaterMark: 50 })
//     stream.on("data", (chunk) => {
//         console.log(chunk)
//     })
//     stream.on("end", () => {
//         console.log("Finished reading file");
//     });
// }
// q1();

//2)
// const q2 = function () {
//     const readStream = fs.createReadStream(path.resolve("./source.txt"), { encoding: "utf8", highWaterMark: 50 })
//     const writeStream = fs.createWriteStream(path.resolve("./destination.txt"), { encoding: "utf8", highWaterMark: 50 })
//     readStream.on("data", (chunk) => {
//         writeStream.write(chunk)
//     })
//     readStream.on("error", err => {
//         console.error("Read error:", err);
//     });

//     writeStream.on("error", err => {
//         console.error("Write error:", err);
//     });
// }
// q2();

//3)
// const q3 = function () {
//     const readStream = fs.createReadStream("./data.txt");
//     const gzipStream = zlib.createGzip();
//     const writeStream = fs.createWriteStream("./data.txt.gz");

//     pipeline(readStream, gzipStream, writeStream, (err) => {
//         if (err) {
//             console.error("Pipeline failed:", err);
//         } else {
//             console.log("File compressed successfully");
//         }
//     }
//     );
// };
// q3()