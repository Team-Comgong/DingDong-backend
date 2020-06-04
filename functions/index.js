const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions
    .region('asia-northeast1')
    .https
    .onRequest(async(request, response) => {
        const arr = ['http://ncov.mohw.go.kr', 'https://m.stock.naver.com', 'https://m.stock.naver.com/marketindex/index.nhn?menu=exchange#exchange'];
        const result = new Array();
        for (let i = 0; i < arr.length; i++) {
            await axios.get(arr[i]).then(html=>{
                const $ = cheerio.load(html.data);
                switch (i) {
                    case 0:
                        result.push($('body > div > div.mainlive_container > div.container > div > div.liveboard_layout > div.liveNumOuter > ul > li:nth-child(1) > span.data1').text());
                        break;
                    case 1:
                        result.push($('#mflick > div > div.flick-ct.dmst._tab._index_wrapper._polling > div > ul').text().replace(/^\s+|\t/g,''));
                        break;
                    case 2:
                        result.push($('#content > div > div.ct_box.intnl_major_item > ul > li:nth-child(1) > a > div.price_wrp').text().replace(/\t/g,''));
                        break;
                    default:
                        console.log('index error');
                        break;
                }
            })
            console.log(result);
        }
    });
