import url from 'node:url'
import allure from 'allure-commandline'


const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const config = {
    /**
     * specify test files
     */
    specs: [
        './mocha.test.js'
    ],

    /**
     * capabilities
     */
    capabilities: [{
        browserName: 'chrome'
    }],

    /**
     * test configurations
     */
    logLevel: 'trace',
    framework: 'mocha',
    outputDir: __dirname,

    reporters: ['spec', 'dot', 'junit',
        [
            'allure',
            {
                disableWebdriverScreenshotsReporting: false,
                disableWebdriverStepsReporting: true,
                outputDir: './e2e/results/allure-results',
            },
        ],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 15000
    },

    /**
     * hooks
     */
    onPrepare: function() {
        // eslint-disable-next-line
        console.log('let\'s go')
    },
    afterTest: async function(test, context, { error, result, duration, passed, retries }) {
        if (error)
        {
            await browser.takeScreenshot();
        }
    },
    onComplete: async function() {
        // eslint-disable-next-line
        console.log('that\'s it')
        const reportError = new Error('Could not generate Allure report');
        const generation = allure(['generate', './e2e/results/allure-results', '--clean']);
        return new Promise((resolve, reject) => {
            const generationTimeout = setTimeout(() => reject(reportError), 50000);

            // eslint-disable-next-line consistent-return
            generation.on('exit', (exitCode) => {
                clearTimeout(generationTimeout);

                if (exitCode !== 0) {
                    return reject(reportError);
                }

                resolve(1);
            });
        });
    }
}
