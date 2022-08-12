import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import {resolve, join} from 'path';
import {createWriteStream} from 'node:fs';
import {pipeline} from 'node:stream';
import {promisify} from 'node:util';
import * as fs from 'fs';


const result_list = [];

const downLoadImg = async (url, index) => {
    const streamPipeline = promisify(pipeline);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
    try {
        fs.statSync(join(resolve(), 'img'));
    } catch (e) {
        fs.mkdirSync('img')
    }
    await streamPipeline(response.body, createWriteStream(`./img/${index}.png`));
}


const downLoadPictures = async (url, index) => {
    try {
        for (let i = 0; i < result_list.length;i++){
            console.log(`开始下载第${i + 1}张图片!`);
            await downLoadImg(result_list[i].url,i);
            await sleep(3000 * Math.random());
            console.log(`第${i + 1}张图片下载成功!`);
        }
        return Promise.resolve();
    }catch (e) {
        console.log('写入数据失败');
        return Promise.reject(e)
    }
};

const sleep = (time) => {
    return new Promise((resolve) => {
        console.log(`自动睡眠中，${time / 1000}秒后重新发送请求......`);
        setTimeout(() => {
            resolve();
        }, time);
    });
};


const getPageData = async ()=>{
    try {
        let num = 1;
        let url = `http://qianye88.com/cate12/${num}.html`;
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        $('.item a img').each(function (i) {
            result_list.push({
                url:$(this).attr('data-original'),
                title:$(this).attr('alt')
            })
        });
        return Promise.resolve(result_list);
    }catch (e) {

    }
}

getPageData().then(res=>{
    downLoadPictures(res)
})
