const TABULATION = 2;

class TestSummarizer {
    static drawResultTestTree(tree) {
        let spaces = 0;
        let result = '';

        for (let node of tree) {
            const leadingSpaces = node.match(/^\s*/g)[0].length;

            if (leadingSpaces) {
                result += node + '\n';
                spaces = leadingSpaces;
                continue;
            }

            result += ' '.repeat(spaces + TABULATION) + node + '\n';
        }

        console.log(result);
    }

    static summarizeResults(passing, failing) {
        console.log(`  ${passing} passing`);

        if (failing > 0) {
            console.log(`  ${failing} failing`);
        }
    }

    static printErrorMessages(errorMessages) {
        for (let message of errorMessages) {
            console.log('\n' + message);
        }
    }

    static report(testTreeNodes, passing, failing, errorMessages) {
        TestSummarizer.drawResultTestTree(testTreeNodes);

        TestSummarizer.summarizeResults(passing, failing);

        TestSummarizer.printErrorMessages(errorMessages);
    }
}

module.exports = TestSummarizer;