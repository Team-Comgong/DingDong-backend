const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');
const cheerio = require('cheerio');

admin.initializeApp();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions
    .https
    .onRequest((request, response) => {
        //  response.send("Hello from Firebase!");
        const getData = async () => {
            try {
                return await axios.get('https://sports.news.naver.com/kbaseball/index.nhn');
            } catch (error) {
                console.log(error);
            }
        };

        getData().then(html => {
            const $ = cheerio.load(html.data);
            const rank = $('#content > div > div.home_feature > div.feature_side > div > ol').text();
            console.log('result : ', rank);
        })
    });
