define('social', function(require, exports, module) {
    var githubStarCount = 0;
    var githubForkCount = 0;

    var githubReady = false;
    var socialBlockQueue = [];
    function annotateSocial(socialBlock) {
        if (!githubReady) {
            if (socialBlockQueue.indexOf(socialBlock) < 0) socialBlockQueue.push(socialBlock);
            return;
        }
        var githubForks = socialBlock.querySelectorAll('.github.fork');
        for (var i = 0; i < githubForks.length; i++) githubForks[i].innerHTML = githubForkCount + ' Forks';
        var githubStars = socialBlock.querySelectorAll('.github.star');
        for (var i = 0; i < githubStars.length; i++) githubStars[i].innerHTML = githubStarCount + ' Stars';
    }

    function processReady() {
        for (var i = 0; i < socialBlockQueue.length; i++) annotateSocial(socialBlockQueue[i]);
    }

    $.get('https://api.github.com/repos/Famous/famous', function (result) {
        githubStarCount = result['stargazers_count'];
        githubForkCount = result['forks_count'];
        githubReady = true;
        processReady();
    });


    module.exports = annotateSocial;
});
