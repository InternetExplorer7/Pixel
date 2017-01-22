var translate = require('@google-cloud/translate')({
    projectId: 'striped-orbit-156403',
    keyFilename: './keyfile.json'
});

// Get a list of supported languages. 
translate.getLanguages(function(err, languages) {
    if (!err) {
        // languages = [ 
        //   'af', 
        //   'ar', 
        //   'az', 
        //   ... 
        // ] 
    }
});

// Promises are also supported by omitting callbacks. 
translate.getLanguages().then(function(data) {
    var languages = data[0];
});

// translate.toSpanish = function(text, cb) {
//     if (cb) {
//         return translate.translate(text, 'es', cb);
//     }
//     return translate.translate(text, 'es');
// };

translate.to = function(text, lang, cb) {
    if (cb) {
        return translate.translate(text, lang, cb);
    }
    return translate.translate(text, lang);
};

module.exports = translate;