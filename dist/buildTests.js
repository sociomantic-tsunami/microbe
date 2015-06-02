(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/* global document, window, µ, $, QUnit, Benchmark  */

/**
 * benchmark tests
 *
 * @param  {str}                    _str1               test 1 name
 * @param  {func}                   _cb1                test 1
 * @param  {str}                    _str2               test 2 name
 * @param  {func}                   _cb2                test 2
 * @param  {int}                    testNum             test number
 *
 * @return {void}
 */
'use strict';

var buildTest = function buildTest(_str1, _cb1, _str2, _cb2, testNum) {
    if (typeof _cb1 !== 'function') {
        testNum = _cb1;
    }

    var µTests = µ('#qunit-tests').children()[0];

    var resDiv = µTests[testNum];

    var µLi = µ('li', resDiv);
    var µStrong = µ('strong', resDiv);
    var µResult = µ('<div.fastest>');

    resDiv.insertBefore(µResult[0], µStrong[0]);

    if (typeof _cb1 === 'function') {
        var testRes = [];
        var _arr = [];
        var i = 0;
        var libraries = ['µ', '$'];
        var suite = new Benchmark.Suite();

        suite.add(_str1, _cb1).add(_str2, _cb2).on('cycle', function (event) {
            _arr.push(this[i].hz);
            var test = testRes[i] = µ('<span.speed--result.slow>');
            µ(µLi[i]).append(test);
            test.html(String(event.target));

            i++;
        }).on('complete', function () {
            var fastest = _arr.indexOf(Math.max.apply(Math, _arr));
            testRes[fastest].removeClass('slow');

            µResult.html(libraries[fastest] + ' is the fastest');
        });

        var startTheTest = function startTheTest(e) {
            e.stopPropagation();
            e.preventDefault();
            µResult.off();
            setTimeout(function () {
                suite.run({ 'async': true });
            }, 1);
        };

        µResult.html('Click to start the speed test');
        µResult.on('click', startTheTest);
    } else {
        µResult.html(_str1).addClass('invalid--test');
    }
};

require('./init')(buildTest);
require('./pseudo')(buildTest);
require('./core')(buildTest);
require('./http')(buildTest);
require('./dom')(buildTest);
require('./events')(buildTest);
require('./observe')(buildTest);

},{"./core":2,"./dom":3,"./events":4,"./http":5,"./init":6,"./observe":7,"./pseudo":8}],2:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

'use strict';

module.exports = function (buildTest) {
    QUnit.module('core.js');

    QUnit.test('µ().version', function (assert) {
        var version = '0.3.1';

        assert.equal(µ().version, version, 'version is ' + version);

        buildTest('No speed tests available.', 18);
    });

    QUnit.test('µ().type', function (assert) {
        var type = '[object Microbe]';

        assert.equal(µ().type, type, 'type is ' + type);

        buildTest('No speed tests available.', 19);
    });

    QUnit.test('µ().length', function (assert) {
        assert.equal(µ().length, 0, 'length initializes');
        assert.equal(µ('head').length, 1, 'length reports correctly');

        buildTest('No speed tests available.', 20);
    });

    QUnit.test('.addClass()', function (assert) {
        assert.ok(µ().addClass, 'exists');

        var µMooDivs = µ('div').addClass('moo');
        var µMooDivsLength = µMooDivs.length;

        assert.equal(µMooDivsLength, µ('.moo').length, 'it added a class!');
        assert.ok(µMooDivs.get('class')[0].indexOf('moo') !== -1, 'it set the class into the data object');

        µ('.moo').removeClass('moo');

        µMooDivs = µ('div').addClass(['moo', 'for--real']).length;
        assert.equal(µMooDivs, µ('.moo.for--real').length, 'it added 2 classes from an array of strings');

        var classData = µ('.moo')[0].data['class']['class'];

        assert.ok(classData.indexOf('moo') !== -1, 'class sets data');

        µ('.moo').removeClass('moo').removeClass('for--real');

        var µDivs = µ('div');
        var $Divs = $('div');

        var resetDivs = function resetDivs() {
            for (var i = 0, lenI = µDivs.length; i < lenI; i++) {
                µDivs[i].className.replace('moo', '');
            }
        };

        buildTest('µDivs.addClass( \'moo\' )', function () {
            µDivs.addClass('moo');

            resetDivs();
        }, '$Divs.addClass( \'moo\' )', function () {
            $Divs.addClass('moo');

            resetDivs();
        }, 21);
    });

    QUnit.test('.append()', function (assert) {
        assert.ok(µ().append, 'exists');

        var µNewDiv = µ('<div.a--new--div>');
        var µTarget = µ('#example--id');

        µTarget.append(µNewDiv);
        assert.deepEqual(µNewDiv[0], µTarget.children()[0][0], 'attached microbe');
        µNewDiv.remove();

        µTarget.append(µNewDiv[0]);
        assert.deepEqual(µNewDiv[0], µTarget.children()[0][0], 'attached element');
        µNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( '<div.a--new--div>' );
        // assert.deepEqual( µ( '.a--new--div' )[0], µTarget.children()[0], 'attached by creation string' );
        // µ( '.a--new--div' ).remove();

        var µAnotherNewDiv = µ('<div.a--new--div>');

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ µNewDiv, µAnotherNewDiv ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 microbes' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        µTarget.append([µNewDiv[0], µAnotherNewDiv[0]]);
        assert.equal(µ('.a--new--div').length, 2, 'attached 2 elements');
        µNewDiv.remove();
        µAnotherNewDiv.remove();

        // NON FUNCTIONAL TEST
        // this is a future ability and cannot be tested yet
        //
        // µTarget.append( [ '<div.a--new--div>', '<div.a--new--div>' ] );
        // assert.equal( µ( '.a--new--div' ).length, 2, 'attached 2 creation strings' );
        // µNewDiv.remove();
        // µAnotherNewDiv.remove();

        var el;
        var µDiv = µ('div').first();
        var $Div = $('div').first();

        var vanillaRemove = function vanillaRemove(el) {
            el.parentNode.removeChild(el);
        };

        buildTest('µDiv.append( el )', function () {
            el = document.createElement('div');
            µDiv.append(el);

            vanillaRemove(el);
        }, '$Div.append( el )', function () {
            el = document.createElement('div');
            $Div.append(el);

            vanillaRemove(el);
        }, 22);
    });

    QUnit.test('.attr()', function (assert) {
        assert.ok(µ().attr, 'exists');

        var µTarget = µ('#example--id');

        µTarget.attr('testing', 'should work');
        assert.equal(µTarget[0].getAttribute('testing'), 'should work', 'attribute set');

        var attrGotten = µTarget.attr('testing');
        assert.equal(attrGotten[0], 'should work', 'attribute gotten');

        µTarget.attr('testing', null);
        assert.equal(µTarget[0].getAttribute('testing'), null, 'attribute removed');

        var µDivs = µ('div');
        var $Divs = $('div');

        var vanillaRemove = function vanillaRemove() {
            for (var i = 0, lenI = µDivs.length; i < lenI; i++) {
                µDivs[i].removeAttribute('moo');
            }
        };

        buildTest('µDivs.attr( \'moo\', \'moooooooooooooon\' )', function () {
            µDivs.attr('moo', 'moooooooooooooon');

            vanillaRemove();
        }, '$Divs.attr( \'moo\', \'moooooooooooooon\' )', function () {
            $Divs.attr('moo', 'moooooooooooooon');

            vanillaRemove();
        }, 23);
    });

    QUnit.test('.children()', function (assert) {
        assert.ok(µ().children, 'exists');

        var children = µ('.example--class').children();

        assert.ok(µ.isArray(children), 'returns an array');
        assert.ok(children[0].type === '[object Microbe]', 'full of microbes');
        assert.deepEqual(µ('.example--class')[0].children[0], children[0][0], 'the correct children');

        buildTest('No comparison available.', 24);
    });

    QUnit.test('.css()', function (assert) {
        assert.ok(µ().css, 'exists');

        var µTarget = µ('#example--id');

        µTarget.css('background-color', 'rgb(255, 0, 0)');
        assert.equal(µTarget[0].style.backgroundColor, 'rgb(255, 0, 0)', 'css set');

        var cssGotten = µTarget.css('background-color');
        assert.ok(µ.isArray(cssGotten), 'css get returns an array');
        assert.ok(typeof cssGotten[0] === 'string', 'full of strings');
        assert.equal(cssGotten.length, µTarget.length, 'correct amount of results');
        assert.equal(cssGotten[0], 'rgb(255, 0, 0)', 'correct result');

        µTarget.css('background-color', null);
        assert.equal(µTarget[0].style.backgroundColor, '', 'css removed');

        µTarget = µ('#example--id');
        var $Target = $('#example--id');

        buildTest('µTarget.css( \'background-color\', \'#f00\' )', function () {
            µTarget.css('background-color', '#f00');
            µTarget.css('background-color', null);
        }, '$Target.css( \'background-color\', \'#f00\' )', function () {
            $Target.css('background-color', '#f00');
            $Target.css('background-color', null);
        }, 25);
    });

    QUnit.test('.each()', function (assert) {
        assert.ok(µ().each, 'exists');

        var µDivs = µ('div');
        var divs = [];

        µDivs.each(function (_el) {
            divs.push(_el);
        });
        assert.equal(µDivs.length, divs.length, 'pushed each element');
        assert.deepEqual(µDivs[0], divs[0], 'correct result');

        µDivs = µ('div');
        var $Divs = $('div');

        buildTest('µDivs.each( function( _el, i ){} )', function () {
            var arr = [];
            µDivs.each(function (_el, i) {
                arr.push(_el.id);
            });
        }, '$Divs.each( function( _el, i ){} )', function () {
            var arr = [];
            $Divs.each(function (_el, i) {
                arr.push(_el.id);
            });
        }, 26);
    });

    QUnit.test('.filter()', function (assert) {
        assert.ok(µ().filter, 'exists');
        var µDivs = µ('div');
        var µId = µDivs.filter('#qunit');

        assert.equal(µId.length, 1, 'selects the correct element');

        µId = µDivs.filter(':lt(3)');

        assert.equal(µId.length, 3, 'accepts pseudo selectors');

        var $Divs;

        var resetDivs = function resetDivs() {
            µDivs = µ('div');
            $Divs = $('div');
        };

        buildTest('µDivs.filter( \'#qunit\' )', function () {
            resetDivs();
            µDivs.filter('#qunit');
        }, '$Divs.filter( \'qunit\' )', function () {
            resetDivs();
            $Divs.filter('#qunit');
        }, 27);
    });

    QUnit.test('.find()', function (assert) {
        assert.ok(µ().find, 'exists');

        var µDiv = µ('#qunit');
        var µH2 = µDiv.find('h2');

        assert.equal(µH2.length, 2, 'selects enough child elements');

        µH2 = µDiv.find(':first');

        assert.equal(µH2.length, 1, 'accepts pseudo selectors');

        var $Divs;

        var resetDivs = function resetDivs() {
            µDivs = µ('div');
            $Divs = $('div');
        };

        buildTest('µDivs.find( \'h2\' )', function () {
            resetDivs();
            µDivs.find('h2');
        }, '$Divs.find()', function () {
            resetDivs();
            $Divs.find('h2');
        }, 28);
    });

    QUnit.test('.first()', function (assert) {
        assert.ok(µ().first, 'exists');

        var µEverything = µ('*');
        var µFirst = µEverything.first();

        assert.equal(µFirst.type, '[object Microbe]', 'returns a microbe');
        assert.equal(µFirst.length, 1, 'of length 1');
        assert.deepEqual(µEverything[0], µFirst[0], 'that is actually the first one');

        var µDivs = µ('div');
        var $Divs = $('div');

        buildTest('µDivs.first()', function () {
            µDivs.first();
        }, '$Divs.first()', function () {
            $Divs.first();
        }, 29);
    });

    QUnit.test('.getParentIndex()', function (assert) {
        assert.ok(µ().getParentIndex, 'exists');

        var setup = µ('#example--combined').parent().children()[0];

        var literal = setup[3];
        var _function = setup[µ('#example--combined').getParentIndex()[0]];

        assert.deepEqual(literal, _function, 'parent index is correctly determined');

        var µDiv = µ('div').first();
        var $Div = $('div').first();

        buildTest('µDiv.getParentIndex()', function () {
            µDiv.getParentIndex();
        }, '$Div.getParentIndex()', function () {
            var $DivParent = $Div.parent();
            $DivParent.index($Div);
        }, 30);
    });

    QUnit.test('.hasClass()', function (assert) {
        assert.ok(µ().hasClass, 'exists');

        var µExampleClass = µ('.example--class');

        var exampleClass = µExampleClass.hasClass('example--class');

        assert.ok(exampleClass.length === µExampleClass.length, 'it checks every element');

        var correct = true;
        for (var i = 0, lenI = exampleClass.length; i < lenI; i++) {
            if (!exampleClass[i]) {
                correct = false;
                break;
            }
        }
        assert.ok(correct, 'correctly');

        buildTest('No comparison available.', 31);
    });

    QUnit.test('.html()', function (assert) {
        assert.ok(µ().html, 'exists');

        var µTarget = µ('#example--id');

        µTarget.html('text, yo');
        assert.equal(µTarget[0].innerHTML, 'text, yo', 'html set');

        var htmlGotten = µTarget.html();
        assert.ok(µ.isArray(htmlGotten), 'html() get returns an array');
        assert.ok(typeof htmlGotten[0] === 'string', 'full of strings');

        assert.equal(htmlGotten.length, µTarget.length, 'correct amount of results');
        assert.equal(htmlGotten[0], 'text, yo', 'correct result');

        µTarget.html('');

        µTarget = µ('#example--id');
        var $Target = $('#example--id');

        buildTest('µTarget.html( \'blarg\' )', function () {
            µTarget.html('blarg');
            µTarget.html();
        }, '$Target.html( \'blarg\' )', function () {
            $Target.html('blarg');
            $Target.html();
        }, 32);
    });

    QUnit.test('.indexOf()', function (assert) {
        assert.ok(µ().indexOf, 'exists');

        var µTarget = µ('#example--id');

        var target = document.getElementById('example--id');
        var index = µTarget.indexOf(target);

        assert.deepEqual(µTarget[index], target, 'index correctly determined');

        var µDivs = µ('div');
        var $Divs = $('div');
        var _el = document.getElementById('QUnit');

        buildTest('µDivs.indexOf( _el )', function () {
            µDivs.indexOf(_el);
        }, '$Divs.index( _el )', function () {
            $Divs.index(_el);
        }, 33);
    });

    QUnit.test('.insertAfter()', function (assert) {
        assert.ok(µ().insertAfter, 'exists');

        var µTarget = µ('#example--id');
        var µTargetIndex = µTarget.getParentIndex()[0];

        var µTargetParent = µTarget.parent();
        var µTargetParentChildren = µTargetParent.children()[0].length;

        var _el = '<addedDivThing>';
        µTarget.insertAfter(_el);
        assert.equal(µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new string');
        µ('addedDivThing').remove();

        var µEl = µ(_el);
        µTarget.insertAfter(µEl);
        assert.equal(µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new microbe');
        µ('addedDivThing').remove();

        µEl = µ('<addedDivThing>')[0];
        µTarget.insertAfter(µEl);
        assert.equal(µTargetParentChildren + 1, µTargetParent.children()[0].length, 'add by new element');
        µ('addedDivThing').remove();

        var siblingDiv = document.getElementById('qunit');
        var µSiblingDiv = µ(siblingDiv);
        var $SiblingDiv = $(siblingDiv);
        var parentDiv = siblingDiv.parentNode;

        var vanillaCreate = function vanillaCreate(i) {
            var el = document.createElement('div');
            el = [µ(el), $(el)];

            return el[i];
        };

        var vanillaRemove = function vanillaRemove(el) {
            parentDiv.removeChild(el[0]);
        };

        buildTest('µDiv.insertAfter( el )', function () {
            var µEl = vanillaCreate(0);

            µSiblingDiv.insertAfter(µEl);

            vanillaRemove(µEl);
        }, '$Div.insertAfter( el )', function () {
            var $El = vanillaCreate(1);

            $El.insertAfter($SiblingDiv);

            vanillaRemove($El);
        }, 34);
    });

    QUnit.test('.last()', function (assert) {
        assert.ok(µ().last, 'exists');

        var µEverything = µ('*');
        var µLast = µEverything.last();

        assert.equal(µLast.type, '[object Microbe]', 'returns a microbe');
        assert.equal(µLast.length, 1, 'of length 1');
        assert.deepEqual(µLast[0], µEverything[µEverything.length - 1], 'that is actually the last one');

        var µDivs = µ('div');
        var $Divs = $('div');

        buildTest('µDivs.last()', function () {
            µDivs.last();
        }, '$Divs.last()', function () {
            $Divs.last();
        }, 35);
    });

    QUnit.test('.map()', function (assert) {
        assert.ok(µ().map, 'exists');

        var µDivs = µ('div');

        µDivs.map(function (el) {
            el.moo = 'moo';
        });

        var rand = Math.floor(Math.random() * µDivs.length);

        assert.equal(µDivs[rand].moo, 'moo', 'applies to all elements');

        µDivs = µ('div');
        var $Divs = $('div');

        var resetDivs = function resetDivs() {
            µDivs = µ('div');
            $Divs = $('div');
        };

        buildTest('µDivs.last( function(){} )', function () {
            resetDivs();

            µDivs.map(function (el) {
                el.moo = 'moo';
            });
        }, '$Divs.map( function(){} )', function () {
            resetDivs();

            $Divs.map(function (el) {
                el.moo = 'moo';
            });
        }, 36);
    });

    QUnit.test('.parent()', function (assert) {
        assert.ok(µ().parent, 'exists');

        var µBody = µ('body');
        var µParent = µBody.parent();

        assert.equal(µParent.type, '[object Microbe]', 'returns a microbe');
        assert.equal(µParent.length, 1, 'of length 1');
        assert.deepEqual(µParent[0], µ('html')[0], 'that is actually the parent');

        var µDivs = µ('div');
        var $Divs = $('div');

        buildTest('µDivs.parent()', function () {
            µDivs.parent();
        }, '$Divs.parent()', function () {
            $Divs.parent();
        }, 37);
    });

    QUnit.test('.push()', function (assert) {
        assert.ok(µ().push, 'exists');

        var µDivs = µ('div');
        var µDivsLength = µDivs.length;
        var newDiv = µ('<div>')[0];

        µDivs.push(newDiv);

        assert.equal(µDivsLength + 1, µDivs.length, 'pushes to the microbe');
        assert.deepEqual(newDiv, µDivs[µDivs.length - 1], 'that is the correct element');

        var _el;
        var µEmpty = µ([]);
        var $Empty = $([]);

        buildTest('µEmpty.push( _el )', function () {
            _el = document.getElementById('QUnit');
            µEmpty.push(_el);
        }, '$Empty.push( _el )', function () {
            _el = document.getElementById('QUnit');
            $Empty.push(_el);
        }, 38);
    });

    QUnit.test('.remove()', function (assert) {
        assert.ok(µ().remove, 'exists');

        var µFirstDiv = µ('div').first();
        µFirstDiv.append(µ('<divdiv.divide>')[0]);

        µ('divdiv').remove();

        assert.equal(µ('divdiv').length, 0, 'is completely removed');

        var $El, µEl;
        var parentDiv = µ('div')[0];

        var vanillaAdd = function vanillaAdd() {
            el = document.createElement('div');
            µEl = µ(el);
            $El = $(el);

            parentDiv.appendChild(el);
            return el;
        };

        buildTest('µDiv.remove()', function () {
            vanillaAdd();
            µEl.remove();
        }, '$Div.remove()', function () {
            vanillaAdd();
            $El.remove();
        }, 39);
    });

    QUnit.test('.removeClass()', function (assert) {
        assert.ok(µ().removeClass, 'exists');

        var µDivs = µ('.example--class--groups');
        µDivs.removeClass('example--class--groups');

        var classData = µDivs[0].data['class']['class'];
        assert.ok(classData.indexOf('example--class--groups') === -1, 'removeClass sets data');

        assert.equal(µ('.example--class--groups').length, 0, 'removed class to both divs');

        µDivs.addClass('example--class--groups');

        µDivs = µ('.example--class--groups');
        var $Divs = $('.example--class--groups');

        var resetDivs = function resetDivs() {
            for (var i = 0, lenI = µDivs.length; i < lenI; i++) {
                µDivs[i].className += ' moo';
            }
        };

        buildTest('µDivs.removeClass( \'moo\' )', function () {
            µDivs.removeClass('moo');

            resetDivs();
        }, '$Divs.removeClass( \'moo\' )', function () {
            $Divs.removeClass('moo');

            resetDivs();
        }, 40);
    });

    QUnit.test('.selector()', function (assert) {
        assert.ok(µ().selector, 'exists');

        var _el = µ('.example--class--groups')[0];
        assert.equal(µ(_el).selector(), 'div.example--class.example--class--groups', 'correctly parses classes');

        _el = µ('#microbe--example--dom')[0];
        assert.equal(µ(_el).selector(), 'div#microbe--example--dom', 'correctly parses ids');

        _el = µ('#example--combined')[0];
        assert.equal(µ(_el).selector(), 'div#example--combined.example--combined', 'correctly parses combined');

        buildTest('No comparison available.', 41);
    });

    QUnit.test('.splice()', function (assert) {
        assert.ok(µ().splice, 'exists');
        assert.equal(µ('div').splice(0, 5).length, 5, 'is the correct length');

        var $Div = $('div'),
            µDiv = µ('div');
        buildTest('µDiv.splice( 0, 5 )', function () {
            µDiv.splice(0, 5);
        }, 'µDiv.splice( 0, 5 )', function () {
            $Div.splice(0, 5);
        }, 42);
    });

    QUnit.test('.text()', function (assert) {
        assert.ok(µ().text, 'exists');

        var µTarget = µ('#example--id');

        µTarget.text('text, yo');

        var _text;
        if (document.all) {
            _text = µTarget[0].innerText;
        } else // FF
            {
                _text = µTarget[0].textContent;
            }

        assert.equal(_text, 'text, yo', 'text set');

        var textGotten = µTarget.text();
        assert.ok(µ.isArray(textGotten), 'text() get returns an array');
        assert.ok(typeof textGotten[0] === 'string', 'full of strings');

        assert.equal(textGotten.length, µTarget.length, 'correct amount of results');
        assert.equal(textGotten[0], 'text, yo', 'correct result');

        µTarget.text('');

        µTarget = µ('#example--id');
        var $Target = $('#example--id');

        buildTest('µTarget.text( \'blarg\' )', function () {
            µTarget.text('blarg');
            µTarget.text();
        }, '$Target.text( \'blarg\' )', function () {
            $Target.text('blarg');
            $Target.text();
        }, 43);
    });

    QUnit.test('.toggleClass()', function (assert) {
        assert.ok(µ().toggleClass, 'exists');

        var µDivs = µ('.example--class--groups');

        µDivs.toggleClass('example--class--groups');
        assert.equal(µDivs.first().hasClass('example--class--groups')[0], false, 'removes classes');

        µDivs.toggleClass('example--class--groups');
        assert.equal(µDivs.first().hasClass('example--class--groups')[0], true, 'adds classes');

        µDivs = µ('.example--class--groups');
        var $Divs = $('.example--class--groups');

        buildTest('µDivs.toggleClass( \'moo\' )', function () {
            µDivs.toggleClass('moo');
        }, '$Divs.toggleClass( \'moo\' )', function () {
            $Divs.toggleClass('moo');
        }, 44);
    });

    QUnit.test('.extend()', function (assert) {
        assert.ok(µ().extend, 'exists');
        assert.ok(µ.extend, 'exists');

        var µDivs = µ('div');
        var extension = { more: function more() {
                return 'MOAR!!!';
            } };
        µDivs.extend(extension);
        assert.equal(µDivs.more(), 'MOAR!!!', 'extends microbes');

        var _obj = { a: 1, b: 2, c: 3 };
        µ.extend(_obj, extension);
        assert.equal(_obj.more(), 'MOAR!!!', 'extends objects');

        buildTest('µ.extend( _obj, extension );', function () {
            /* these are commented out to draw attention to how slow the 
               other function is comparatively.  this one is quite a bit faster */
            // extension = { more: function(){ return 'MOAR!!!'; } };
            // _obj = µ( 'div' );
            // _obj.extend( extension );

            extension = { more: function more() {
                    return 'MOAR!!!';
                } };
            _obj = { a: 1, b: 2, c: 3 };
            µ.extend(_obj, extension);
        }, '$.extend( _obj, extension )', function () {
            /* these are commented out to draw attention to how slow the 
               other function is comparatively.  this one is quite a bit faster */
            // extension   = { more: function(){ return 'MOAR!!!'; } };
            // _obj = $( 'div' );
            // _obj.extend( extension );

            extension = { more: function more() {
                    return 'MOAR!!!';
                } };
            _obj = { a: 1, b: 2, c: 3 };
            $.extend(_obj, extension);
        }, 45);
    });

    QUnit.test('.merge()', function (assert) {
        assert.ok(µ().merge, 'exists');
        assert.ok(µ.merge, 'exists');

        var µDivs = µ('div');
        var divCount = µDivs.length;
        var µHtml = µ('html');
        var htmlCount = µHtml.length;

        var merged = µ.merge(µDivs, µHtml);
        assert.equal(divCount + htmlCount, merged.length, 'merged microbes');

        merged = µ.merge([1, 2, 3], [4, 5, 6]);
        assert.equal(6, merged.length, 'merged arrays');

        µDivs = µ('div');
        µDivs.merge(µHtml);
        assert.equal(µDivs.length, divCount + htmlCount, 'merged this');

        var µDivs, $Divs, µLi, $Li;

        var refreshObjects = function refreshObjects() {
            µDivs = µ('div');
            $Divs = $('div');

            µLi = µ('li');
            $Li = $('li');
        };

        buildTest('µ.merge( _obj, extension );', function () {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // µDivs.merge( µLi );

            µ.merge(µDivs, µLi);
        }, '$.merge( _obj, extension )', function () {
            refreshObjects();

            /* these are commented out because jquery doesn't handle this syntax */
            // $Divs.merge( $Li );

            $.merge($Divs, µLi);
        }, 46);
    });

    QUnit.test('.capitalize()', function (assert) {
        assert.ok(µ.capitalize, 'exists');
        assert.ok(µ.capitalise, 'exists');
        assert.ok(µ.capitalise('i dont know') === 'I Dont Know', 'capitalizes strings');

        var strArr = ['i dont know', 'for real'];
        strArr = µ.capitalize(strArr);
        assert.ok(strArr[0] === 'I Dont Know' && strArr[1] === 'For Real', 'capitalizes string arrays');

        buildTest('No comparison available.', 47);
    });

    QUnit.test('.identity()', function (assert) {
        assert.ok(µ.identity, 'exists');
        var val = 'mooon';
        assert.equal('mooon', µ.identity('mooon'), 'it equals itself');

        buildTest('No speed tests available.', 48);
    });

    QUnit.test('.noop()', function (assert) {
        assert.ok(µ.noop, 'noop exists');
        assert.equal(µ.noop(), undefined, 'nothing happens');

        assert.ok(µ.xyzzy, 'xyzzy exists');
        assert.equal(µ.xyzzy(), undefined, 'nothing happens');

        buildTest('No speed tests available.', 49);
    });

    QUnit.test('.isArray()', function (assert) {
        assert.ok(µ.isArray, 'exists');
        assert.ok(µ.isArray([1, 2, 3]), 'true for array');
        assert.ok(!µ.isArray({ 1: 'a', 2: 'b' }), 'false otherwise');

        buildTest('µ.isArray', function () {
            µ.isArray({});
            µ.isArray([1, 2, 3]);
        }, '$.isArray', function () {
            $.isArray({});
            $.isArray([1, 2, 3]);
        }, 50);
    });

    QUnit.test('.isEmpty()', function (assert) {
        assert.ok(µ.isEmpty, 'exists');
        assert.ok(µ.isEmpty({}), 'true on empty');
        assert.ok(!µ.isEmpty({ a: 1 }), 'false otherwise');

        buildTest('µ.isEmpty', function () {
            µ.isEmpty({});
            µ.isEmpty({ a: 2 });
        }, '$.isEmptyObject', function () {
            $.isEmptyObject({});
            $.isEmptyObject({ a: 2 });
        }, 51);
    });

    QUnit.test('.isFunction()', function (assert) {
        assert.ok(µ.isFunction, 'exists');
        assert.ok(µ.isFunction(assert.ok), 'true on function');
        assert.ok(!µ.isFunction({}), 'false otherwise');

        buildTest('µ.isFunction', function () {
            µ.isFunction(function () {});
            µ.isFunction([1, 2, 3]);
        }, '$.isFunction', function () {
            $.isFunction(function () {});
            $.isFunction([1, 2, 3]);
        }, 52);
    });

    QUnit.test('.isObject()', function (assert) {
        assert.ok(µ.isObject, 'exists');
        assert.ok(µ.isObject({}), 'true on object');
        assert.ok(!µ.isObject('ä'), 'false otherwise');

        buildTest('µ.isObject', function () {
            µ.isObject({});
            µ.isObject([1, 2, 3]);
        }, '$.isPlainObject', function () {
            $.isPlainObject({});
            $.isPlainObject([1, 2, 3]);
        }, 53);
    });

    QUnit.test('.isUndefined()', function (assert) {
        var parent = { a: 1 };
        assert.ok(µ.isUndefined, 'exists');
        assert.ok(!µ.isUndefined('a', parent), 'false if parent contains property');
        assert.ok(µ.isUndefined('b', parent), 'true otherwise');

        buildTest('No comparison available.', 54);
    });

    QUnit.test('.isWindow()', function (assert) {
        assert.ok(µ.isWindow, 'exists');
        assert.ok(µ.isWindow(window), 'true on window');
        assert.ok(!µ.isWindow({}), 'false otherwise');

        buildTest('µ.isWindow', function () {
            µ.isWindow(window);
            µ.isWindow([1, 2, 3]);
        }, '$.isWindow', function () {
            $.isWindow(window);
            $.isWindow([1, 2, 3]);
        }, 55);
    });

    QUnit.test('.toString()', function (assert) {
        assert.ok(µ().toString, 'exists');
        assert.ok(µ.toString, 'exists');
        assert.ok(µ().toString() === '[object Microbe]', 'micriobe is a microbe');

        buildTest('µ.toString', function () {
            µ.toString(µ);
            µ.toString([1, 2, 3]);
        }, '$.toString', function () {
            $.toString($);
            $.toString([1, 2, 3]);
        }, 56);
    });

    QUnit.test('.toArray()', function (assert) {
        assert.ok(µ().toArray, 'exists');
        assert.ok(µ.toArray, 'exists');

        var arr = µ('div').toArray();
        assert.equal(µ.type(arr), 'array', 'makes arrays');

        buildTest('No comparison available.', 57);
    });

    QUnit.test('.type()', function (assert) {
        assert.ok(µ.type, 'exists');
        assert.equal(µ.type([]), 'array', 'checks arrays');
        assert.equal(µ.type(2), 'number', 'checks numbers');
        assert.equal(µ.type({}), 'object', 'checks objects');
        assert.equal(µ.type('moin!'), 'string', 'checks strings');
        assert.equal(µ.type(new Date()), 'date', 'checks dates');
        assert.equal(µ.type(µ('div')), 'microbe', 'checks microbes');
        assert.equal(µ.type(/[0-9]/), 'regExp', 'checks regex');
        assert.equal(µ.type(assert.ok), 'function', 'checks functions');
        assert.equal(µ.type(true), 'boolean', 'checks boolean primitives');
        assert.equal(µ.type(new Boolean(true)), 'object', 'checks boolean objects');
        assert.equal(µ.type(new Error()), 'error', 'checks error objects');
        assert.equal(µ.type(new Promise(function () {})), 'promise', 'checks promises');

        buildTest('µ.type', function () {
            µ.type([]);
            µ.type(2);
            µ.type({});
            µ.type('moin!');
            µ.type(new Date());
            µ.type(µ('div'));
            µ.type(/[0-9]/);
            µ.type(assert.ok);
            µ.type(true);
            µ.type(new Boolean(true));
            µ.type(new Error());
            µ.type(new Promise(function () {}));
        }, '$.type', function () {
            $.type([]);
            $.type(2);
            $.type({});
            $.type('moin!');
            $.type(new Date());
            $.type($('div'));
            $.type(/[0-9]/);
            $.type(assert.ok);
            $.type(true);
            $.type(new Boolean(true));
            $.type(new Error());
            $.type(new Promise(function () {}));
        }, 58);
    });
};

},{}],3:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
'use strict';

module.exports = function (buildTest) {
    QUnit.module('dom.js');

    QUnit.test('µ.ready()', function (assert) {
        assert.ok(µ.ready, 'exists');
    });
};

},{}],4:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
'use strict';

module.exports = function (buildTest) {
    QUnit.module('events.js');

    QUnit.test('.emit()', function (assert) {
        assert.expect(3);

        assert.ok(µ().emit, 'exists');
        var µExamples = µ('.example--class');
        var µParent = µExamples.parent();

        var emitTest = assert.async();
        var bubbleTest = assert.async();

        µExamples.on('emitTest', function (e) {
            µExamples.off();
            assert.equal(e.detail.doIt, '2 times', 'custom event emitted');
            emitTest();
        });

        µParent.on('bubbleTest', function (e) {
            assert.equal(e.detail.bubbled, 'true', 'custom event bubbled');
            µParent.off();
            bubbleTest();
        });

        µExamples.emit('emitTest', { doIt: '2 times' });
        µParent.emit('bubbleTest', { bubbled: 'true' }, true);

        var µDiv = µ('div');
        var $Div = $('div');

        buildTest('µDiv.emit( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function () {
            µDiv.emit('testClick', { wooo: 'i\'m a ghost!' });
        }, '$Div.trigger( \'testClick\', { wooo: \'i\'m a ghost!\'} );', function () {
            $Div.trigger('testClick', { wooo: 'i\'m a ghost!' });
        }, 63);
    });

    QUnit.test('.on()', function (assert) {
        assert.expect(3);

        assert.ok(µ().on, 'exists');

        var µExamples = µ('.example--class');

        var onTest = assert.async();

        µExamples.on('onTest', function (e) {
            var func = µExamples[0].data['_onTest-bound-function']['_onTest-bound-function'][0];

            assert.equal(typeof func, 'function', 'sets unload data');
            µExamples.off();
            assert.equal(e.detail.doIt, '2 times', 'event correctly listened to');
            onTest();
        });

        µExamples.emit('onTest', { doIt: '2 times' });

        var µDiv = µ('div');
        var $Div = $('div');

        var vanillaRemoveListener = function vanillaRemoveListener(divs) {
            for (var i = 0, lenI = divs.length; i < lenI; i++) {
                divs[i].removeEventListener('click', _func);
            }
        };

        var keyCode;
        var _func = function _func(e) {
            keyCode = e.keyCode;
        };

        buildTest('µ( \'div\' ).on( \'click\', function(){} )', function () {
            µDiv.on('click', _func);
            vanillaRemoveListener(µDiv);
        }, '$( \'div\' ).on( \'click\', function(){} )', function () {
            $Div.on('click', _func);
            vanillaRemoveListener($Div);
        }, 64);
    });

    QUnit.test('.off()', function (assert) {
        assert.ok(µ().off, 'exists');

        var µExamples = µ('.example--class');

        µExamples.on('turningOff', function (e) {});
        µExamples.off('turningOff');
        var func = µExamples[0].data['_turningOff-bound-function']['_turningOff-bound-function'][0];

        assert.equal(func, null, 'listener removed');

        var µDiv = µ('div');
        var $Div = $('div');

        var vanillaAddListener = function vanillaAddListener(divs) {
            for (var i = 0, lenI = divs.length; i < lenI; i++) {
                divs[i].addEventListener('click', _func);
                divs[i].data = divs[i].data || {};
                divs[i].data['_click-bound-function'] = divs[i].data['_click-bound-function'] || {};
                divs[i].data['_click-bound-function']['_click-bound-function'] = _func;
            }
        };

        var keyCode;
        var _func = function _func(e) {
            keyCode = e.keyCode;
        };

        buildTest('µ( \'div\' ).on( \'click\', function(){} )', function () {
            vanillaAddListener(µDiv);
            µDiv.off('click');
        }, '$( \'div\' ).on( \'click\', function(){} )', function () {
            vanillaAddListener($Div);
            $Div.off('click');
        }, 65);
    });
};

},{}],5:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

'use strict';

module.exports = function (buildTest) {
    QUnit.module('http.js');

    QUnit.test('.http', function (assert) {
        assert.ok(µ.http, 'exists');
    });

    QUnit.test('.http.get', function (assert) {
        assert.ok(µ.http.get, 'exists');
    });

    QUnit.test('.http.post', function (assert) {
        assert.ok(µ.http.post, 'exists');
    });
};

},{}],6:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, buildTest  */
'use strict';

module.exports = function (buildTest) {
    QUnit.module('init.js');

    QUnit.test('wrap an element', function (assert) {
        var _body = document.getElementsByTagName('body')[0];
        var µBody = µ(_body);

        assert.equal(µBody.length, 1, 'one body');
        assert.deepEqual(µBody[0], _body, 'passes');

        buildTest('µ( _el )', function () {
            return µ(_body);
        }, '$( _el )', function () {
            return $(_body);
        }, 0);
    });

    QUnit.test('query class', function (assert) {
        var _div = document.getElementsByClassName('example--class')[0];
        var µDiv = µ('.example--class');

        assert.equal(µDiv.length, 1, 'one div');
        assert.deepEqual(µDiv[0], _div, 'passes');

        buildTest('µ( \'.example--class\' )', function () {
            return µ('.example--class');
        }, '$( \'.example--class\' )', function () {
            return $('.example--class');
        }, 1);
    });

    QUnit.test('query id', function (assert) {
        var _div = document.getElementById('example--id');
        var µDiv = µ('#example--id');

        assert.equal(µDiv.length, 1, 'one div');
        assert.deepEqual(µDiv[0], _div, 'passes');

        buildTest('µ( \'#example--id\' )', function () {
            return µ('#example--id');
        }, '$( \'#example--id\' )', function () {
            return $('#example--id');
        }, 2);
    });

    QUnit.test('query tagname', function (assert) {
        var _div = document.getElementsByTagName('div')[0];
        var µDiv = µ('div');

        assert.equal(µDiv[0].tagName, 'DIV', 'correct element');
        assert.deepEqual(µDiv[0], _div, 'passes');

        buildTest('µ( \'div\' )', function () {
            return µ('div');
        }, '$( \'div\' )', function () {
            return $('div');
        }, 3);
    });

    QUnit.test('query combined', function (assert) {
        var _div = document.querySelector('div#example--combined.example--combined');
        var µDiv = µ('div#example--combined.example--combined');

        assert.equal(µDiv.length, 1, 'one div');
        assert.deepEqual(µDiv[0], _div, 'passes');

        buildTest('µ( \'div#example--combined.example--combined\' )', function () {
            return µ('div#example--combined.example--combined');
        }, '$( \'div#example--combined.example--combined\' )', function () {
            return $('div#example--combined.example--combined');
        }, 4);
    });

    QUnit.test('query microbe scope', function (assert) {
        var µDiv = µ('div', µ('.example--class--groups'));
        var $Div = $('div', $('.example--class--groups'));

        assert.equal(µDiv.length, 2, 'two divs');
        assert.equal(µDiv[0].tagName, 'DIV', 'correct element');

        buildTest('µ( \'div\', µDiv )', function () {
            return µ('div', µDiv);
        }, '$( \'div\', $Div )', function () {
            return $('div', $Div);
        }, 5);
    });

    QUnit.test('query element scope', function (assert) {
        var _scopeEl = µ('.example--class--groups')[0];

        var µDiv = µ('div', _scopeEl);

        assert.equal(µDiv.length, 2, 'two divs');
        assert.deepEqual(µDiv.first().parent()[0], _scopeEl, 'correct parent');

        buildTest('µ( \'div\', _scopeEl )', function () {
            return µ('div', _scopeEl);
        }, '$( \'div\', _scopeEl )', function () {
            return $('div', _scopeEl);
        }, 6);
    });

    QUnit.test('query string scope', function (assert) {
        var µDiv = µ('div', '.example--class--groups');
        assert.equal(µDiv.selector(), '.example--class--groups div', 'correctly formed selector');
        assert.equal(µDiv.length, 2, 'two divs');

        buildTest('µ( \'div\', \'.example--class--groups\' )', function () {
            return µ('div', '.example--class--groups');
        }, '$( \'div\', \'.example--class--groups\' )', function () {
            return $('div', '.example--class--groups');
        }, 7);
    });
};

},{}],7:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */

'use strict';

module.exports = function (buildTest) {
    QUnit.module('observe.js');

    QUnit.test('.get', function (assert) {
        assert.ok(µ().get, 'exists');

        var µExamples = µ('.example--class');

        µExamples[0].data = µExamples[0].data || {};
        µExamples[0].data.moo = µExamples[0].data.moo || {};
        µExamples[0].data.moo.moo = 'mooon!';

        assert.equal(µExamples.get('moo')[0], 'mooon!', 'get gets');

        buildTest('No comparison available.', 66);
    });

    QUnit.test('.observe()', function (assert) {
        assert.expect(3);

        assert.ok(µ().observe, 'exists');

        var µExamples = µ('.example--class');

        var observeTest = assert.async();

        µExamples.observe('observeTest', function (e) {
            assert.equal(typeof µExamples[0].data.observeTest._observeFunc, 'function', 'observe function stored');
            µExamples.unobserve();
            assert.equal(e[0].object.observeTest, 'whoohoo', 'object correctly observed');
            observeTest();
        });

        µExamples.set('observeTest', 'whoohoo');

        buildTest('No comparison available.', 67);
    });

    QUnit.test('.observeOnce', function (assert) {
        assert.expect(2);

        assert.ok(µ().observeOnce, 'exists');

        var µExamples = µ('.example--class');

        var observeOnceTest = assert.async();

        µExamples.observeOnce('observeOnceTest', function (e) {
            assert.equal(e[0].object.observeOnceTest, 'whoohoo', 'object correctly observed once');

            observeOnceTest();
        });

        µExamples.set('observeOnceTest', 'whoohoo');

        buildTest('No comparison available.', 68);
    });

    QUnit.test('.set', function (assert) {
        assert.ok(µ().set, 'exists');

        var µExamples = µ('.example--class');
        µExamples.set('moo', 'mooon!');

        var setData = µExamples[0].data.moo.moo;

        assert.equal(setData, 'mooon!', 'set sets');

        buildTest('No comparison available.', 69);
    });

    QUnit.test('.unobserve', function (assert) {
        assert.ok(µ().unobserve, 'exists');

        buildTest('No comparison available.', 70);
    });
};

},{}],8:[function(require,module,exports){
/* global document, window, µ, $, QUnit, Benchmark, test  */
'use strict';

module.exports = function (buildTest) {
    QUnit.module('pseudo.js');

    QUnit.test(':contains(text)', function (assert) {
        assert.ok(µ.pseudo.contains, 'exists');
        assert.equal(µ('#example--combined:contains(I am)').length, 1, 'searches text');
        assert.equal(µ('#example--combined:contains(i am)').length, 1, 'ignores case');
        assert.equal(µ('#example--combined:contains(moon)').length, 0, 'ignores false returns');

        buildTest('µ( \'#example--combined:contains(I am)\' )', function () {
            return µ('#example--combined:contains(I am)');
        }, '$( \'#example--combined:contains(I am)\' )', function () {
            return $('#example--combined:contains(I am)');
        }, 8);
    });

    QUnit.test(':even', function (assert) {
        var µEvenScripts = µ('script:even').length;
        var µScripts = µ('script').length;

        assert.ok(µ.pseudo.even, 'exists');
        assert.equal(µEvenScripts, Math.floor(µScripts / 2), 'selects only the even script');
        assert.deepEqual(µScripts[1], µEvenScripts[0], 'selects the correct half');

        buildTest('µ( \'div:even\' )', function () {
            return µ('div:even');
        }, '$( \'div:even\' )', function () {
            return $('div:even');
        }, 9);
    });

    QUnit.test(':first', function (assert) {
        var µDivs = µ('div');
        var µFirstDiv = µ('div:first');

        assert.ok(µ.pseudo.first, 'exists');
        assert.deepEqual(µDivs[0], µFirstDiv[0], 'finds the right div');
        assert.equal(µFirstDiv.length, 1, 'only finds one div');

        buildTest('µ( \'div:first\' )', function () {
            return µ('div:first');
        }, '$( \'div:first\' )', function () {
            return $('div:first');
        }, 10);
    });

    QUnit.test(':gt(X)', function (assert) {
        var µDivs = µ('div');
        var µGtDivs = µ('div:gt(3)');

        assert.ok(µ.pseudo.gt, 'exists');
        assert.deepEqual(µDivs[6], µGtDivs[3], 'finds the right divs');
        assert.equal(µGtDivs.length, µDivs.length - 3, 'finds the correct number if elements');

        buildTest('µ( \'div:gt(3)\' )', function () {
            return µ('div:gt(3)');
        }, '$( \'div:gt(3)\' )', function () {
            return $('div:gt(3)');
        }, 11);
    });

    QUnit.test(':has(S)', function (assert) {
        var µHasDiv = µ('div:has(li)');

        assert.ok(µ.pseudo.has, 'exists');
        assert.equal(µHasDiv.length, 1, 'grabs the correct amount of divs');

        buildTest('µ( \'div:has(li)\' )', function () {
            return µ('div:has(li)');
        }, '$( \'div:has(li)\' )', function () {
            return $('div:has(li)');
        }, 12);
    });

    QUnit.test(':last', function (assert) {
        var µDivs = µ('div');
        var µLastDiv = µ('div:last');

        assert.ok(µ.pseudo.last, 'exists');
        assert.deepEqual(µDivs[µDivs.length - 1], µLastDiv[0], 'finds the right div');
        assert.equal(µLastDiv.length, 1, 'only finds one div');

        buildTest('µ( \'div:last\' )', function () {
            return µ('div:last');
        }, '$( \'div:last\' )', function () {
            return $('div:last');
        }, 13);
    });

    QUnit.test(':lt(X)', function (assert) {
        var µDivs = µ('div');
        var µLtDivs = µ('div:lt(3)');

        assert.ok(µ.pseudo.lt, 'exists');
        assert.deepEqual(µDivs[1], µLtDivs[1], 'finds the right divs');
        assert.equal(µLtDivs.length, 3, 'finds the correct number if elements');

        buildTest('µ( \'div:lt(2)\' )', function () {
            return µ('div:lt(2)');
        }, '$( \'div:lt(2)\' )', function () {
            return $('div:lt(2)');
        }, 14);
    });

    QUnit.test(':odd', function (assert) {
        var µOddScripts = µ('script:odd').length;
        var µScripts = µ('script').length;

        assert.ok(µ.pseudo.odd, 'exists');
        assert.equal(µOddScripts, Math.ceil(µScripts / 2), 'selects only the odd scripts');
        assert.deepEqual(µScripts[0], µOddScripts[0], 'selects the correct half');

        buildTest('µ( \'div:odd\' )', function () {
            return µ('div:odd');
        }, '$( \'div:odd\' )', function () {
            return $('div:odd');
        }, 15);
    });

    QUnit.test(':root', function (assert) {
        var µRoot = µ('div:root');

        assert.ok(µ.pseudo.root, 'exists');
        assert.deepEqual(µRoot[0], µ('html')[0], 'selects the root');

        buildTest('µ( \'div:root\' )', function () {
            return µ('div:root');
        }, '$( \'div:root\' )', function () {
            return $('div:root');
        }, 16);
    });

    QUnit.test(':target', function (assert) {
        window.location.hash = 'example--combined';
        var µTarget = µ('div:target');
        var µIdSearch = µ('#example--combined');

        assert.ok(µ.pseudo.target, 'exists');
        assert.deepEqual(µTarget[0], µIdSearch[0], 'finds the correct element');
        assert.equal(µTarget.length, 1, 'and that\'s the only one');

        buildTest('µ( \'div:target\' )', function () {
            return µ('div:target');
        }, '$( \'div:target\' )', function () {
            return $('div:target');
        }, 17);

        window.location.hash = '';
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbmljb2xhc2Ivd29ya3NwYWNlL3d3dy9taWNyb2JlL3Rlc3RzL3VuaXQvYnVpbGRUZXN0cy5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvdGVzdHMvdW5pdC9jb3JlLmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS90ZXN0cy91bml0L2RvbS5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvdGVzdHMvdW5pdC9ldmVudHMuanMiLCIvVXNlcnMvbmljb2xhc2Ivd29ya3NwYWNlL3d3dy9taWNyb2JlL3Rlc3RzL3VuaXQvaHR0cC5qcyIsIi9Vc2Vycy9uaWNvbGFzYi93b3Jrc3BhY2Uvd3d3L21pY3JvYmUvdGVzdHMvdW5pdC9pbml0LmpzIiwiL1VzZXJzL25pY29sYXNiL3dvcmtzcGFjZS93d3cvbWljcm9iZS90ZXN0cy91bml0L29ic2VydmUuanMiLCIvVXNlcnMvbmljb2xhc2Ivd29ya3NwYWNlL3d3dy9taWNyb2JlL3Rlc3RzL3VuaXQvcHNldWRvLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2NBLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQzNEO0FBQ0ksUUFBSyxPQUFPLElBQUksS0FBSyxVQUFVLEVBQy9CO0FBQ0ksZUFBTyxHQUFHLElBQUksQ0FBQztLQUNsQjs7QUFFRCxRQUFJLE1BQU0sR0FBSSxDQUFDLENBQUUsY0FBYyxDQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWhELFFBQUksTUFBTSxHQUFJLE1BQU0sQ0FBRSxPQUFPLENBQUUsQ0FBQzs7QUFFaEMs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LFVBQVUsTUFBTSxFQUN2QztBQUNJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLG1CQUFtQixDQUFDO0FBQzNDLFlBQUksT0FBTyxHQUFHLENBQUMsQ0FBRSxZQUFZLENBQUUsQ0FBQztBQUNoQyxZQUFJLFNBQVMsR0FBRyxDQUFDLENBQUUsb0JBQW9CLENBQUUsQ0FBQzs7QUFFMUMsY0FBTSxDQUFDLEVBQUUsQ0FBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUUsQ0FBQztBQUN2QyxjQUFNLENBQUMsU0FBUyxDQUFFLE9BQU8sQ0FBRSxDQUFDLENBQUUsRUFBRSxTQUFTLENBQUUsQ0FBQyxDQUFFLEVBQUUsMkJBQTJCLENBQUUsQ0FBQztBQUM5RSxjQUFNLENBQUMsS0FBSyxDQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFFLENBQUM7O0FBRTlELGlCQUFTLENBQ1QscUJBQXFCLEVBQUUsWUFDdkI7QUFDSSxtQkFBTyxDQUFDLENBQUUsWUFBWSxDQUFFLENBQUM7U0FDNUIsRUFFRCxxQkFBcUIsRUFBRSxZQUN2QjtBQUNJLG1CQUFPLENBQUMsQ0FBRSxZQUFZLENBQUUsQ0FBQztTQUM1QixFQUFFLEVBQUUsQ0FBRSxDQUFDOztBQUVSLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztLQUM3QixDQUFDLENBQUM7Q0FDTixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyogZ2xvYmFsIGRvY3VtZW50LCB3aW5kb3csIMK1LCAkLCBRVW5pdCwgQmVuY2htYXJrICAqL1xuXG4vKipcbiAqIGJlbmNobWFyayB0ZXN0c1xuICpcbiAqIEBwYXJhbSAge3N0cn0gICAgICAgICAgICAgICAgICAgIF9zdHIxICAgICAgICAgICAgICAgdGVzdCAxIG5hbWVcbiAqIEBwYXJhbSAge2Z1bmN9ICAgICAgICAgICAgICAgICAgIF9jYjEgICAgICAgICAgICAgICAgdGVzdCAxXG4gKiBAcGFyYW0gIHtzdHJ9ICAgICAgICAgICAgICAgICAgICBfc3RyMiAgICAgICAgICAgICAgIHRlc3QgMiBuYW1lXG4gKiBAcGFyYW0gIHtmdW5jfSAgICAgICAgICAgICAgICAgICBfY2IyICAgICAgICAgICAgICAgIHRlc3QgMlxuICogQHBhcmFtICB7aW50fSAgICAgICAgICAgICAgICAgICAgdGVzdE51bSAgICAgICAgICAgICB0ZXN0IG51bWJlclxuICpcbiAqIEByZXR1cm4ge3ZvaWR9XG4gKi9cbnZhciBidWlsZFRlc3QgPSBmdW5jdGlvbiggX3N0cjEsIF9jYjEsIF9zdHIyLCBfY2IyLCB0ZXN0TnVtIClcbntcbiAgICBpZiAoIHR5cGVvZiBfY2IxICE9PSAnZnVuY3Rpb24nIClcbiAgICB7XG4gICAgICAgIHRlc3ROdW0gPSBfY2IxO1xuICAgIH1cblxuICAgIHZhciDCtVRlc3RzICA9IMK1KCAnI3F1bml0LXRlc3RzJyApLmNoaWxkcmVuKClbMF07XG5cbiAgICB2YXIgcmVzRGl2ICA9IMK1VGVzdHNbIHRlc3ROdW0gXTtcblxuICAgIHZhciDCtUxpICAgICAgPSDCtSggJ2xpJywgcmVzRGl2ICk7XG4gICAgdmFyIMK1U3Ryb25nICA9IMK1KCAnc3Ryb25nJywgcmVzRGl2ICk7XG4gICAgdmFyIMK1UmVzdWx0ID0gIMK1KCAnPGRpdi5mYXN0ZXN0PicgKTtcblxuICAgIHJlc0Rpdi5pbnNlcnRCZWZvcmUoIMK1UmVzdWx0WyAwIF0sIMK1U3Ryb25nWyAwIF0gKTtcblxuICAgIGlmICggdHlwZW9mIF9jYjEgPT09ICdmdW5jdGlvbicgKVxuICAgIHtcbiAgICAgICAgdmFyIHRlc3RSZXMgPSBbXTtcbiAgICAgICAgdmFyIF9hcnIgICAgPSBbXTtcbiAgICAgICAgdmFyIGkgICAgICAgPSAwO1xuICAgICAgICB2YXIgbGlicmFyaWVzID0gWyAnwrUnLCAnJCcgXTtcbiAgICAgICAgdmFyIHN1aXRlID0gbmV3IEJlbmNobWFyay5TdWl0ZSgpO1xuXG4gICAgICAgIHN1aXRlLmFkZCggX3N0cjEsIF9jYjEgKVxuICAgICAgICAgICAgLmFkZCggX3N0cjIsIF9jYjIgKVxuICAgICAgICAgICAgLm9uKCAnY3ljbGUnLCBmdW5jdGlvbiggZXZlbnQgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIF9hcnIucHVzaCggdGhpc1sgaSBdLmh6ICk7XG4gICAgICAgICAgICAgICAgdmFyIHRlc3QgPSB0ZXN0UmVzWyBpIF0gPSDCtSggJzxzcGFuLnNwZWVkLS1yZXN1bHQuc2xvdz4nICk7XG4gICAgICAgICAgICAgICAgwrUoIMK1TGlbIGkgXSApLmFwcGVuZCggdGVzdCApO1xuICAgICAgICAgICAgICAgIHRlc3QuaHRtbCggU3RyaW5nKCBldmVudC50YXJnZXQgKSApO1xuXG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfSApXG4gICAgICAgICAgICAub24oICdjb21wbGV0ZScsIGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgZmFzdGVzdCA9IF9hcnIuaW5kZXhPZiggTWF0aC5tYXguYXBwbHkoIE1hdGgsIF9hcnIgKSApO1xuICAgICAgICAgICAgICAgIHRlc3RSZXNbIGZhc3Rlc3QgXS5yZW1vdmVDbGFzcyggJ3Nsb3cnICk7XG5cbiAgICAgICAgICAgICAgICDCtVJlc3VsdC5odG1sKCBsaWJyYXJpZXNbIGZhc3Rlc3QgXSArICcgaXMgdGhlIGZhc3Rlc3QnICk7XG4gICAgICAgICAgICB9ICk7XG5cbiAgICAgICAgdmFyIHN0YXJ0VGhlVGVzdCA9IGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIMK1UmVzdWx0Lm9mZigpO1xuICAgICAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN1aXRlLnJ1biggeyAnYXN5bmMnOiB0cnVlIH0gKTtcbiAgICAgICAgICAgIH0sIDEgKTtcbiAgICAgICAgfTtcblxuICAgICAgICDCtVJlc3VsdC5odG1sKCAnQ2xpY2sgdG8gc3RhcnQgdGhlIHNwZWVkIHRlc3QnICk7XG4gICAgICAgIMK1UmVzdWx0Lm9uKCAnY2xpY2snLCBzdGFydFRoZVRlc3QgKTtcbiAgICB9XG4gICAgZWxzZVxuICAgIHtcbiAgICAgICAgwrVSZXN1bHQuaHRtbCggX3N0cjEgKS5hZGRDbGFzcyggJ2ludmFsaWQtLXRlc3QnICk7XG4gICAgfVxufTtcblxucmVxdWlyZSggJy4vaW5pdCcgKSggYnVpbGRUZXN0ICk7XG5yZXF1aXJlKCAnLi9wc2V1ZG8nICkoIGJ1aWxkVGVzdCApO1xucmVxdWlyZSggJy4vY29yZScgKSggYnVpbGRUZXN0ICk7XG5yZXF1aXJlKCAnLi9odHRwJyApKCBidWlsZFRlc3QgKTtcbnJlcXVpcmUoICcuL2RvbScgKSggYnVpbGRUZXN0ICk7XG5yZXF1aXJlKCAnLi9ldmVudHMnICkoIGJ1aWxkVGVzdCApO1xucmVxdWlyZSggJy4vb2JzZXJ2ZScgKSggYnVpbGRUZXN0ICk7IiwiLyogZ2xvYmFsIGRvY3VtZW50LCB3aW5kb3csIMK1LCAkLCBRVW5pdCwgQmVuY2htYXJrLCB0ZXN0ICAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBidWlsZFRlc3QgKVxue1xuICAgIFFVbml0Lm1vZHVsZSggJ2NvcmUuanMnICk7XG5cblxuICAgIFFVbml0LnRlc3QoICfCtSgpLnZlcnNpb24nLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gJzAuMy4xJztcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1KCkudmVyc2lvbiwgdmVyc2lvbiwgJ3ZlcnNpb24gaXMgJyArIHZlcnNpb24gKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBzcGVlZCB0ZXN0cyBhdmFpbGFibGUuJywgMTggKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJ8K1KCkudHlwZScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgdmFyIHR5cGUgPSAnW29iamVjdCBNaWNyb2JlXSc7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtSgpLnR5cGUsIHR5cGUsICd0eXBlIGlzICcgKyB0eXBlICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KCAnTm8gc3BlZWQgdGVzdHMgYXZhaWxhYmxlLicsIDE5ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICfCtSgpLmxlbmd0aCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtSgpLmxlbmd0aCwgMCwgJ2xlbmd0aCBpbml0aWFsaXplcycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtSggJ2hlYWQnICkubGVuZ3RoLCAxLCAnbGVuZ3RoIHJlcG9ydHMgY29ycmVjdGx5JyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdCggJ05vIHNwZWVkIHRlc3RzIGF2YWlsYWJsZS4nLCAyMCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmFkZENsYXNzKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5hZGRDbGFzcywgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVNb29EaXZzICAgICAgICA9IMK1KCAnZGl2JyApLmFkZENsYXNzKCAnbW9vJyApO1xuICAgICAgICB2YXIgwrVNb29EaXZzTGVuZ3RoICA9IMK1TW9vRGl2cy5sZW5ndGg7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtU1vb0RpdnNMZW5ndGgsIMK1KCAnLm1vbycgKS5sZW5ndGgsICdpdCBhZGRlZCBhIGNsYXNzIScgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtU1vb0RpdnMuZ2V0KCAnY2xhc3MnIClbMF0uaW5kZXhPZiggJ21vbycgKSAhPT0gLTEsICdpdCBzZXQgdGhlIGNsYXNzIGludG8gdGhlIGRhdGEgb2JqZWN0JyApO1xuXG4gICAgICAgIMK1KCAnLm1vbycgKS5yZW1vdmVDbGFzcyggJ21vbycgKTtcblxuICAgICAgICDCtU1vb0RpdnMgPSDCtSggJ2RpdicgKS5hZGRDbGFzcyggWyAnbW9vJywgJ2Zvci0tcmVhbCcgXSApLmxlbmd0aDtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtU1vb0RpdnMsIMK1KCAnLm1vby5mb3ItLXJlYWwnICkubGVuZ3RoLCAnaXQgYWRkZWQgMiBjbGFzc2VzIGZyb20gYW4gYXJyYXkgb2Ygc3RyaW5ncycgKTtcblxuICAgICAgICB2YXIgY2xhc3NEYXRhID0gwrUoICcubW9vJyApWzBdLmRhdGEuY2xhc3MuY2xhc3M7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCBjbGFzc0RhdGEuaW5kZXhPZiggJ21vbycpICE9PSAtMSwgJ2NsYXNzIHNldHMgZGF0YScgKTtcblxuICAgICAgICDCtSggJy5tb28nICkucmVtb3ZlQ2xhc3MoICdtb28nICkucmVtb3ZlQ2xhc3MoICdmb3ItLXJlYWwnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgJERpdnMgPSAkKCAnZGl2JyApO1xuXG4gICAgICAgIHZhciByZXNldERpdnMgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IMK1RGl2cy5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIMK1RGl2c1sgaSBdLmNsYXNzTmFtZS5yZXBsYWNlKCAnbW9vJywgJycgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtURpdnMuYWRkQ2xhc3MoIFxcJ21vb1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtURpdnMuYWRkQ2xhc3MoICdtb28nICk7XG5cbiAgICAgICAgICAgIHJlc2V0RGl2cygpO1xuICAgICAgICB9LFxuXG4gICAgICAgICckRGl2cy5hZGRDbGFzcyggXFwnbW9vXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXZzLmFkZENsYXNzKCAnbW9vJyApO1xuXG4gICAgICAgICAgICByZXNldERpdnMoKTtcbiAgICAgICAgfSwgMjEgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5hcHBlbmQoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmFwcGVuZCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVOZXdEaXYgPSDCtSggJzxkaXYuYS0tbmV3LS1kaXY+JyApO1xuICAgICAgICB2YXIgwrVUYXJnZXQgPSDCtSggJyNleGFtcGxlLS1pZCcgKTtcblxuICAgICAgICDCtVRhcmdldC5hcHBlbmQoIMK1TmV3RGl2ICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1TmV3RGl2WzBdLCDCtVRhcmdldC5jaGlsZHJlbigpWzBdWzBdLCAnYXR0YWNoZWQgbWljcm9iZScgKTtcbiAgICAgICAgwrVOZXdEaXYucmVtb3ZlKCk7XG5cbiAgICAgICAgwrVUYXJnZXQuYXBwZW5kKCDCtU5ld0RpdlswXSApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtU5ld0RpdlswXSwgwrVUYXJnZXQuY2hpbGRyZW4oKVswXVswXSwgJ2F0dGFjaGVkIGVsZW1lbnQnICk7XG4gICAgICAgIMK1TmV3RGl2LnJlbW92ZSgpO1xuXG4gICAgICAgIC8vIE5PTiBGVU5DVElPTkFMIFRFU1RcbiAgICAgICAgLy8gdGhpcyBpcyBhIGZ1dHVyZSBhYmlsaXR5IGFuZCBjYW5ub3QgYmUgdGVzdGVkIHlldFxuICAgICAgICAvL1xuICAgICAgICAvLyDCtVRhcmdldC5hcHBlbmQoICc8ZGl2LmEtLW5ldy0tZGl2PicgKTtcbiAgICAgICAgLy8gYXNzZXJ0LmRlZXBFcXVhbCggwrUoICcuYS0tbmV3LS1kaXYnIClbMF0sIMK1VGFyZ2V0LmNoaWxkcmVuKClbMF0sICdhdHRhY2hlZCBieSBjcmVhdGlvbiBzdHJpbmcnICk7XG4gICAgICAgIC8vIMK1KCAnLmEtLW5ldy0tZGl2JyApLnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciDCtUFub3RoZXJOZXdEaXYgPSDCtSggJzxkaXYuYS0tbmV3LS1kaXY+JyApO1xuXG4gICAgICAgIC8vIE5PTiBGVU5DVElPTkFMIFRFU1RcbiAgICAgICAgLy8gdGhpcyBpcyBhIGZ1dHVyZSBhYmlsaXR5IGFuZCBjYW5ub3QgYmUgdGVzdGVkIHlldFxuICAgICAgICAvL1xuICAgICAgICAvLyDCtVRhcmdldC5hcHBlbmQoIFsgwrVOZXdEaXYsIMK1QW5vdGhlck5ld0RpdiBdICk7XG4gICAgICAgIC8vIGFzc2VydC5lcXVhbCggwrUoICcuYS0tbmV3LS1kaXYnICkubGVuZ3RoLCAyLCAnYXR0YWNoZWQgMiBtaWNyb2JlcycgKTtcbiAgICAgICAgLy8gwrVOZXdEaXYucmVtb3ZlKCk7XG4gICAgICAgIC8vIMK1QW5vdGhlck5ld0Rpdi5yZW1vdmUoKTtcblxuICAgICAgICDCtVRhcmdldC5hcHBlbmQoIFsgwrVOZXdEaXZbMF0sIMK1QW5vdGhlck5ld0RpdlswXSBdICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUoICcuYS0tbmV3LS1kaXYnICkubGVuZ3RoLCAyLCAnYXR0YWNoZWQgMiBlbGVtZW50cycgKTtcbiAgICAgICAgwrVOZXdEaXYucmVtb3ZlKCk7XG4gICAgICAgIMK1QW5vdGhlck5ld0Rpdi5yZW1vdmUoKTtcblxuICAgICAgICAvLyBOT04gRlVOQ1RJT05BTCBURVNUXG4gICAgICAgIC8vIHRoaXMgaXMgYSBmdXR1cmUgYWJpbGl0eSBhbmQgY2Fubm90IGJlIHRlc3RlZCB5ZXRcbiAgICAgICAgLy9cbiAgICAgICAgLy8gwrVUYXJnZXQuYXBwZW5kKCBbICc8ZGl2LmEtLW5ldy0tZGl2PicsICc8ZGl2LmEtLW5ldy0tZGl2PicgXSApO1xuICAgICAgICAvLyBhc3NlcnQuZXF1YWwoIMK1KCAnLmEtLW5ldy0tZGl2JyApLmxlbmd0aCwgMiwgJ2F0dGFjaGVkIDIgY3JlYXRpb24gc3RyaW5ncycgKTtcbiAgICAgICAgLy8gwrVOZXdEaXYucmVtb3ZlKCk7XG4gICAgICAgIC8vIMK1QW5vdGhlck5ld0Rpdi5yZW1vdmUoKTtcbiAgICAgICAgXG5cbiAgICAgICAgdmFyIGVsO1xuICAgICAgICB2YXIgwrVEaXYgPSDCtSggJ2RpdicgKS5maXJzdCgpO1xuICAgICAgICB2YXIgJERpdiA9ICQoICdkaXYnICkuZmlyc3QoKTtcblxuICAgICAgICB2YXIgdmFuaWxsYVJlbW92ZSA9IGZ1bmN0aW9uKCBlbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGVsICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXYuYXBwZW5kKCBlbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICAgICAgICDCtURpdi5hcHBlbmQoIGVsICk7XG5cbiAgICAgICAgICAgIHZhbmlsbGFSZW1vdmUoIGVsICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyREaXYuYXBwZW5kKCBlbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICAgICAgICAkRGl2LmFwcGVuZCggZWwgKTtcblxuICAgICAgICAgICAgdmFuaWxsYVJlbW92ZSggZWwgKTtcbiAgICAgICAgfSwgMjIgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5hdHRyKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5hdHRyLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtVRhcmdldCA9IMK1KCAnI2V4YW1wbGUtLWlkJyApO1xuXG4gICAgICAgIMK1VGFyZ2V0LmF0dHIoICd0ZXN0aW5nJywgJ3Nob3VsZCB3b3JrJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1VGFyZ2V0WzBdLmdldEF0dHJpYnV0ZSggJ3Rlc3RpbmcnICksICdzaG91bGQgd29yaycsICdhdHRyaWJ1dGUgc2V0JyApO1xuXG4gICAgICAgIHZhciBhdHRyR290dGVuID0gwrVUYXJnZXQuYXR0ciggJ3Rlc3RpbmcnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggYXR0ckdvdHRlblswXSwgJ3Nob3VsZCB3b3JrJywgJ2F0dHJpYnV0ZSBnb3R0ZW4nICk7XG5cbiAgICAgICAgwrVUYXJnZXQuYXR0ciggJ3Rlc3RpbmcnLCBudWxsICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVUYXJnZXRbMF0uZ2V0QXR0cmlidXRlKCAndGVzdGluZycgKSwgbnVsbCwgJ2F0dHJpYnV0ZSByZW1vdmVkJyApO1xuXG4gICAgICAgIHZhciDCtURpdnMgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyICREaXZzID0gJCggJ2RpdicgKTtcblxuICAgICAgICB2YXIgdmFuaWxsYVJlbW92ZSA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsZW5JID0gwrVEaXZzLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgwrVEaXZzWyBpIF0ucmVtb3ZlQXR0cmlidXRlKCAnbW9vJyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1RGl2cy5hdHRyKCBcXCdtb29cXCcsIFxcJ21vb29vb29vb29vb29vb25cXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLmF0dHIoICdtb28nLCAnbW9vb29vb29vb29vb29vbicgKTtcblxuICAgICAgICAgICAgdmFuaWxsYVJlbW92ZSgpO1xuICAgICAgICB9LFxuXG4gICAgICAgICckRGl2cy5hdHRyKCBcXCdtb29cXCcsIFxcJ21vb29vb29vb29vb29vb25cXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJERpdnMuYXR0ciggJ21vbycsICdtb29vb29vb29vb29vb29uJyApO1xuXG4gICAgICAgICAgICB2YW5pbGxhUmVtb3ZlKCk7XG4gICAgICAgIH0sIDIzICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuY2hpbGRyZW4oKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmNoaWxkcmVuLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciBjaGlsZHJlbiA9IMK1KCAnLmV4YW1wbGUtLWNsYXNzJyApLmNoaWxkcmVuKCk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5pc0FycmF5KCBjaGlsZHJlbiApLCAncmV0dXJucyBhbiBhcnJheScgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCBjaGlsZHJlblswXS50eXBlID09PSAnW29iamVjdCBNaWNyb2JlXScsICdmdWxsIG9mIG1pY3JvYmVzJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtSggJy5leGFtcGxlLS1jbGFzcycgKVswXS5jaGlsZHJlblswXSwgY2hpbGRyZW5bMF1bMF0sICd0aGUgY29ycmVjdCBjaGlsZHJlbicgKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCAyNCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmNzcygpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuY3NzLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtVRhcmdldCA9IMK1KCAnI2V4YW1wbGUtLWlkJyApO1xuXG4gICAgICAgIMK1VGFyZ2V0LmNzcyggJ2JhY2tncm91bmQtY29sb3InLCAncmdiKDI1NSwgMCwgMCknICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yLCAncmdiKDI1NSwgMCwgMCknLCAnY3NzIHNldCcgKTtcblxuICAgICAgICB2YXIgY3NzR290dGVuID0gwrVUYXJnZXQuY3NzKCAnYmFja2dyb3VuZC1jb2xvcicgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5pc0FycmF5KCBjc3NHb3R0ZW4gKSwgJ2NzcyBnZXQgcmV0dXJucyBhbiBhcnJheScgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCB0eXBlb2YgY3NzR290dGVuWzBdID09PSAnc3RyaW5nJywgJ2Z1bGwgb2Ygc3RyaW5ncycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCBjc3NHb3R0ZW4ubGVuZ3RoLCDCtVRhcmdldC5sZW5ndGgsICdjb3JyZWN0IGFtb3VudCBvZiByZXN1bHRzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIGNzc0dvdHRlblswXSwgJ3JnYigyNTUsIDAsIDApJywgJ2NvcnJlY3QgcmVzdWx0JyApO1xuXG5cbiAgICAgICAgwrVUYXJnZXQuY3NzKCAnYmFja2dyb3VuZC1jb2xvcicsIG51bGwgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IsICcnLCAnY3NzIHJlbW92ZWQnICk7XG5cblxuICAgICAgICDCtVRhcmdldCA9IMK1KCAnI2V4YW1wbGUtLWlkJyApO1xuICAgICAgICB2YXIgJFRhcmdldCA9ICQoICcjZXhhbXBsZS0taWQnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVUYXJnZXQuY3NzKCBcXCdiYWNrZ3JvdW5kLWNvbG9yXFwnLCBcXCcjZjAwXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIMK1VGFyZ2V0LmNzcyggJ2JhY2tncm91bmQtY29sb3InLCAnI2YwMCcgKTtcbiAgICAgICAgICAgIMK1VGFyZ2V0LmNzcyggJ2JhY2tncm91bmQtY29sb3InLCBudWxsICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyRUYXJnZXQuY3NzKCBcXCdiYWNrZ3JvdW5kLWNvbG9yXFwnLCBcXCcjZjAwXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICRUYXJnZXQuY3NzKCAnYmFja2dyb3VuZC1jb2xvcicsICcjZjAwJyApO1xuICAgICAgICAgICAgJFRhcmdldC5jc3MoICdiYWNrZ3JvdW5kLWNvbG9yJywgbnVsbCApO1xuICAgICAgICB9LCAyNSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmVhY2goKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmVhY2gsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciBkaXZzICAgID0gW107XG5cbiAgICAgICAgwrVEaXZzLmVhY2goIGZ1bmN0aW9uKCBfZWwgKXsgZGl2cy5wdXNoKCBfZWwgKTsgfSApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2cy5sZW5ndGgsIGRpdnMubGVuZ3RoLCAncHVzaGVkIGVhY2ggZWxlbWVudCcgKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggwrVEaXZzWyAwIF0sIGRpdnNbIDAgXSwgJ2NvcnJlY3QgcmVzdWx0JyApO1xuXG4gICAgICAgIMK1RGl2cyAgICAgICA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgJERpdnMgICA9ICQoICdkaXYnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLmVhY2goIGZ1bmN0aW9uKCBfZWwsIGkgKXt9ICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgICAgIMK1RGl2cy5lYWNoKCBmdW5jdGlvbiggX2VsLCBpIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaCggX2VsLmlkICk7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyREaXZzLmVhY2goIGZ1bmN0aW9uKCBfZWwsIGkgKXt9ICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgICAgICREaXZzLmVhY2goIGZ1bmN0aW9uKCBfZWwsIGkgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKCBfZWwuaWQgKTtcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfSwgMjYgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5maWx0ZXIoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmZpbHRlciwgJ2V4aXN0cycgKTtcbiAgICAgICAgdmFyIMK1RGl2cyAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciDCtUlkICAgICA9IMK1RGl2cy5maWx0ZXIoICcjcXVuaXQnICk7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUlkLmxlbmd0aCwgMSwgJ3NlbGVjdHMgdGhlIGNvcnJlY3QgZWxlbWVudCcgKTtcblxuICAgICAgICAgICAgwrVJZCAgICAgPSDCtURpdnMuZmlsdGVyKCAnOmx0KDMpJyApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVJZC5sZW5ndGgsIDMsICdhY2NlcHRzIHBzZXVkbyBzZWxlY3RvcnMnICk7XG5cbiAgICAgICAgdmFyICREaXZzO1xuICAgICAgICBcbiAgICAgICAgdmFyIHJlc2V0RGl2cyA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzICAgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgICAgICREaXZzICAgPSAkKCAnZGl2JyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1RGl2cy5maWx0ZXIoIFxcJyNxdW5pdFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXNldERpdnMoKTtcbiAgICAgICAgICAgIMK1RGl2cy5maWx0ZXIoICcjcXVuaXQnICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyREaXZzLmZpbHRlciggXFwncXVuaXRcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzZXREaXZzKCk7XG4gICAgICAgICAgICAkRGl2cy5maWx0ZXIoICcjcXVuaXQnICk7XG4gICAgICAgIH0sIDI3ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuZmluZCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuZmluZCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVEaXYgICAgPSDCtSggJyNxdW5pdCcgKTtcbiAgICAgICAgdmFyIMK1SDIgICAgID0gwrVEaXYuZmluZCggJ2gyJyApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVIMi5sZW5ndGgsIDIsICdzZWxlY3RzIGVub3VnaCBjaGlsZCBlbGVtZW50cycgKTtcblxuICAgICAgICAgICAgwrVIMiAgICAgPSDCtURpdi5maW5kKCAnOmZpcnN0JyApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVIMi5sZW5ndGgsIDEsICdhY2NlcHRzIHBzZXVkbyBzZWxlY3RvcnMnICk7XG5cblxuICAgICAgICB2YXIgJERpdnM7XG4gICAgICAgIFxuICAgICAgICB2YXIgcmVzZXREaXZzID0gZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtURpdnMgICA9IMK1KCAnZGl2JyApO1xuICAgICAgICAgICAgJERpdnMgICA9ICQoICdkaXYnICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLmZpbmQoIFxcJ2gyXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc2V0RGl2cygpO1xuICAgICAgICAgICAgwrVEaXZzLmZpbmQoICdoMicgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdnMuZmluZCgpJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXNldERpdnMoKTtcbiAgICAgICAgICAgICREaXZzLmZpbmQoICdoMicgKTtcbiAgICAgICAgfSwgMjggKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5maXJzdCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuZmlyc3QsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RXZlcnl0aGluZyA9IMK1KCAnKicgKTtcbiAgICAgICAgdmFyIMK1Rmlyc3QgPSDCtUV2ZXJ5dGhpbmcuZmlyc3QoKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1Rmlyc3QudHlwZSwgJ1tvYmplY3QgTWljcm9iZV0nLCAncmV0dXJucyBhIG1pY3JvYmUnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVGaXJzdC5sZW5ndGgsIDEsICdvZiBsZW5ndGggMScgKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggwrVFdmVyeXRoaW5nWzBdLCDCtUZpcnN0WzBdLCAndGhhdCBpcyBhY3R1YWxseSB0aGUgZmlyc3Qgb25lJyApO1xuXG4gICAgICAgIHZhciDCtURpdnMgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyICREaXZzID0gJCggJ2RpdicgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtURpdnMuZmlyc3QoKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLmZpcnN0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyREaXZzLmZpcnN0KCknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXZzLmZpcnN0KCk7XG4gICAgICAgIH0sIDI5ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuZ2V0UGFyZW50SW5kZXgoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmdldFBhcmVudEluZGV4LCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciBzZXR1cCAgICAgICA9IMK1KCAnI2V4YW1wbGUtLWNvbWJpbmVkJyApLnBhcmVudCgpLmNoaWxkcmVuKClbMF07XG5cbiAgICAgICAgdmFyIGxpdGVyYWwgICAgID0gc2V0dXBbM107XG4gICAgICAgIHZhciBfZnVuY3Rpb24gICA9IHNldHVwWyDCtSggJyNleGFtcGxlLS1jb21iaW5lZCcgKS5nZXRQYXJlbnRJbmRleCgpWzBdIF07XG5cbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggbGl0ZXJhbCwgX2Z1bmN0aW9uLCAncGFyZW50IGluZGV4IGlzIGNvcnJlY3RseSBkZXRlcm1pbmVkJyApO1xuXG5cbiAgICAgICAgdmFyIMK1RGl2ID0gwrUoICdkaXYnICkuZmlyc3QoKTtcbiAgICAgICAgdmFyICREaXYgPSAkKCAnZGl2JyApLmZpcnN0KCk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXYuZ2V0UGFyZW50SW5kZXgoKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXYuZ2V0UGFyZW50SW5kZXgoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdi5nZXRQYXJlbnRJbmRleCgpJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgJERpdlBhcmVudCAgPSAkRGl2LnBhcmVudCgpO1xuICAgICAgICAgICAgJERpdlBhcmVudC5pbmRleCggJERpdiApO1xuICAgICAgICB9LCAzMCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmhhc0NsYXNzKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5oYXNDbGFzcywgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVFeGFtcGxlQ2xhc3MgPSDCtSggJy5leGFtcGxlLS1jbGFzcycgKTtcblxuICAgICAgICB2YXIgZXhhbXBsZUNsYXNzID0gwrVFeGFtcGxlQ2xhc3MuaGFzQ2xhc3MoICdleGFtcGxlLS1jbGFzcycgKTtcblxuICAgICAgICBhc3NlcnQub2soIGV4YW1wbGVDbGFzcy5sZW5ndGggPT09IMK1RXhhbXBsZUNsYXNzLmxlbmd0aCwgJ2l0IGNoZWNrcyBldmVyeSBlbGVtZW50JyApO1xuXG4gICAgICAgIHZhciBjb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgZm9yICggdmFyIGkgPSAwLCBsZW5JID0gZXhhbXBsZUNsYXNzLmxlbmd0aDsgaSA8IGxlbkk7IGkrKyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlmICggISBleGFtcGxlQ2xhc3NbIGkgXSApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGFzc2VydC5vayggY29ycmVjdCwgJ2NvcnJlY3RseScgKTtcblxuXG4gICAgICAgIGJ1aWxkVGVzdCggJ05vIGNvbXBhcmlzb24gYXZhaWxhYmxlLicsIDMxICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuaHRtbCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuaHRtbCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVUYXJnZXQgPSDCtSggJyNleGFtcGxlLS1pZCcgKTtcblxuICAgICAgICDCtVRhcmdldC5odG1sKCAndGV4dCwgeW8nICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVUYXJnZXRbMF0uaW5uZXJIVE1MLCAndGV4dCwgeW8nLCAnaHRtbCBzZXQnICk7XG5cbiAgICAgICAgdmFyIGh0bWxHb3R0ZW4gPSDCtVRhcmdldC5odG1sKCk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNBcnJheSggaHRtbEdvdHRlbiApLCAnaHRtbCgpIGdldCByZXR1cm5zIGFuIGFycmF5JyApO1xuICAgICAgICBhc3NlcnQub2soIHR5cGVvZiBodG1sR290dGVuWzBdID09PSAnc3RyaW5nJywgJ2Z1bGwgb2Ygc3RyaW5ncycgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIGh0bWxHb3R0ZW4ubGVuZ3RoLCDCtVRhcmdldC5sZW5ndGgsICdjb3JyZWN0IGFtb3VudCBvZiByZXN1bHRzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIGh0bWxHb3R0ZW5bMF0sICd0ZXh0LCB5bycsICdjb3JyZWN0IHJlc3VsdCcgKTtcblxuICAgICAgICDCtVRhcmdldC5odG1sKCAnJyApO1xuXG4gICAgICAgIMK1VGFyZ2V0ID0gwrUoICcjZXhhbXBsZS0taWQnICk7XG4gICAgICAgIHZhciAkVGFyZ2V0ID0gJCggJyNleGFtcGxlLS1pZCcgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtVRhcmdldC5odG1sKCBcXCdibGFyZ1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtVRhcmdldC5odG1sKCAnYmxhcmcnICk7XG4gICAgICAgICAgICDCtVRhcmdldC5odG1sKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyRUYXJnZXQuaHRtbCggXFwnYmxhcmdcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJFRhcmdldC5odG1sKCAnYmxhcmcnICk7XG4gICAgICAgICAgICAkVGFyZ2V0Lmh0bWwoKTtcbiAgICAgICAgfSwgMzIgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5pbmRleE9mKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5pbmRleE9mLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtVRhcmdldCA9IMK1KCAnI2V4YW1wbGUtLWlkJyApO1xuXG4gICAgICAgIHZhciB0YXJnZXQgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdleGFtcGxlLS1pZCcgKTtcbiAgICAgICAgdmFyIGluZGV4ICAgPSDCtVRhcmdldC5pbmRleE9mKCB0YXJnZXQgKTtcblxuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtVRhcmdldFsgaW5kZXggXSwgdGFyZ2V0LCAnaW5kZXggY29ycmVjdGx5IGRldGVybWluZWQnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciAkRGl2cyAgID0gJCggJ2RpdicgKTtcbiAgICAgICAgdmFyIF9lbCAgICAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ1FVbml0JyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1RGl2cy5pbmRleE9mKCBfZWwgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLmluZGV4T2YoIF9lbCApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckRGl2cy5pbmRleCggX2VsICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXZzLmluZGV4KCBfZWwgKTtcbiAgICAgICAgfSwgMzMgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5pbnNlcnRBZnRlcigpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuaW5zZXJ0QWZ0ZXIsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1VGFyZ2V0ID0gwrUoICcjZXhhbXBsZS0taWQnICk7XG4gICAgICAgIHZhciDCtVRhcmdldEluZGV4ID0gwrVUYXJnZXQuZ2V0UGFyZW50SW5kZXgoKVswXTtcblxuICAgICAgICB2YXIgwrVUYXJnZXRQYXJlbnQgPSDCtVRhcmdldC5wYXJlbnQoKTtcbiAgICAgICAgdmFyIMK1VGFyZ2V0UGFyZW50Q2hpbGRyZW4gPSDCtVRhcmdldFBhcmVudC5jaGlsZHJlbigpWzBdLmxlbmd0aDtcblxuICAgICAgICB2YXIgX2VsID0gJzxhZGRlZERpdlRoaW5nPic7XG4gICAgICAgIMK1VGFyZ2V0Lmluc2VydEFmdGVyKCBfZWwgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtVRhcmdldFBhcmVudENoaWxkcmVuICsgMSwgwrVUYXJnZXRQYXJlbnQuY2hpbGRyZW4oKVswXS5sZW5ndGgsICdhZGQgYnkgbmV3IHN0cmluZycgKTtcbiAgICAgICAgwrUoICdhZGRlZERpdlRoaW5nJyApLnJlbW92ZSgpO1xuXG5cbiAgICAgICAgdmFyIMK1RWwgPSDCtSggX2VsICk7XG4gICAgICAgIMK1VGFyZ2V0Lmluc2VydEFmdGVyKCDCtUVsICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVUYXJnZXRQYXJlbnRDaGlsZHJlbiArIDEsIMK1VGFyZ2V0UGFyZW50LmNoaWxkcmVuKClbMF0ubGVuZ3RoLCAnYWRkIGJ5IG5ldyBtaWNyb2JlJyApO1xuICAgICAgICDCtSggJ2FkZGVkRGl2VGhpbmcnICkucmVtb3ZlKCk7XG5cbiAgICAgICAgwrVFbCA9IMK1KCAnPGFkZGVkRGl2VGhpbmc+JyApWzBdO1xuICAgICAgICDCtVRhcmdldC5pbnNlcnRBZnRlciggwrVFbCApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1VGFyZ2V0UGFyZW50Q2hpbGRyZW4gKyAxLCDCtVRhcmdldFBhcmVudC5jaGlsZHJlbigpWzBdLmxlbmd0aCwgJ2FkZCBieSBuZXcgZWxlbWVudCcgKTtcbiAgICAgICAgwrUoICdhZGRlZERpdlRoaW5nJyApLnJlbW92ZSgpO1xuXG5cbiAgICAgICAgdmFyIHNpYmxpbmdEaXYgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCAncXVuaXQnICk7XG4gICAgICAgIHZhciDCtVNpYmxpbmdEaXYgICAgID0gwrUoIHNpYmxpbmdEaXYgKTtcbiAgICAgICAgdmFyICRTaWJsaW5nRGl2ICAgICA9ICQoIHNpYmxpbmdEaXYgKTtcbiAgICAgICAgdmFyIHBhcmVudERpdiAgICAgICA9IHNpYmxpbmdEaXYucGFyZW50Tm9kZTtcblxuICAgICAgICB2YXIgdmFuaWxsYUNyZWF0ZSA9IGZ1bmN0aW9uKCBpIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGVsICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICAgICAgICBlbCAgICAgID0gWyDCtSggZWwgKSwgJCggZWwgKSBdO1xuXG4gICAgICAgICAgICByZXR1cm4gZWxbIGkgXTtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdmFuaWxsYVJlbW92ZSA9IGZ1bmN0aW9uKCBlbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIHBhcmVudERpdi5yZW1vdmVDaGlsZCggZWxbIDAgXSApO1xuICAgICAgICB9O1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1RGl2Lmluc2VydEFmdGVyKCBlbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB2YXIgwrVFbCA9IHZhbmlsbGFDcmVhdGUoIDAgKTtcblxuICAgICAgICAgICAgwrVTaWJsaW5nRGl2Lmluc2VydEFmdGVyKCDCtUVsICk7XG5cbiAgICAgICAgICAgIHZhbmlsbGFSZW1vdmUoIMK1RWwgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdi5pbnNlcnRBZnRlciggZWwgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyICRFbCA9IHZhbmlsbGFDcmVhdGUoIDEgKTtcblxuICAgICAgICAgICAgJEVsLmluc2VydEFmdGVyKCAkU2libGluZ0RpdiApO1xuXG4gICAgICAgICAgICB2YW5pbGxhUmVtb3ZlKCAkRWwgKTtcbiAgICAgICAgfSwgMzQgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5sYXN0KCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5sYXN0LCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtUV2ZXJ5dGhpbmcgPSDCtSggJyonICk7XG4gICAgICAgIHZhciDCtUxhc3QgPSDCtUV2ZXJ5dGhpbmcubGFzdCgpO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVMYXN0LnR5cGUsICdbb2JqZWN0IE1pY3JvYmVdJywgJ3JldHVybnMgYSBtaWNyb2JlJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1TGFzdC5sZW5ndGgsIDEsICdvZiBsZW5ndGggMScgKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggwrVMYXN0WzBdLCDCtUV2ZXJ5dGhpbmdbIMK1RXZlcnl0aGluZy5sZW5ndGggLSAxIF0sICd0aGF0IGlzIGFjdHVhbGx5IHRoZSBsYXN0IG9uZScgKTtcblxuICAgICAgICB2YXIgwrVEaXZzID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciAkRGl2cyA9ICQoICdkaXYnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLmxhc3QoKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLmxhc3QoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdnMubGFzdCgpJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAkRGl2cy5sYXN0KCk7XG4gICAgICAgIH0sIDM1ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcubWFwKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5tYXAsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyA9IMK1KCAnZGl2JyApO1xuXG4gICAgICAgIMK1RGl2cy5tYXAoIGZ1bmN0aW9uKCBlbCApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGVsLm1vbyA9ICdtb28nO1xuICAgICAgICB9ICk7XG5cbiAgICAgICAgdmFyIHJhbmQgPSBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogwrVEaXZzLmxlbmd0aCApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVEaXZzWyByYW5kIF0ubW9vLCAnbW9vJywgJ2FwcGxpZXMgdG8gYWxsIGVsZW1lbnRzJyApO1xuXG5cbiAgICAgICAgICAgIMK1RGl2cyA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgJERpdnMgPSAkKCAnZGl2JyApO1xuXG4gICAgICAgIHZhciByZXNldERpdnMgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIMK1RGl2cyA9IMK1KCAnZGl2JyApO1xuICAgICAgICAgICAgJERpdnMgPSAkKCAnZGl2JyApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLmxhc3QoIGZ1bmN0aW9uKCl7fSApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXNldERpdnMoKTtcblxuICAgICAgICAgICAgwrVEaXZzLm1hcCggZnVuY3Rpb24oIGVsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbC5tb28gPSAnbW9vJztcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdnMubWFwKCBmdW5jdGlvbigpe30gKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVzZXREaXZzKCk7XG5cbiAgICAgICAgICAgICREaXZzLm1hcCggZnVuY3Rpb24oIGVsIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBlbC5tb28gPSAnbW9vJztcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgfSwgMzYgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5wYXJlbnQoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLnBhcmVudCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVCb2R5ICAgPSDCtSggJ2JvZHknICk7XG4gICAgICAgIHZhciDCtVBhcmVudCA9IMK1Qm9keS5wYXJlbnQoKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1UGFyZW50LnR5cGUsICdbb2JqZWN0IE1pY3JvYmVdJywgJ3JldHVybnMgYSBtaWNyb2JlJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1UGFyZW50Lmxlbmd0aCwgMSwgJ29mIGxlbmd0aCAxJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtVBhcmVudFswXSwgwrUoICdodG1sJyApWzBdLCAndGhhdCBpcyBhY3R1YWxseSB0aGUgcGFyZW50JyApO1xuXG4gICAgICAgIHZhciDCtURpdnMgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyICREaXZzID0gJCggJ2RpdicgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtURpdnMucGFyZW50KCknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIMK1RGl2cy5wYXJlbnQoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdnMucGFyZW50KCknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXZzLnBhcmVudCgpO1xuICAgICAgICB9LCAzNyApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnB1c2goKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLnB1c2gsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciDCtURpdnNMZW5ndGggPSDCtURpdnMubGVuZ3RoO1xuICAgICAgICB2YXIgbmV3RGl2ID0gwrUoICc8ZGl2PicgKVswXTtcblxuICAgICAgICDCtURpdnMucHVzaCggbmV3RGl2ICk7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtURpdnNMZW5ndGggKyAxLCDCtURpdnMubGVuZ3RoLCAncHVzaGVzIHRvIHRoZSBtaWNyb2JlJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCBuZXdEaXYsIMK1RGl2c1sgwrVEaXZzLmxlbmd0aCAtIDEgXSwgJ3RoYXQgaXMgdGhlIGNvcnJlY3QgZWxlbWVudCcgKTtcblxuICAgICAgICB2YXIgX2VsO1xuICAgICAgICB2YXIgwrVFbXB0eSA9IMK1KCBbXSApO1xuICAgICAgICB2YXIgJEVtcHR5ID0gJCggW10gKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtUVtcHR5LnB1c2goIF9lbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ1FVbml0JyApO1xuICAgICAgICAgICAgwrVFbXB0eS5wdXNoKCBfZWwgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJEVtcHR5LnB1c2goIF9lbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ1FVbml0JyApO1xuICAgICAgICAgICAgJEVtcHR5LnB1c2goIF9lbCApO1xuICAgICAgICB9LCAzOCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnJlbW92ZSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkucmVtb3ZlLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtUZpcnN0RGl2ICAgPSDCtSggJ2RpdicgKS5maXJzdCgpO1xuICAgICAgICDCtUZpcnN0RGl2LmFwcGVuZCggwrUoICc8ZGl2ZGl2LmRpdmlkZT4nIClbMF0gKTtcblxuICAgICAgICDCtSggJ2RpdmRpdicgKS5yZW1vdmUoKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1KCAnZGl2ZGl2JyApLmxlbmd0aCwgMCwgJ2lzIGNvbXBsZXRlbHkgcmVtb3ZlZCcgKTtcblxuICAgICAgICB2YXIgJEVsLCDCtUVsO1xuICAgICAgICB2YXIgcGFyZW50RGl2ICAgPSDCtSggJ2RpdicgKVswXTtcblxuICAgICAgICB2YXIgdmFuaWxsYUFkZCA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgICAgICAgwrVFbCAgICAgICAgID0gwrUoIGVsICk7XG4gICAgICAgICAgICAkRWwgICAgICAgICA9ICQoIGVsICk7XG5cbiAgICAgICAgICAgIHBhcmVudERpdi5hcHBlbmRDaGlsZCggZWwgKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtURpdi5yZW1vdmUoKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFuaWxsYUFkZCgpO1xuICAgICAgICAgICAgwrVFbC5yZW1vdmUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdi5yZW1vdmUoKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFuaWxsYUFkZCgpO1xuICAgICAgICAgICAgJEVsLnJlbW92ZSgpO1xuICAgICAgICB9LCAzOSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnJlbW92ZUNsYXNzKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5yZW1vdmVDbGFzcywgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVEaXZzICAgPSDCtSggJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuICAgICAgICDCtURpdnMucmVtb3ZlQ2xhc3MoICdleGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuXG4gICAgICAgIHZhciBjbGFzc0RhdGEgPSDCtURpdnNbMF0uZGF0YS5jbGFzcy5jbGFzcztcbiAgICAgICAgYXNzZXJ0Lm9rKCBjbGFzc0RhdGEuaW5kZXhPZiggJ2V4YW1wbGUtLWNsYXNzLS1ncm91cHMnICkgPT09IC0xLCAncmVtb3ZlQ2xhc3Mgc2V0cyBkYXRhJyApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUoICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKS5sZW5ndGgsIDAsICdyZW1vdmVkIGNsYXNzIHRvIGJvdGggZGl2cycgKTtcblxuICAgICAgICDCtURpdnMuYWRkQ2xhc3MoICdleGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuXG4gICAgICAgICAgICDCtURpdnMgICA9IMK1KCAnLmV4YW1wbGUtLWNsYXNzLS1ncm91cHMnICk7XG4gICAgICAgIHZhciAkRGl2cyAgID0gJCggJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuXG4gICAgICAgIHZhciByZXNldERpdnMgPSBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IMK1RGl2cy5sZW5ndGg7IGkgPCBsZW5JOyBpKysgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIMK1RGl2c1sgaSBdLmNsYXNzTmFtZSArPSAnIG1vbyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLnJlbW92ZUNsYXNzKCBcXCdtb29cXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLnJlbW92ZUNsYXNzKCAnbW9vJyApO1xuXG4gICAgICAgICAgICByZXNldERpdnMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdnMucmVtb3ZlQ2xhc3MoIFxcJ21vb1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAkRGl2cy5yZW1vdmVDbGFzcyggJ21vbycgKTtcblxuICAgICAgICAgICAgcmVzZXREaXZzKCk7XG4gICAgICAgIH0sIDQwICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuc2VsZWN0b3IoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLnNlbGVjdG9yLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciBfZWwgPSDCtSggJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApWzBdO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1KCBfZWwgKS5zZWxlY3RvcigpLCAnZGl2LmV4YW1wbGUtLWNsYXNzLmV4YW1wbGUtLWNsYXNzLS1ncm91cHMnLCAnY29ycmVjdGx5IHBhcnNlcyBjbGFzc2VzJyApO1xuXG4gICAgICAgIF9lbCA9IMK1KCAnI21pY3JvYmUtLWV4YW1wbGUtLWRvbScgKVswXTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtSggX2VsICkuc2VsZWN0b3IoKSwgJ2RpdiNtaWNyb2JlLS1leGFtcGxlLS1kb20nLCAnY29ycmVjdGx5IHBhcnNlcyBpZHMnICk7XG5cbiAgICAgICAgX2VsID0gwrUoICcjZXhhbXBsZS0tY29tYmluZWQnIClbMF07XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUoIF9lbCApLnNlbGVjdG9yKCksICdkaXYjZXhhbXBsZS0tY29tYmluZWQuZXhhbXBsZS0tY29tYmluZWQnLCAnY29ycmVjdGx5IHBhcnNlcyBjb21iaW5lZCcgKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCA0MSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnNwbGljZSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuc3BsaWNlLCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1KCAnZGl2JyApLnNwbGljZSggMCwgNSApLmxlbmd0aCwgNSwgJ2lzIHRoZSBjb3JyZWN0IGxlbmd0aCcgKTtcblxuICAgICAgICB2YXIgJERpdiA9ICQoICdkaXYnICksIMK1RGl2ID0gwrUoICdkaXYnICk7XG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1RGl2LnNwbGljZSggMCwgNSApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtURpdi5zcGxpY2UoIDAsIDUgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnwrVEaXYuc3BsaWNlKCAwLCA1ICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXYuc3BsaWNlKCAwLCA1ICk7XG4gICAgICAgIH0sIDQyICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcudGV4dCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkudGV4dCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVUYXJnZXQgPSDCtSggJyNleGFtcGxlLS1pZCcgKTtcblxuICAgICAgICDCtVRhcmdldC50ZXh0KCAndGV4dCwgeW8nICk7XG5cbiAgICAgICAgdmFyIF90ZXh0O1xuICAgICAgICBpZiggZG9jdW1lbnQuYWxsIClcbiAgICAgICAge1xuICAgICAgICAgICAgX3RleHQgPSDCtVRhcmdldFswXS5pbm5lclRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSAvLyBGRlxuICAgICAgICB7XG4gICAgICAgICAgICBfdGV4dCA9IMK1VGFyZ2V0WzBdLnRleHRDb250ZW50O1xuICAgICAgICB9XG5cblxuICAgICAgICBhc3NlcnQuZXF1YWwoIF90ZXh0LCAndGV4dCwgeW8nLCAndGV4dCBzZXQnICk7XG5cbiAgICAgICAgdmFyIHRleHRHb3R0ZW4gPSDCtVRhcmdldC50ZXh0KCk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNBcnJheSggdGV4dEdvdHRlbiApLCAndGV4dCgpIGdldCByZXR1cm5zIGFuIGFycmF5JyApO1xuICAgICAgICBhc3NlcnQub2soIHR5cGVvZiB0ZXh0R290dGVuWzBdID09PSAnc3RyaW5nJywgJ2Z1bGwgb2Ygc3RyaW5ncycgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIHRleHRHb3R0ZW4ubGVuZ3RoLCDCtVRhcmdldC5sZW5ndGgsICdjb3JyZWN0IGFtb3VudCBvZiByZXN1bHRzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIHRleHRHb3R0ZW5bMF0sICd0ZXh0LCB5bycsICdjb3JyZWN0IHJlc3VsdCcgKTtcblxuICAgICAgICDCtVRhcmdldC50ZXh0KCAnJyApO1xuXG4gICAgICAgIMK1VGFyZ2V0ID0gwrUoICcjZXhhbXBsZS0taWQnICk7XG4gICAgICAgIHZhciAkVGFyZ2V0ID0gJCggJyNleGFtcGxlLS1pZCcgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtVRhcmdldC50ZXh0KCBcXCdibGFyZ1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtVRhcmdldC50ZXh0KCAnYmxhcmcnICk7XG4gICAgICAgICAgICDCtVRhcmdldC50ZXh0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyRUYXJnZXQudGV4dCggXFwnYmxhcmdcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJFRhcmdldC50ZXh0KCAnYmxhcmcnICk7XG4gICAgICAgICAgICAkVGFyZ2V0LnRleHQoKTtcbiAgICAgICAgfSwgNDMgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy50b2dnbGVDbGFzcygpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkudG9nZ2xlQ2xhc3MsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RGl2cyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKTtcblxuICAgICAgICDCtURpdnMudG9nZ2xlQ2xhc3MoICdleGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2cy5maXJzdCgpLmhhc0NsYXNzKCAnZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKVswXSwgZmFsc2UsICdyZW1vdmVzIGNsYXNzZXMnICk7XG5cbiAgICAgICAgwrVEaXZzLnRvZ2dsZUNsYXNzKCAnZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtURpdnMuZmlyc3QoKS5oYXNDbGFzcyggJ2V4YW1wbGUtLWNsYXNzLS1ncm91cHMnIClbMF0sIHRydWUsICdhZGRzIGNsYXNzZXMnICk7XG5cbiAgICAgICAgICAgIMK1RGl2cyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKTtcbiAgICAgICAgdmFyICREaXZzICAgPSAkKCAnLmV4YW1wbGUtLWNsYXNzLS1ncm91cHMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXZzLnRvZ2dsZUNsYXNzKCBcXCdtb29cXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzLnRvZ2dsZUNsYXNzKCAnbW9vJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckRGl2cy50b2dnbGVDbGFzcyggXFwnbW9vXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICREaXZzLnRvZ2dsZUNsYXNzKCAnbW9vJyApO1xuICAgICAgICB9LCA0NCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmV4dGVuZCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkuZXh0ZW5kLCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQub2soIMK1LmV4dGVuZCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVEaXZzID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciBleHRlbnNpb24gPSB7IG1vcmU6IGZ1bmN0aW9uKCl7IHJldHVybiAnTU9BUiEhISc7IH0gfTtcbiAgICAgICAgwrVEaXZzLmV4dGVuZCggZXh0ZW5zaW9uICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVEaXZzLm1vcmUoKSwgJ01PQVIhISEnLCAnZXh0ZW5kcyBtaWNyb2JlcycgKTtcblxuICAgICAgICB2YXIgX29iaiA9IHsgYTogMSwgYjogMiwgYzozIH07XG4gICAgICAgIMK1LmV4dGVuZCggX29iaiwgZXh0ZW5zaW9uICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggX29iai5tb3JlKCksICdNT0FSISEhJywgJ2V4dGVuZHMgb2JqZWN0cycgKTtcblxuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1LmV4dGVuZCggX29iaiwgZXh0ZW5zaW9uICk7JywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAvKiB0aGVzZSBhcmUgY29tbWVudGVkIG91dCB0byBkcmF3IGF0dGVudGlvbiB0byBob3cgc2xvdyB0aGUgXG4gICAgICAgICAgICAgICBvdGhlciBmdW5jdGlvbiBpcyBjb21wYXJhdGl2ZWx5LiAgdGhpcyBvbmUgaXMgcXVpdGUgYSBiaXQgZmFzdGVyICovXG4gICAgICAgICAgICAvLyBleHRlbnNpb24gPSB7IG1vcmU6IGZ1bmN0aW9uKCl7IHJldHVybiAnTU9BUiEhISc7IH0gfTtcbiAgICAgICAgICAgIC8vIF9vYmogPSDCtSggJ2RpdicgKTtcbiAgICAgICAgICAgIC8vIF9vYmouZXh0ZW5kKCBleHRlbnNpb24gKTtcblxuICAgICAgICAgICAgZXh0ZW5zaW9uICAgPSB7IG1vcmU6IGZ1bmN0aW9uKCl7IHJldHVybiAnTU9BUiEhISc7IH0gfTtcbiAgICAgICAgICAgIF9vYmogICAgICAgID0geyBhOiAxLCBiOiAyLCBjOjMgfTtcbiAgICAgICAgICAgIMK1LmV4dGVuZCggX29iaiwgZXh0ZW5zaW9uICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQuZXh0ZW5kKCBfb2JqLCBleHRlbnNpb24gKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgLyogdGhlc2UgYXJlIGNvbW1lbnRlZCBvdXQgdG8gZHJhdyBhdHRlbnRpb24gdG8gaG93IHNsb3cgdGhlIFxuICAgICAgICAgICAgICAgb3RoZXIgZnVuY3Rpb24gaXMgY29tcGFyYXRpdmVseS4gIHRoaXMgb25lIGlzIHF1aXRlIGEgYml0IGZhc3RlciAqL1xuICAgICAgICAgICAgLy8gZXh0ZW5zaW9uICAgPSB7IG1vcmU6IGZ1bmN0aW9uKCl7IHJldHVybiAnTU9BUiEhISc7IH0gfTtcbiAgICAgICAgICAgIC8vIF9vYmogPSAkKCAnZGl2JyApO1xuICAgICAgICAgICAgLy8gX29iai5leHRlbmQoIGV4dGVuc2lvbiApO1xuXG4gICAgICAgICAgICBleHRlbnNpb24gICA9IHsgbW9yZTogZnVuY3Rpb24oKXsgcmV0dXJuICdNT0FSISEhJzsgfSB9O1xuICAgICAgICAgICAgX29iaiAgICAgICAgPSB7IGE6IDEsIGI6IDIsIGM6MyB9O1xuICAgICAgICAgICAgJC5leHRlbmQoIF9vYmosIGV4dGVuc2lvbiApO1xuICAgICAgICB9LCA0NSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLm1lcmdlKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS5tZXJnZSwgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5tZXJnZSwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVEaXZzICAgICAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciBkaXZDb3VudCAgICA9IMK1RGl2cy5sZW5ndGg7XG4gICAgICAgIHZhciDCtUh0bWwgICAgICAgPSDCtSggJ2h0bWwnICk7XG4gICAgICAgIHZhciBodG1sQ291bnQgICA9IMK1SHRtbC5sZW5ndGg7XG5cbiAgICAgICAgdmFyIG1lcmdlZCAgICAgID0gwrUubWVyZ2UoIMK1RGl2cywgwrVIdG1sICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggZGl2Q291bnQgKyBodG1sQ291bnQsIG1lcmdlZC5sZW5ndGgsICdtZXJnZWQgbWljcm9iZXMnICk7XG5cbiAgICAgICAgbWVyZ2VkID0gwrUubWVyZ2UoIFsgMSwgMiwgMyBdLCBbIDQsIDUsIDYgXSApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIDYsIG1lcmdlZC5sZW5ndGgsICdtZXJnZWQgYXJyYXlzJyApO1xuXG4gICAgICAgIMK1RGl2cyAgICAgICA9IMK1KCAnZGl2JyApO1xuICAgICAgICDCtURpdnMubWVyZ2UoIMK1SHRtbCApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2cy5sZW5ndGgsIGRpdkNvdW50ICsgaHRtbENvdW50LCAnbWVyZ2VkIHRoaXMnICk7XG5cblxuICAgICAgICB2YXIgwrVEaXZzLCAkRGl2cywgwrVMaSwgJExpO1xuXG4gICAgICAgIHZhciByZWZyZXNoT2JqZWN0cyA9IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXZzID0gwrUoICdkaXYnICk7XG4gICAgICAgICAgICAkRGl2cyA9ICQoICdkaXYnICk7XG5cbiAgICAgICAgICAgIMK1TGkgPSDCtSggJ2xpJyApO1xuICAgICAgICAgICAgJExpID0gJCggJ2xpJyApO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUubWVyZ2UoIF9vYmosIGV4dGVuc2lvbiApOycsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmVmcmVzaE9iamVjdHMoKTtcblxuICAgICAgICAgICAgLyogdGhlc2UgYXJlIGNvbW1lbnRlZCBvdXQgYmVjYXVzZSBqcXVlcnkgZG9lc24ndCBoYW5kbGUgdGhpcyBzeW50YXggKi9cbiAgICAgICAgICAgIC8vIMK1RGl2cy5tZXJnZSggwrVMaSApO1xuXG4gICAgICAgICAgICDCtS5tZXJnZSggwrVEaXZzLCDCtUxpICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQubWVyZ2UoIF9vYmosIGV4dGVuc2lvbiApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZWZyZXNoT2JqZWN0cygpO1xuXG4gICAgICAgICAgICAvKiB0aGVzZSBhcmUgY29tbWVudGVkIG91dCBiZWNhdXNlIGpxdWVyeSBkb2Vzbid0IGhhbmRsZSB0aGlzIHN5bnRheCAqL1xuICAgICAgICAgICAgLy8gJERpdnMubWVyZ2UoICRMaSApO1xuXG4gICAgICAgICAgICAkLm1lcmdlKCAkRGl2cywgwrVMaSApO1xuICAgICAgICB9LCA0NiApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmNhcGl0YWxpemUoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5jYXBpdGFsaXplLCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQub2soIMK1LmNhcGl0YWxpc2UsICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5vayggwrUuY2FwaXRhbGlzZSggJ2kgZG9udCBrbm93JyApID09PSAnSSBEb250IEtub3cnLCAnY2FwaXRhbGl6ZXMgc3RyaW5ncycgKTtcblxuICAgICAgICB2YXIgc3RyQXJyID0gWyAnaSBkb250IGtub3cnLCAnZm9yIHJlYWwnIF07XG4gICAgICAgICAgICBzdHJBcnIgPSDCtS5jYXBpdGFsaXplKCBzdHJBcnIgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCBzdHJBcnJbMF0gPT09ICdJIERvbnQgS25vdycgJiYgc3RyQXJyWzFdID09PSAnRm9yIFJlYWwnLCAnY2FwaXRhbGl6ZXMgc3RyaW5nIGFycmF5cycgKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCA0NyApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmlkZW50aXR5KCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUuaWRlbnRpdHksICdleGlzdHMnICk7XG4gICAgICAgIHZhciB2YWwgPSAnbW9vb24nO1xuICAgICAgICBhc3NlcnQuZXF1YWwoICdtb29vbicsIMK1LmlkZW50aXR5KCAnbW9vb24nICksICdpdCBlcXVhbHMgaXRzZWxmJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdCggJ05vIHNwZWVkIHRlc3RzIGF2YWlsYWJsZS4nLCA0OCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLm5vb3AoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5ub29wLCAnbm9vcCBleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUubm9vcCgpLCB1bmRlZmluZWQsICdub3RoaW5nIGhhcHBlbnMnICk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS54eXp6eSwgJ3h5enp5IGV4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS54eXp6eSgpLCB1bmRlZmluZWQsICdub3RoaW5nIGhhcHBlbnMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KCAnTm8gc3BlZWQgdGVzdHMgYXZhaWxhYmxlLicsIDQ5ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuaXNBcnJheSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1LmlzQXJyYXksICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNBcnJheSggWyAxLCAyLCAzIF0gKSwgJ3RydWUgZm9yIGFycmF5JyApO1xuICAgICAgICBhc3NlcnQub2soICHCtS5pc0FycmF5KCB7IDE6ICdhJywgMjogJ2InIH0gKSwgJ2ZhbHNlIG90aGVyd2lzZScgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtS5pc0FycmF5JywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtS5pc0FycmF5KCB7fSApO1xuICAgICAgICAgICAgwrUuaXNBcnJheSggWyAxLCAyLCAzIF0gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJC5pc0FycmF5JywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAkLmlzQXJyYXkoIHt9ICk7XG4gICAgICAgICAgICAkLmlzQXJyYXkoIFsgMSwgMiwgMyBdICk7XG4gICAgICAgIH0sIDUwICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuaXNFbXB0eSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1LmlzRW1wdHksICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNFbXB0eSgge30gKSwgJ3RydWUgb24gZW1wdHknICk7XG4gICAgICAgIGFzc2VydC5vayggIcK1LmlzRW1wdHkoIHsgYTogMSB9ICksICdmYWxzZSBvdGhlcndpc2UnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUuaXNFbXB0eScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrUuaXNFbXB0eSgge30gKTtcbiAgICAgICAgICAgIMK1LmlzRW1wdHkoIHsgYTogMiB9ICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQuaXNFbXB0eU9iamVjdCcsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC5pc0VtcHR5T2JqZWN0KCB7fSApO1xuICAgICAgICAgICAgJC5pc0VtcHR5T2JqZWN0KCB7IGE6IDIgfSApO1xuICAgICAgICB9LCA1MSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmlzRnVuY3Rpb24oKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5pc0Z1bmN0aW9uLCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQub2soIMK1LmlzRnVuY3Rpb24oIGFzc2VydC5vayApLCAndHJ1ZSBvbiBmdW5jdGlvbicgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCAhwrUuaXNGdW5jdGlvbigge30gKSwgJ2ZhbHNlIG90aGVyd2lzZScgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtS5pc0Z1bmN0aW9uJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtS5pc0Z1bmN0aW9uKCBmdW5jdGlvbigpe30gKTtcbiAgICAgICAgICAgIMK1LmlzRnVuY3Rpb24oIFsgMSwgMiwgMyBdICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQuaXNGdW5jdGlvbicsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC5pc0Z1bmN0aW9uKCBmdW5jdGlvbigpe30gKTtcbiAgICAgICAgICAgICQuaXNGdW5jdGlvbiggWyAxLCAyLCAzIF0gKTtcbiAgICAgICAgfSwgNTIgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5pc09iamVjdCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1LmlzT2JqZWN0LCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQub2soIMK1LmlzT2JqZWN0KCB7fSApLCAndHJ1ZSBvbiBvYmplY3QnICk7XG4gICAgICAgIGFzc2VydC5vayggIcK1LmlzT2JqZWN0KCAnw6QnICksICdmYWxzZSBvdGhlcndpc2UnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUuaXNPYmplY3QnLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIMK1LmlzT2JqZWN0KCB7fSApO1xuICAgICAgICAgICAgwrUuaXNPYmplY3QoIFsgMSwgMiwgMyBdICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQuaXNQbGFpbk9iamVjdCcsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC5pc1BsYWluT2JqZWN0KCB7fSApO1xuICAgICAgICAgICAgJC5pc1BsYWluT2JqZWN0KCBbIDEsIDIsIDMgXSApO1xuICAgICAgICB9LCA1MyApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmlzVW5kZWZpbmVkKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciBwYXJlbnQgPSB7IGE6IDEgfTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5pc1VuZGVmaW5lZCwgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCAhwrUuaXNVbmRlZmluZWQoICdhJywgcGFyZW50ICksICdmYWxzZSBpZiBwYXJlbnQgY29udGFpbnMgcHJvcGVydHknICk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNVbmRlZmluZWQoICdiJywgcGFyZW50ICksICd0cnVlIG90aGVyd2lzZScgKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCA1NCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmlzV2luZG93KCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNXaW5kb3csICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5vayggwrUuaXNXaW5kb3coIHdpbmRvdyApLCAndHJ1ZSBvbiB3aW5kb3cnICk7XG4gICAgICAgIGFzc2VydC5vayggIcK1LmlzV2luZG93KCB7fSApLCAnZmFsc2Ugb3RoZXJ3aXNlJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1LmlzV2luZG93JywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtS5pc1dpbmRvdyggd2luZG93ICk7XG4gICAgICAgICAgICDCtS5pc1dpbmRvdyggWyAxLCAyLCAzIF0gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJC5pc1dpbmRvdycsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC5pc1dpbmRvdyggd2luZG93ICk7XG4gICAgICAgICAgICAkLmlzV2luZG93KCBbIDEsIDIsIDMgXSApO1xuICAgICAgICB9LCA1NSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnRvU3RyaW5nKCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS50b1N0cmluZywgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS50b1N0cmluZywgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLnRvU3RyaW5nKCkgPT09ICdbb2JqZWN0IE1pY3JvYmVdJywgJ21pY3Jpb2JlIGlzIGEgbWljcm9iZScgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtS50b1N0cmluZycsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrUudG9TdHJpbmcoIMK1ICk7XG4gICAgICAgICAgICDCtS50b1N0cmluZyggWyAxLCAyLCAzIF0gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJC50b1N0cmluZycsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC50b1N0cmluZyggJCApO1xuICAgICAgICAgICAgJC50b1N0cmluZyggWyAxLCAyLCAzIF0gKTtcbiAgICAgICAgfSwgNTYgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy50b0FycmF5KCknLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS50b0FycmF5LCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQub2soIMK1LnRvQXJyYXksICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIGFyciA9IMK1KCAnZGl2JyApLnRvQXJyYXkoKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCBhcnIgKSwgJ2FycmF5JywgJ21ha2VzIGFycmF5cycgKTtcblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCA1NyApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnR5cGUoKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS50eXBlLCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1LnR5cGUoIFtdICksICdhcnJheScsICdjaGVja3MgYXJyYXlzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1LnR5cGUoIDIgKSwgJ251bWJlcicsICdjaGVja3MgbnVtYmVycycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCB7fSApLCAnb2JqZWN0JywgJ2NoZWNrcyBvYmplY3RzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1LnR5cGUoICdtb2luIScgKSwgJ3N0cmluZycsICdjaGVja3Mgc3RyaW5ncycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCBuZXcgRGF0ZSgpICksICdkYXRlJywgJ2NoZWNrcyBkYXRlcycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCDCtSggJ2RpdicgKSApLCAnbWljcm9iZScsICdjaGVja3MgbWljcm9iZXMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUudHlwZSggL1swLTldLyApLCAncmVnRXhwJywgJ2NoZWNrcyByZWdleCcgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCBhc3NlcnQub2sgKSwgJ2Z1bmN0aW9uJywgJ2NoZWNrcyBmdW5jdGlvbnMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUudHlwZSggdHJ1ZSApLCAnYm9vbGVhbicsICdjaGVja3MgYm9vbGVhbiBwcmltaXRpdmVzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1LnR5cGUoIG5ldyBCb29sZWFuKCB0cnVlICkgKSwgJ29iamVjdCcsICdjaGVja3MgYm9vbGVhbiBvYmplY3RzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1LnR5cGUoIG5ldyBFcnJvcigpICksICdlcnJvcicsICdjaGVja3MgZXJyb3Igb2JqZWN0cycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtS50eXBlKCBuZXcgUHJvbWlzZShmdW5jdGlvbigpe30pICksICdwcm9taXNlJywgJ2NoZWNrcyBwcm9taXNlcycgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtS50eXBlJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtS50eXBlKCBbXSApO1xuICAgICAgICAgICAgwrUudHlwZSggMiApO1xuICAgICAgICAgICAgwrUudHlwZSgge30gKTtcbiAgICAgICAgICAgIMK1LnR5cGUoICdtb2luIScgKTtcbiAgICAgICAgICAgIMK1LnR5cGUoIG5ldyBEYXRlKCkgKTtcbiAgICAgICAgICAgIMK1LnR5cGUoIMK1KCAnZGl2JyApICk7XG4gICAgICAgICAgICDCtS50eXBlKCAvWzAtOV0vICk7XG4gICAgICAgICAgICDCtS50eXBlKCBhc3NlcnQub2sgKTtcbiAgICAgICAgICAgIMK1LnR5cGUoIHRydWUgKTtcbiAgICAgICAgICAgIMK1LnR5cGUoIG5ldyBCb29sZWFuKCB0cnVlICkgKTtcbiAgICAgICAgICAgIMK1LnR5cGUoIG5ldyBFcnJvcigpICk7XG4gICAgICAgICAgICDCtS50eXBlKCBuZXcgUHJvbWlzZShmdW5jdGlvbigpe30pICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQudHlwZScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC50eXBlKCBbXSApO1xuICAgICAgICAgICAgJC50eXBlKCAyICk7XG4gICAgICAgICAgICAkLnR5cGUoIHt9ICk7XG4gICAgICAgICAgICAkLnR5cGUoICdtb2luIScgKTtcbiAgICAgICAgICAgICQudHlwZSggbmV3IERhdGUoKSApO1xuICAgICAgICAgICAgJC50eXBlKCAkKCAnZGl2JyApICk7XG4gICAgICAgICAgICAkLnR5cGUoIC9bMC05XS8gKTtcbiAgICAgICAgICAgICQudHlwZSggYXNzZXJ0Lm9rICk7XG4gICAgICAgICAgICAkLnR5cGUoIHRydWUgKTtcbiAgICAgICAgICAgICQudHlwZSggbmV3IEJvb2xlYW4oIHRydWUgKSApO1xuICAgICAgICAgICAgJC50eXBlKCBuZXcgRXJyb3IoKSApO1xuICAgICAgICAgICAgJC50eXBlKCBuZXcgUHJvbWlzZShmdW5jdGlvbigpe30pICk7XG4gICAgICAgIH0sIDU4ICk7XG4gICAgfSk7XG59O1xuXG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIHdpbmRvdywgwrUsICQsIFFVbml0LCBCZW5jaG1hcmssIHRlc3QgICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBidWlsZFRlc3QgKVxue1xuICAgIFFVbml0Lm1vZHVsZSggJ2RvbS5qcycgKTtcblxuICAgIFFVbml0LnRlc3QoICfCtS5yZWFkeSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1LnJlYWR5LCAnZXhpc3RzJyApO1xuICAgIH0pO1xuXG59O1xuIiwiLyogZ2xvYmFsIGRvY3VtZW50LCB3aW5kb3csIMK1LCAkLCBRVW5pdCwgQmVuY2htYXJrLCB0ZXN0ICAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggYnVpbGRUZXN0IClcbntcbiAgICBRVW5pdC5tb2R1bGUoICdldmVudHMuanMnICk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuZW1pdCgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQuZXhwZWN0KCAzICk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmVtaXQsICdleGlzdHMnICk7XG4gICAgICAgIHZhciDCtUV4YW1wbGVzICAgPSDCtSggJy5leGFtcGxlLS1jbGFzcycgKTtcbiAgICAgICAgdmFyIMK1UGFyZW50ICAgICA9IMK1RXhhbXBsZXMucGFyZW50KCk7XG5cbiAgICAgICAgdmFyIGVtaXRUZXN0ICAgID0gYXNzZXJ0LmFzeW5jKCk7XG4gICAgICAgIHZhciBidWJibGVUZXN0ICA9IGFzc2VydC5hc3luYygpO1xuXG4gICAgICAgIMK1RXhhbXBsZXMub24oICdlbWl0VGVzdCcsIGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVFeGFtcGxlcy5vZmYoKTtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCggZS5kZXRhaWwuZG9JdCwgJzIgdGltZXMnLCAnY3VzdG9tIGV2ZW50IGVtaXR0ZWQnICk7XG4gICAgICAgICAgICBlbWl0VGVzdCgpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIMK1UGFyZW50Lm9uKCAnYnViYmxlVGVzdCcsIGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKCBlLmRldGFpbC5idWJibGVkLCAndHJ1ZScsICdjdXN0b20gZXZlbnQgYnViYmxlZCcgKTtcbiAgICAgICAgICAgIMK1UGFyZW50Lm9mZigpO1xuICAgICAgICAgICAgYnViYmxlVGVzdCgpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIMK1RXhhbXBsZXMuZW1pdCggJ2VtaXRUZXN0JywgeyBkb0l0OiAnMiB0aW1lcycgfSApO1xuICAgICAgICDCtVBhcmVudC5lbWl0KCAnYnViYmxlVGVzdCcsIHsgYnViYmxlZDogJ3RydWUnIH0sIHRydWUgKTtcblxuXG4gICAgICAgIHZhciDCtURpdiA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgJERpdiA9ICQoICdkaXYnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrVEaXYuZW1pdCggXFwndGVzdENsaWNrXFwnLCB7IHdvb286IFxcJ2lcXCdtIGEgZ2hvc3QhXFwnfSApOycsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgwrVEaXYuZW1pdCggJ3Rlc3RDbGljaycsIHsgd29vbzogJ2lcXCdtIGEgZ2hvc3QhJ30gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJERpdi50cmlnZ2VyKCBcXCd0ZXN0Q2xpY2tcXCcsIHsgd29vbzogXFwnaVxcJ20gYSBnaG9zdCFcXCd9ICk7JywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAkRGl2LnRyaWdnZXIoICd0ZXN0Q2xpY2snLCB7IHdvb286ICdpXFwnbSBhIGdob3N0ISd9ICk7XG4gICAgICAgIH0sIDYzICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcub24oKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0LmV4cGVjdCggMyApO1xuXG4gICAgICAgIGFzc2VydC5vayggwrUoKS5vbiwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVFeGFtcGxlcyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MnICk7XG5cbiAgICAgICAgdmFyIG9uVGVzdCAgICAgID0gYXNzZXJ0LmFzeW5jKCk7XG5cbiAgICAgICAgwrVFeGFtcGxlcy5vbiggJ29uVGVzdCcsIGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFyIGZ1bmMgPSDCtUV4YW1wbGVzWzBdLmRhdGFbJ19vblRlc3QtYm91bmQtZnVuY3Rpb24nXVsnX29uVGVzdC1ib3VuZC1mdW5jdGlvbiddWzBdO1xuXG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIHR5cGVvZiBmdW5jLCAnZnVuY3Rpb24nLCAnc2V0cyB1bmxvYWQgZGF0YScgKTtcbiAgICAgICAgICAgIMK1RXhhbXBsZXMub2ZmKCk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIGUuZGV0YWlsLmRvSXQsICcyIHRpbWVzJywgJ2V2ZW50IGNvcnJlY3RseSBsaXN0ZW5lZCB0bycgKTtcbiAgICAgICAgICAgIG9uVGVzdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICDCtUV4YW1wbGVzLmVtaXQoICdvblRlc3QnLCB7IGRvSXQ6ICcyIHRpbWVzJyB9ICk7XG5cblxuICAgICAgICB2YXIgwrVEaXYgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyICREaXYgPSAkKCAnZGl2JyApO1xuXG4gICAgICAgIHZhciB2YW5pbGxhUmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiggZGl2cyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IGRpdnMubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXZzWyBpIF0ucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgX2Z1bmMgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB2YXIga2V5Q29kZTtcbiAgICAgICAgdmFyIF9mdW5jID0gZnVuY3Rpb24oIGUgKVxuICAgICAgICB7XG4gICAgICAgICAgICBrZXlDb2RlID0gZS5rZXlDb2RlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXZcXCcgKS5vbiggXFwnY2xpY2tcXCcsIGZ1bmN0aW9uKCl7fSApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICDCtURpdi5vbiggJ2NsaWNrJywgX2Z1bmMgKTtcbiAgICAgICAgICAgIHZhbmlsbGFSZW1vdmVMaXN0ZW5lciggwrVEaXYgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2XFwnICkub24oIFxcJ2NsaWNrXFwnLCBmdW5jdGlvbigpe30gKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJERpdi5vbiggJ2NsaWNrJywgX2Z1bmMgKTtcbiAgICAgICAgICAgIHZhbmlsbGFSZW1vdmVMaXN0ZW5lciggJERpdiApO1xuICAgICAgICB9LCA2NCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLm9mZigpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1KCkub2ZmLCAnZXhpc3RzJyApO1xuXG4gICAgICAgIHZhciDCtUV4YW1wbGVzICAgPSDCtSggJy5leGFtcGxlLS1jbGFzcycgKTtcblxuICAgICAgICDCtUV4YW1wbGVzLm9uKCAndHVybmluZ09mZicsIGZ1bmN0aW9uKCBlICl7fSk7XG4gICAgICAgIMK1RXhhbXBsZXMub2ZmKCAndHVybmluZ09mZicgKTtcbiAgICAgICAgdmFyIGZ1bmMgPSDCtUV4YW1wbGVzWzBdLmRhdGFbICdfdHVybmluZ09mZi1ib3VuZC1mdW5jdGlvbicgXVsgJ190dXJuaW5nT2ZmLWJvdW5kLWZ1bmN0aW9uJyBdWzBdO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggZnVuYywgbnVsbCwgJ2xpc3RlbmVyIHJlbW92ZWQnICk7XG5cblxuICAgICAgICB2YXIgwrVEaXYgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyICREaXYgPSAkKCAnZGl2JyApO1xuXG4gICAgICAgIHZhciB2YW5pbGxhQWRkTGlzdGVuZXIgPSBmdW5jdGlvbiggZGl2cyApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMCwgbGVuSSA9IGRpdnMubGVuZ3RoOyBpIDwgbGVuSTsgaSsrIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkaXZzWyBpIF0uYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgX2Z1bmMgKTtcbiAgICAgICAgICAgICAgICBkaXZzWyBpIF0uZGF0YSA9IGRpdnNbIGkgXS5kYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgIGRpdnNbIGkgXS5kYXRhWyAnX2NsaWNrLWJvdW5kLWZ1bmN0aW9uJyBdID0gZGl2c1sgaSBdLmRhdGFbICdfY2xpY2stYm91bmQtZnVuY3Rpb24nIF0gfHzCoHt9O1xuICAgICAgICAgICAgICAgIGRpdnNbIGkgXS5kYXRhWyAnX2NsaWNrLWJvdW5kLWZ1bmN0aW9uJyBdWyAnX2NsaWNrLWJvdW5kLWZ1bmN0aW9uJyBdID0gX2Z1bmM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGtleUNvZGU7XG4gICAgICAgIHZhciBfZnVuYyA9IGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAga2V5Q29kZSA9IGUua2V5Q29kZTtcbiAgICAgICAgfTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtSggXFwnZGl2XFwnICkub24oIFxcJ2NsaWNrXFwnLCBmdW5jdGlvbigpe30gKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgdmFuaWxsYUFkZExpc3RlbmVyKCDCtURpdiApO1xuICAgICAgICAgICAgwrVEaXYub2ZmKCAnY2xpY2snICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJ2RpdlxcJyApLm9uKCBcXCdjbGlja1xcJywgZnVuY3Rpb24oKXt9ICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHZhbmlsbGFBZGRMaXN0ZW5lciggJERpdiApO1xuICAgICAgICAgICAgJERpdi5vZmYoICdjbGljaycgKTtcbiAgICAgICAgfSwgNjUgKTtcbiAgICB9KTtcbn07XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIHdpbmRvdywgwrUsICQsIFFVbml0LCBCZW5jaG1hcmssIHRlc3QgICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGJ1aWxkVGVzdCApXG57XG4gICAgUVVuaXQubW9kdWxlKCAnaHR0cC5qcycgKTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5odHRwJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1Lmh0dHAsICdleGlzdHMnICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuaHR0cC5nZXQnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUuaHR0cC5nZXQsICdleGlzdHMnICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcuaHR0cC5wb3N0JywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQub2soIMK1Lmh0dHAucG9zdCwgJ2V4aXN0cycgKTtcbiAgICB9KTtcbn07XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIHdpbmRvdywgwrUsICQsIFFVbml0LCBCZW5jaG1hcmssIGJ1aWxkVGVzdCAgKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGJ1aWxkVGVzdCApXG57XG4gICAgUVVuaXQubW9kdWxlKCAnaW5pdC5qcycgKTtcblxuICAgIFFVbml0LnRlc3QoICd3cmFwIGFuIGVsZW1lbnQnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciBfYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnYm9keScgKVswXTtcbiAgICAgICAgdmFyIMK1Qm9keSA9IMK1KCBfYm9keSApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVCb2R5Lmxlbmd0aCwgMSwgJ29uZSBib2R5JyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtUJvZHlbIDAgXSwgX2JvZHksICdwYXNzZXMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIF9lbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gwrUoIF9ib2R5ICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIF9lbCApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggX2JvZHkgKTtcbiAgICAgICAgfSwgMCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAncXVlcnkgY2xhc3MnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciBfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggJ2V4YW1wbGUtLWNsYXNzJyApWzBdO1xuICAgICAgICB2YXIgwrVEaXYgPSDCtSggJy5leGFtcGxlLS1jbGFzcycgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2Lmxlbmd0aCwgMSwgJ29uZSBkaXYnICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1RGl2WyAwIF0sIF9kaXYsICdwYXNzZXMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJy5leGFtcGxlLS1jbGFzc1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gwrUoICcuZXhhbXBsZS0tY2xhc3MnICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJy5leGFtcGxlLS1jbGFzc1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJy5leGFtcGxlLS1jbGFzcycgKTtcbiAgICAgICAgfSwgMSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAncXVlcnkgaWQnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciBfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdleGFtcGxlLS1pZCcgKTtcbiAgICAgICAgdmFyIMK1RGl2ID0gwrUoICcjZXhhbXBsZS0taWQnICk7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtURpdi5sZW5ndGgsIDEsICdvbmUgZGl2JyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtURpdlsgMCBdLCBfZGl2LCAncGFzc2VzJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCcjZXhhbXBsZS0taWRcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnI2V4YW1wbGUtLWlkJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCcjZXhhbXBsZS0taWRcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICcjZXhhbXBsZS0taWQnICk7XG4gICAgICAgIH0sIDIgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJ3F1ZXJ5IHRhZ25hbWUnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciBfZGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdkaXYnIClbMF07XG4gICAgICAgIHZhciDCtURpdiA9IMK1KCAnZGl2JyApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVEaXZbIDAgXS50YWdOYW1lLCAnRElWJywgJ2NvcnJlY3QgZWxlbWVudCcgKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggwrVEaXZbIDAgXSwgX2RpdiwgJ3Bhc3NlcycgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtSggXFwnZGl2XFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdicgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2XFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAkKCAnZGl2JyApO1xuICAgICAgICB9LCAzICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICdxdWVyeSBjb21iaW5lZCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgdmFyIF9kaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnZGl2I2V4YW1wbGUtLWNvbWJpbmVkLmV4YW1wbGUtLWNvbWJpbmVkJyApO1xuICAgICAgICB2YXIgwrVEaXYgPSDCtSggJ2RpdiNleGFtcGxlLS1jb21iaW5lZC5leGFtcGxlLS1jb21iaW5lZCcgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2Lmxlbmd0aCwgMSwgJ29uZSBkaXYnICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1RGl2WyAwIF0sIF9kaXYsICdwYXNzZXMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJ2RpdiNleGFtcGxlLS1jb21iaW5lZC5leGFtcGxlLS1jb21iaW5lZFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gwrUoICdkaXYjZXhhbXBsZS0tY29tYmluZWQuZXhhbXBsZS0tY29tYmluZWQnICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJ2RpdiNleGFtcGxlLS1jb21iaW5lZC5leGFtcGxlLS1jb21iaW5lZFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJ2RpdiNleGFtcGxlLS1jb21iaW5lZC5leGFtcGxlLS1jb21iaW5lZCcgKTtcbiAgICAgICAgfSwgNCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAncXVlcnkgbWljcm9iZSBzY29wZScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgdmFyIMK1RGl2ID0gwrUoICdkaXYnLCDCtSggJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApICk7XG4gICAgICAgIHZhciAkRGl2ID0gJCggJ2RpdicsICQoICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKSApO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVEaXYubGVuZ3RoLCAyLCAndHdvIGRpdnMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVEaXZbMF0udGFnTmFtZSwgJ0RJVicsICdjb3JyZWN0IGVsZW1lbnQnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJ2RpdlxcJywgwrVEaXYgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnZGl2JywgwrVEaXYgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2XFwnLCAkRGl2ICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAkKCAnZGl2JywgJERpdiApO1xuICAgICAgICB9LCA1ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICdxdWVyeSBlbGVtZW50IHNjb3BlJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICB2YXIgX3Njb3BlRWwgPSDCtSggJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApWzBdO1xuXG4gICAgICAgIHZhciDCtURpdiA9IMK1KCAnZGl2JywgX3Njb3BlRWwgKTtcblxuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2Lmxlbmd0aCwgMiwgJ3R3byBkaXZzJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtURpdi5maXJzdCgpLnBhcmVudCgpWzBdLCBfc2NvcGVFbCwgJ2NvcnJlY3QgcGFyZW50JyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXZcXCcsIF9zY29wZUVsICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdicsIF9zY29wZUVsICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJ2RpdlxcJywgX3Njb3BlRWwgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICdkaXYnLCBfc2NvcGVFbCApO1xuICAgICAgICB9LCA2ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICdxdWVyeSBzdHJpbmcgc2NvcGUnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciDCtURpdiA9IMK1KCAnZGl2JywgJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzJyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1RGl2LnNlbGVjdG9yKCksICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcyBkaXYnLCAnY29ycmVjdGx5IGZvcm1lZCBzZWxlY3RvcicgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtURpdi5sZW5ndGgsIDIsICd0d28gZGl2cycgKTtcblxuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXZcXCcsIFxcJy5leGFtcGxlLS1jbGFzcy0tZ3JvdXBzXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdicsICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2XFwnLCBcXCcuZXhhbXBsZS0tY2xhc3MtLWdyb3Vwc1xcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJ2RpdicsICcuZXhhbXBsZS0tY2xhc3MtLWdyb3VwcycgKTtcbiAgICAgICAgfSwgNyApO1xuICAgIH0pO1xufTtcbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgd2luZG93LCDCtSwgJCwgUVVuaXQsIEJlbmNobWFyaywgdGVzdCAgKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggYnVpbGRUZXN0IClcbntcbiAgICBRVW5pdC5tb2R1bGUoICdvYnNlcnZlLmpzJyApO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLmdldCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLmdldCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVFeGFtcGxlcyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MnICk7XG5cbiAgICAgICAgwrVFeGFtcGxlc1swXS5kYXRhID0gwrVFeGFtcGxlc1swXS5kYXRhIHx8IHt9O1xuICAgICAgICDCtUV4YW1wbGVzWzBdLmRhdGEubW9vID0gwrVFeGFtcGxlc1swXS5kYXRhLm1vbyB8fMKge307XG4gICAgICAgIMK1RXhhbXBsZXNbMF0uZGF0YS5tb28ubW9vID0gJ21vb29uISc7XG5cbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUV4YW1wbGVzLmdldCggJ21vbycgKVswXSwgJ21vb29uIScsICdnZXQgZ2V0cycgKTtcblxuXG4gICAgICAgIGJ1aWxkVGVzdCggJ05vIGNvbXBhcmlzb24gYXZhaWxhYmxlLicsIDY2ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICcub2JzZXJ2ZSgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICBhc3NlcnQuZXhwZWN0KCAzICk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLm9ic2VydmUsICdleGlzdHMnICk7XG5cbiAgICAgICAgdmFyIMK1RXhhbXBsZXMgICA9IMK1KCAnLmV4YW1wbGUtLWNsYXNzJyApO1xuXG4gICAgICAgIHZhciBvYnNlcnZlVGVzdCAgICAgID0gYXNzZXJ0LmFzeW5jKCk7XG5cbiAgICAgICAgwrVFeGFtcGxlcy5vYnNlcnZlKCAnb2JzZXJ2ZVRlc3QnLCBmdW5jdGlvbiggZSApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbCggdHlwZW9mIMK1RXhhbXBsZXNbMF0uZGF0YS5vYnNlcnZlVGVzdC5fb2JzZXJ2ZUZ1bmMsICdmdW5jdGlvbicsICdvYnNlcnZlIGZ1bmN0aW9uIHN0b3JlZCcgKTtcbiAgICAgICAgICAgIMK1RXhhbXBsZXMudW5vYnNlcnZlKCk7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoIGVbMF0ub2JqZWN0Lm9ic2VydmVUZXN0LCAnd2hvb2hvbycsICdvYmplY3QgY29ycmVjdGx5IG9ic2VydmVkJyApO1xuICAgICAgICAgICAgb2JzZXJ2ZVRlc3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgwrVFeGFtcGxlcy5zZXQoICdvYnNlcnZlVGVzdCcsICd3aG9vaG9vJyApO1xuXG5cbiAgICAgICAgYnVpbGRUZXN0KCAnTm8gY29tcGFyaXNvbiBhdmFpbGFibGUuJywgNjcgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy5vYnNlcnZlT25jZScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0LmV4cGVjdCggMiApO1xuXG4gICAgICAgIGFzc2VydC5vayggwrUoKS5vYnNlcnZlT25jZSwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVFeGFtcGxlcyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MnICk7XG5cbiAgICAgICAgdmFyIG9ic2VydmVPbmNlVGVzdCAgICAgID0gYXNzZXJ0LmFzeW5jKCk7XG5cbiAgICAgICAgwrVFeGFtcGxlcy5vYnNlcnZlT25jZSggJ29ic2VydmVPbmNlVGVzdCcsIGZ1bmN0aW9uKCBlIClcbiAgICAgICAge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKCBlWzBdLm9iamVjdC5vYnNlcnZlT25jZVRlc3QsICd3aG9vaG9vJywgJ29iamVjdCBjb3JyZWN0bHkgb2JzZXJ2ZWQgb25jZScgKTtcblxuICAgICAgICAgICAgb2JzZXJ2ZU9uY2VUZXN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIMK1RXhhbXBsZXMuc2V0KCAnb2JzZXJ2ZU9uY2VUZXN0JywgJ3dob29ob28nICk7XG5cblxuICAgICAgICBidWlsZFRlc3QoICdObyBjb21wYXJpc29uIGF2YWlsYWJsZS4nLCA2OCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnLnNldCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtSgpLnNldCwgJ2V4aXN0cycgKTtcblxuICAgICAgICB2YXIgwrVFeGFtcGxlcyAgID0gwrUoICcuZXhhbXBsZS0tY2xhc3MnICk7XG4gICAgICAgIMK1RXhhbXBsZXMuc2V0KCAnbW9vJywgJ21vb29uIScgKTtcblxuICAgICAgICB2YXIgc2V0RGF0YSA9IMK1RXhhbXBsZXNbMF0uZGF0YS5tb28ubW9vO1xuXG4gICAgICAgIGFzc2VydC5lcXVhbCggc2V0RGF0YSwgJ21vb29uIScsICdzZXQgc2V0cycgKTtcblxuXG4gICAgICAgIGJ1aWxkVGVzdCggJ05vIGNvbXBhcmlzb24gYXZhaWxhYmxlLicsIDY5KTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJy51bm9ic2VydmUnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIGFzc2VydC5vayggwrUoKS51bm9ic2VydmUsICdleGlzdHMnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KCAnTm8gY29tcGFyaXNvbiBhdmFpbGFibGUuJywgNzAgKTtcbiAgICB9KTtcbn07XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIHdpbmRvdywgwrUsICQsIFFVbml0LCBCZW5jaG1hcmssIHRlc3QgICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBidWlsZFRlc3QgKVxue1xuICAgIFFVbml0Lm1vZHVsZSggJ3BzZXVkby5qcycgKTtcblxuXG4gICAgUVVuaXQudGVzdCggJzpjb250YWlucyh0ZXh0KScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5wc2V1ZG8uY29udGFpbnMsICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUoICcjZXhhbXBsZS0tY29tYmluZWQ6Y29udGFpbnMoSSBhbSknICkubGVuZ3RoLCAxLCAnc2VhcmNoZXMgdGV4dCcgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtSggJyNleGFtcGxlLS1jb21iaW5lZDpjb250YWlucyhpIGFtKScgKS5sZW5ndGgsIDEsICdpZ25vcmVzIGNhc2UnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrUoICcjZXhhbXBsZS0tY29tYmluZWQ6Y29udGFpbnMobW9vbiknICkubGVuZ3RoLCAwLCAnaWdub3JlcyBmYWxzZSByZXR1cm5zJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCcjZXhhbXBsZS0tY29tYmluZWQ6Y29udGFpbnMoSSBhbSlcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnI2V4YW1wbGUtLWNvbWJpbmVkOmNvbnRhaW5zKEkgYW0pJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCcjZXhhbXBsZS0tY29tYmluZWQ6Y29udGFpbnMoSSBhbSlcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICcjZXhhbXBsZS0tY29tYmluZWQ6Y29udGFpbnMoSSBhbSknICk7XG4gICAgICAgIH0sIDggKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJzpldmVuJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICB2YXIgwrVFdmVuU2NyaXB0cyAgID0gwrUoICdzY3JpcHQ6ZXZlbicgKS5sZW5ndGg7XG4gICAgICAgIHZhciDCtVNjcmlwdHMgICAgICAgPSDCtSggJ3NjcmlwdCcgKS5sZW5ndGg7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5wc2V1ZG8uZXZlbiwgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUV2ZW5TY3JpcHRzLCBNYXRoLmZsb29yKCDCtVNjcmlwdHMgLyAyICksICdzZWxlY3RzIG9ubHkgdGhlIGV2ZW4gc2NyaXB0JyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtVNjcmlwdHNbMV0sIMK1RXZlblNjcmlwdHNbMF0sICdzZWxlY3RzIHRoZSBjb3JyZWN0IGhhbGYnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJ2RpdjpldmVuXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdjpldmVuJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCdkaXY6ZXZlblxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJ2RpdjpldmVuJyApO1xuICAgICAgICB9LCA5ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICc6Zmlyc3QnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciDCtURpdnMgICAgICAgPSDCtSggJ2RpdicgKTtcbiAgICAgICAgdmFyIMK1Rmlyc3REaXYgICA9IMK1KCAnZGl2OmZpcnN0JyApO1xuXG4gICAgICAgIGFzc2VydC5vayggwrUucHNldWRvLmZpcnN0LCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtURpdnNbIDAgXSwgwrVGaXJzdERpdlsgMCBdLCAnZmluZHMgdGhlIHJpZ2h0IGRpdicgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUZpcnN0RGl2Lmxlbmd0aCwgMSwgJ29ubHkgZmluZHMgb25lIGRpdicgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtSggXFwnZGl2OmZpcnN0XFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdjpmaXJzdCcgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2OmZpcnN0XFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAkKCAnZGl2OmZpcnN0JyApO1xuICAgICAgICB9LCAxMCApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnOmd0KFgpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICB2YXIgwrVEaXZzICAgICAgID0gwrUoICdkaXYnICk7XG4gICAgICAgIHZhciDCtUd0RGl2cyAgICAgPSDCtSggJ2RpdjpndCgzKScgKTtcblxuICAgICAgICBhc3NlcnQub2soIMK1LnBzZXVkby5ndCwgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbCggwrVEaXZzWyA2IF0sIMK1R3REaXZzWyAzIF0sICdmaW5kcyB0aGUgcmlnaHQgZGl2cycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUd0RGl2cy5sZW5ndGgsIMK1RGl2cy5sZW5ndGggLSAzLCAnZmluZHMgdGhlIGNvcnJlY3QgbnVtYmVyIGlmIGVsZW1lbnRzJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXY6Z3QoMylcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnZGl2Omd0KDMpJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCdkaXY6Z3QoMylcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICdkaXY6Z3QoMyknICk7XG4gICAgICAgIH0sIDExICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICc6aGFzKFMpJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICB2YXIgwrVIYXNEaXYgPSDCtSggJ2RpdjpoYXMobGkpJyApO1xuXG4gICAgICAgIGFzc2VydC5vayggwrUucHNldWRvLmhhcywgJ2V4aXN0cycgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUhhc0Rpdi5sZW5ndGgsIDEsICdncmFicyB0aGUgY29ycmVjdCBhbW91bnQgb2YgZGl2cycgKTtcblxuICAgICAgICBidWlsZFRlc3QoXG4gICAgICAgICfCtSggXFwnZGl2OmhhcyhsaSlcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnZGl2OmhhcyhsaSknICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJ2RpdjpoYXMobGkpXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiAkKCAnZGl2OmhhcyhsaSknICk7XG4gICAgICAgIH0sIDEyICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICc6bGFzdCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgdmFyIMK1RGl2cyAgICAgICA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgwrVMYXN0RGl2ICAgID0gwrUoICdkaXY6bGFzdCcgKTtcblxuICAgICAgICBhc3NlcnQub2soIMK1LnBzZXVkby5sYXN0LCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtURpdnNbIMK1RGl2cy5sZW5ndGggLSAxIF0sIMK1TGFzdERpdlsgMCBdLCAnZmluZHMgdGhlIHJpZ2h0IGRpdicgKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKCDCtUxhc3REaXYubGVuZ3RoLCAxLCAnb25seSBmaW5kcyBvbmUgZGl2JyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXY6bGFzdFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gwrUoICdkaXY6bGFzdCcgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2Omxhc3RcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICdkaXY6bGFzdCcgKTtcbiAgICAgICAgfSwgMTMgKTtcbiAgICB9KTtcblxuXG4gICAgUVVuaXQudGVzdCggJzpsdChYKScsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgdmFyIMK1RGl2cyAgICAgICA9IMK1KCAnZGl2JyApO1xuICAgICAgICB2YXIgwrVMdERpdnMgICAgID0gwrUoICdkaXY6bHQoMyknICk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5wc2V1ZG8ubHQsICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1RGl2c1sgMSBdLCDCtUx0RGl2c1sgMSBdLCAnZmluZHMgdGhlIHJpZ2h0IGRpdnMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVMdERpdnMubGVuZ3RoLCAzLCAnZmluZHMgdGhlIGNvcnJlY3QgbnVtYmVyIGlmIGVsZW1lbnRzJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXY6bHQoMilcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnZGl2Omx0KDIpJyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCdkaXY6bHQoMilcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICdkaXY6bHQoMiknICk7XG4gICAgICAgIH0sIDE0ICk7XG4gICAgfSk7XG5cblxuICAgIFFVbml0LnRlc3QoICc6b2RkJywgZnVuY3Rpb24oIGFzc2VydCApXG4gICAge1xuICAgICAgICB2YXIgwrVPZGRTY3JpcHRzICAgID0gwrUoICdzY3JpcHQ6b2RkJyApLmxlbmd0aDtcbiAgICAgICAgdmFyIMK1U2NyaXB0cyAgICAgICA9IMK1KCAnc2NyaXB0JyApLmxlbmd0aDtcblxuICAgICAgICBhc3NlcnQub2soIMK1LnBzZXVkby5vZGQsICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5lcXVhbCggwrVPZGRTY3JpcHRzLCBNYXRoLmNlaWwoIMK1U2NyaXB0cyAvIDIgKSwgJ3NlbGVjdHMgb25seSB0aGUgb2RkIHNjcmlwdHMnICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1U2NyaXB0c1swXSwgwrVPZGRTY3JpcHRzWzBdLCAnc2VsZWN0cyB0aGUgY29ycmVjdCBoYWxmJyApO1xuXG4gICAgICAgIGJ1aWxkVGVzdChcbiAgICAgICAgJ8K1KCBcXCdkaXY6b2RkXFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2RpdjpvZGQnICk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgJyQoIFxcJ2RpdjpvZGRcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuICQoICdkaXY6b2RkJyApO1xuICAgICAgICB9LCAxNSApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnOnJvb3QnLCBmdW5jdGlvbiggYXNzZXJ0IClcbiAgICB7XG4gICAgICAgIHZhciDCtVJvb3QgPSDCtSggJ2Rpdjpyb290JyApO1xuXG4gICAgICAgIGFzc2VydC5vayggwrUucHNldWRvLnJvb3QsICdleGlzdHMnICk7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoIMK1Um9vdFsgMCBdLCDCtSggJ2h0bWwnIClbIDAgXSwgJ3NlbGVjdHMgdGhlIHJvb3QnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJ2Rpdjpyb290XFwnICknLCBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJldHVybiDCtSggJ2Rpdjpyb290JyApO1xuICAgICAgICB9LFxuXG4gICAgICAgICckKCBcXCdkaXY6cm9vdFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJ2Rpdjpyb290JyApO1xuICAgICAgICB9LCAxNiApO1xuICAgIH0pO1xuXG5cbiAgICBRVW5pdC50ZXN0KCAnOnRhcmdldCcsIGZ1bmN0aW9uKCBhc3NlcnQgKVxuICAgIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnZXhhbXBsZS0tY29tYmluZWQnO1xuICAgICAgICB2YXIgwrVUYXJnZXQgPSDCtSggJ2Rpdjp0YXJnZXQnICk7XG4gICAgICAgIHZhciDCtUlkU2VhcmNoID0gwrUoICcjZXhhbXBsZS0tY29tYmluZWQnICk7XG5cbiAgICAgICAgYXNzZXJ0Lm9rKCDCtS5wc2V1ZG8udGFyZ2V0LCAnZXhpc3RzJyApO1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKCDCtVRhcmdldFsgMCBdLCDCtUlkU2VhcmNoWyAwIF0sICdmaW5kcyB0aGUgY29ycmVjdCBlbGVtZW50JyApO1xuICAgICAgICBhc3NlcnQuZXF1YWwoIMK1VGFyZ2V0Lmxlbmd0aCwgMSwgJ2FuZCB0aGF0XFwncyB0aGUgb25seSBvbmUnICk7XG5cbiAgICAgICAgYnVpbGRUZXN0KFxuICAgICAgICAnwrUoIFxcJ2Rpdjp0YXJnZXRcXCcgKScsIGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgcmV0dXJuIMK1KCAnZGl2OnRhcmdldCcgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAnJCggXFwnZGl2OnRhcmdldFxcJyApJywgZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICByZXR1cm4gJCggJ2Rpdjp0YXJnZXQnICk7XG4gICAgICAgIH0sIDE3ICk7XG5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnJztcbiAgICB9KTtcbn07XG5cbiJdfQ==
