const express = require("express");
const multer = require("multer");
const fs = require("node:fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

let musicList = [];
let currentId = 1;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const dir = "./public/music";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (_req, file, cb) {
    const safeName = file.originalname.replaceAll(/\s+/g, "_").toLowerCase();
    cb(null, safeName);
  },
});
const upload = multer({ storage: storage });

app.post("/music", upload.single("musicFile"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File musik wajib diupload!" });
    }

    const musicName = req.body.name || "Untitled Music";

    const musicPath = `./public/music/${req.file.filename}`;

    const newMusic = {
      id: currentId++,
      name: musicName,
      path: musicPath,
    };

    musicList.push(newMusic);

    res.status(201).json({
      message: "Musik berhasil diupload!",
      data: newMusic,
    });
  } catch (error) {
    console.log("Error saat proses upload:", error);
    res.status(500).json({ message: "Terjadi kesalahan internal server" });
  }
});

app.get("/music", (_req, res) => {
  res.status(200).json(musicList);
});

app.listen(PORT, () => {
  console.log(`Server Simple Music API berjalan di http://localhost:${PORT}`);
});
