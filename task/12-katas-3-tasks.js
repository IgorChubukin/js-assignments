'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    puzzle.forEach(elem => elem = elem.split(''));

    function getNeighbours(point) {
        const neighbours = [];

        if (point.i != 0) {
            neighbours.push({i: point.i - 1, j: point.j});
        }
        if (point.j != 0) {
            neighbours.push({i: point.i, j: point.j - 1});
        }
        if (point.i != puzzle.length - 1) {
            neighbours.push({i: point.i + 1, j: point.j});
        }
        if (point.j != puzzle[0].length - 1) {
            neighbours.push({i: point.i, j: point.j + 1});
        }

        return neighbours;
    }

    function isSnakingString(point, string, trace) {
        if (string == '') {
            return true;
        }

        const neighbours = getNeighbours(point);
        let newTrace = trace;
        newTrace.push(point);
        for (let neighb of neighbours) {
            if (puzzle[neighb.i][neighb.j] == string[0] &&
                trace.find(elem => elem.i == neighb.i && elem.j == neighb.j) == undefined &&
                isSnakingString(neighb, string.slice(1), newTrace))
            {
                return true;
            }
        }
        return false;
    }

    const headCandidates = [];
    for (let i = 0; i < puzzle.length; i++) {
        for (let j = 0; j < puzzle[0].length; j++) {
            if (puzzle[i][j] == searchStr[0]) {
                headCandidates.push({i: i, j: j});
            }
        }
    }
    for (let candidate of headCandidates) {
        if (isSnakingString(candidate, searchStr.slice(1), [])) {
            return true;
        }
    }
    return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function permute(chars) {
        if (chars.length == 1) {
            return chars;
        } else if (chars.length == 2) {
            return [chars, chars[1] + chars[0]];
        } else {
            const permutations = [];
            chars.split('').forEach(
                function (char, index, array) {
                    let sub = [].concat(array);
                    sub.splice(index, 1);
                    permute(sub.join('')).forEach(
                        function (permutation) {
                            permutations.push(char + permutation);
                        });
                });
            return permutations;
        }
    }

    for (let permutation of permute(chars)) {
        yield permutation;
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let profit = 0;
    let i = quotes.length;

    while (--i && quotes[i] < quotes[i - 1]) {
        quotes.pop();
    }
    while (quotes.length) {
        const higher = quotes.reduce((higher, elem, index) => higher = elem > quotes[higher] ? index : higher, 0);
        for (i = 0; i < higher; i++) {
            profit += quotes[higher] - quotes[i];
        }
        quotes = quotes.slice(higher + 1);
    }

    return profit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
        "abcdefghijklmnopqrstuvwxyz"+
        "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
    encode: function (url) {
        let key = urlStorage.store(url);

        if (!key) {
            return this.urlAllowedChars[0];
        }
        const short = [];
        const base = this.urlAllowedChars.length;
        while (key) {
            short.push(this.urlAllowedChars[key % base]);
            key /= base;
        }
        return short.reverse().join('');
    },

    decode: function (short) {
        const base = this.urlAllowedChars.length;
        let key = 0;
        for (let char of short) {
            key = key * base + this.urlAllowedChars.indexOf(char);
        }
        return urlStorage.access(key);
    }
}

function UrlStorage() {
    this.urls = new Map();
    this.key = 0;
}

UrlStorage.prototype = {
    store: function (url) {
        this.urls.set(this.key, url);
        return this.key++;
    },
    access: function (key) {
        return this.urls.get(key);
    }
};

const urlStorage = new UrlStorage();

module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};