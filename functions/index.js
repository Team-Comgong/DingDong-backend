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
    .onRequest(async (request, response) => {
        const arr = [
            'http://ncov.mohw.go.kr', 'https://m.stock.naver.com', 'https://m.stock.naver.com/marketindex/item.nhn?marketindexCd=FX_USDKRW&menu=ex' +
                    'change'
        ];
        const result = new Array();
        for (let i = 0; i < arr.length; i++) {
            await axios
                .get(arr[i])
                .then(html => {
                    const $ = cheerio.load(html.data);
                    switch (i) {
                        case 0:
                            result.push('코로나 일일 확진자 : ' + $(
                                'body > div > div.mainlive_container > div.container > div > div.liveboard_layo' +
                                'ut > div.liveNumOuter > ul > li:nth-child(1) > span.data1'
                            ).text());
                            break;
                        case 1:
                            result.push(
                                $('#mflick > div > div.flick-ct.dmst._tab._index_wrapper._polling > div > ul').text().replace(/^\s+|\t/g, '')
                            );
                            break;
                        case 2:
                            result.push('오늘의 달러 환율 : ' + $(
                                '#header > div.major_info_wrp.no_chart.no_code > div.major_info > div.stock_wrp' +
                                ' > div'
                            ).text().replace(/^\s+|\t/g, ''));
                            break;
                        default:
                            console.log('index error');
                            break;
                    }
                })

        }
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const name = year + '-' + month + '-' + date
        console.log('Today is : ', name);
        admin
            .database()
            .ref(name)
            .set({result});
    });
