import url from 'node:url'
import allure from 'allure-commandline'


const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

export const config = {
    /**
     * specify test files
     */
    specs: [
        './mocha.test.ts'
    ],

    /**
     * capabilities
     */
    capabilities: [{
        browserName: 'chrome',
        'bstack:options' : {
            seleniumBidi: true,
            seleniumVersion: '4.23.0',
        }
    }],

    /**
     * test configurations
     */
    // logLevel: 'trace',
    framework: 'mocha',
    outputDir: __dirname,
    user: 'xxxx',
    key: 'xxxx',
    hostname: 'hub.browserstack.com',
    runner: 'local',
    logLevel: 'trace',
    reporters: ['spec', 'junit',
        [
            'allure',
            {
                disableWebdriverScreenshotsReporting: false,
                disableWebdriverStepsReporting: true,
                outputDir: './e2e/results/allure-results',
            },
        ],
    ],
    services: [
        [
          'browserstack',
          { browserstackLocal: true, opts: { forceLocal: false } },
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
        console.log('let\'s go00oooooooooooooo')
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
