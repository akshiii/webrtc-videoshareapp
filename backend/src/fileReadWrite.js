const fs = require("fs");

/**
 * Reading a file
 */
fs.readFile("./textFile.txt", (error, data) => {
  if (error) {
    console.log("Got error:", error);
  }
  if (data) {
    console.log("Got data: ", data.toString());
  }
});
console.log("End of file");

/**
 * Writing a file
 */
let content = "I am a content wow";
fs.writeFile("new_File.txt", content, (err) => {
  if (err) console.log("Got error in writing: ", err);
  else console.log("Saved");
});

/**
 * Append file
 */
let newContent = "New content hai woWW";
fs.appendFile("new_File.txt", newContent, (err) => {
  if (err) {
    console.log("Some error", err);
  } else {
    console.log("New content saved");
  }
});

/**
 * Delete a file
 */
fs.unlink("./textFile.txt", () => {});
