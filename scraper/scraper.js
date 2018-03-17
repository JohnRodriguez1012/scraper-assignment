exports.scraper = (function() { 

    const request = require('request');
    const cheerio = require('cheerio');
    const path = require('path');

    var scrapetarget = require(path.join(__dirname, './scrapetarget.js'));

    scraper = {
        heading: scrapetarget.heading,
        origin: scrapetarget.origin,
        targets: scrapetarget.targets,
        targetIdx: -1,
    };

    let $;

    scraper.scrapeIt = function(db, callback) {

        request(scraper.origin, function(error, response, html) {
            
            $ = cheerio.load(html);

            var issueID = $('div.i > h1 > a').text();

            db.IssueModel.findOne({'issue': issueID.trim()})
            .exec(function (err, doc) {
                if(err) throw err;
                if(!doc) {
                    var tmp = db.IssueModel({issue: issueID.trim()});
                    tmp.save(function (err, doc) {
                        if (err) return console.error(err);           
                        for(scraper.targetIdx = 0; scraper.targetIdx < scraper.targets.length; scraper.targetIdx++) {
                            scrapeTarget(db, doc._id, scraper.targets[scraper.targetIdx].category, scraper.targets[scraper.targetIdx].tag);
                        }
                        callback(true);
                    });
                } else callback(false);
            });
        });
    };


    function scrapeTarget(db, issueId, cat, targ) {
        console.log('issueId = '+issueId);
        $('div.issue__body > section.'+targ+' > div.i > div.item').each(function(i, element) {
            var newScrape = {
                category: cat,
                link: $("h3.item__title", element).html(),
                title: $("h3.item__title", element).text(),
                body: $("p", element).text(),
                image: $("a > img", element).parent().html(),
                issue: issueId
            };
            
            newScrape.link = addTarget(newScrape.link, '_blank');
            console.log(newScrape.link);
            
            var tmp = new db.ItemModel(newScrape);
            tmp.save(function (err, doc) {
                if (err) return console.error(err);
                db.IssueModel.findOneAndUpdate({_id: issueId},
                                               {$push:{'items':doc._id, $sort: 1}}, 
                                               {new: true}, 
                    function(err, newIssue) {
                        console.log(newIssue);
                    }
                );
            });
        });
    };
    
    function addTarget(link, target) {
        var pos1  = link.search('>');
        var front = link.substring(0, pos1);
        var back  = link.substring(pos1, link.length);
        var temp = front + ' target="' + target + '"' + back;
        return temp;
    };

    return scraper;
})();