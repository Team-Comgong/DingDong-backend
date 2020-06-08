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
            'http://ncov.mohw.go.kr', 'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EC%' +
                    '95%88%EC%96%918%EB%8F%99+%EB%82%A0%EC%94%A8&oquery=%EB%82%A0%EC%94%A8&tqi=UWWx' +
                    'YdprvOsssOukGWCssssss4d-249462',
            'https://m.stock.naver.com/',
            'https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=%EB%' +
                    '8B%AC%EB%9F%AC&oquery=%EB%AF%B8%EA%B5%AD+%EB%8B%AC%EB%9F%AC&tqi=UW3bswprvh8ssS' +
                    'p3kdCsssssse4-282187'
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
                            result.push('오늘의 안양 날씨 : ' + $(
                                '#main_pack > div.sc.cs_weather._weather > div:nth-child(2) > div.weather_box >' +
                                ' div.weather_area._mainArea > div.today_area._mainTabContent > div.main_info >' +
                                ' div > p'
                            ).text() + ' ' + $(
                                '#main_pack > div.sc.cs_weather._weather > div:nth-child(2) > div.weather_box >' +
                                ' div.weather_area._mainArea > div.today_area._mainTabContent > div.main_info >' +
                                ' div > ul > li:nth-child(1) > p'
                            ).text());
                            break;
                        case 2:
                            result.push(
                                '코스피 : ' + $('#boxDashboard > ul > li:nth-child(1) > a > span').text() +
                                '코스닥 : ' + $('#boxDashboard > ul > li.up > a > span').text()
                            );
                            break;
                        case 3:
                            result.push('오늘의 달러 환율 : ' + $(
                                '#_cs_foreigninfo > div > div.contents03_sub > div > div.c_rate > div > div.rat' +
                                'e_spot._rate_spot > div.rate_tlt > h3 > a > span.spt_con.dw'
                            ).text());
                            break;
                        default:
                            console.log('index error');
                            break;
                    }
                })

        }
        console.log(result);

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
        return null;
    });
