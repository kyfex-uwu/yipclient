import express from 'express';
const website = new express();

import cookieParser from 'cookie-parser';
website.use(cookieParser());

import { fileURLToPath } from 'url';
const __dirname=fileURLToPath(import.meta.url).slice(0,"/index.js".length*-1);

//--

website.use("/js", express.static(__dirname + "/js/"));
website.use("/assets/", express.static(__dirname + "/assets/", {redirect:false, index:false}));
website.get("/*", (req, res) => res.sendFile(__dirname + "/index.html"));
website.use(express.json());

website.listen(8080);
console.log("8080");