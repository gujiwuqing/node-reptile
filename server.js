import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import {resolve, join} from 'path';
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util'
import * as fs from "fs";

let num = 1
let url = `http://qianye88.com/cate12/${num}.html`
const response = await fetch(url);
const body = await response.text();

const downLoadImg = async (url, index) => {
  const streamPipeline = promisify(pipeline);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  try {
    fs.statSync(join(resolve(), 'img'));
  } catch (e) {
    fs.mkdirSync('img')
  }
  await streamPipeline(response.body, createWriteStream(`./img/${num}-${index}.png`));
}
const $ = cheerio.load(body)
// const imgs = []
$('.item a img').each(function (i) {
  downLoadImg($(this).attr('data-original'), i+1)
})




