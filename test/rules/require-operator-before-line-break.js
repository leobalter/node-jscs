var Checker = require('../../lib/checker');
var assert = require('assert');
var operators = require('../../lib/utils').binaryOperators.slice();

describe('rules/require-operator-before-line-break', function() {
    var checker;

    beforeEach(function() {
        checker = new Checker();
        checker.registerDefaultRules();
    });

    operators.forEach(function(operator) {
        if (operator === ':') {
            return;
        }

        var values = [[operator], true];

        values.forEach(function(value) {
            it('should report newline before ' + operator + ' with ' + value + ' value', function() {
                checker.configure({ requireOperatorBeforeLineBreak: value });
                assert(checker.checkString('var x = y \n' + operator + ' String').getErrorCount() === 1);
            });

            it('should not report newline after ' + operator + ' with ' + value + ' value', function() {
                checker.configure({ requireOperatorBeforeLineBreak: value });
                assert(checker.checkString('var x = y ' + operator + '\n String').isEmpty());
            });
        });
    });

    it('should report newline in object definition with true value', function() {
        checker.configure({ requireOperatorBeforeLineBreak: true });
        assert(checker.checkString('({ test \n: 1 })').getErrorCount() === 1);
    });
    it('should report newline before ternary with true value', function() {
        checker.configure({ requireOperatorBeforeLineBreak: true });
        assert(checker.checkString('var x = y \n? a : b').getErrorCount() === 1);
    });
    it('should report newline before colon with true value', function() {
        checker.configure({ requireOperatorBeforeLineBreak: true });
        assert(checker.checkString('({ test \n : 1 })').getErrorCount() === 1);
    });
    it('should not report newline before colon without option', function() {
        checker.configure({ requireOperatorBeforeLineBreak: ['?'] });
        assert(checker.checkString('({ test \n : 1 })').isEmpty());
    });
    it('should not report newline before ternary without option', function() {
        checker.configure({ requireOperatorBeforeLineBreak: [':'] });
        assert(checker.checkString('var x = y \n? a : b').isEmpty());
    });
    it('should report newline before ternary', function() {
        checker.configure({ requireOperatorBeforeLineBreak: ['?'] });
        assert(checker.checkString('var x = y \n? a : b').getErrorCount() === 1);
    });
    it('should not report newline after ternary', function() {
        checker.configure({ requireOperatorBeforeLineBreak: ['?'] });
        assert(checker.checkString('var x = y ?\n a : b').isEmpty());
    });

    it('should not report newline for the unary operator', function() {
        checker.configure({ requireOperatorBeforeLineBreak: ['-'] });
        assert(checker.checkString('[\n-1, \n2]').isEmpty());
    });
});
