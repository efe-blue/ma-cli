/**
 * @file 添加page 或 component文件
 * @author yufeng04
 */

const chalk = require('chalk');
const request = require('request');
const ttyTable = require('tty-table');
const ta = require('time-ago');
const util = require('../lib/util');

exports = module.exports = (program) => {
    request({
        url: 'https://raw.githubusercontent.com/efe-blue/ma-templates/master/meta.json',
        headers: {
            'User-Agent': 'ma-templates'
        }
    }, (err, res, body) => {
        if (!body) {
            util.log('Something wrong with your network', 'error');
            return;
        }

        if (body.message) {
            util.log(body.messge, 'error');
            return;
        }

        let official, github;
        try {
            body = JSON.parse(body);
            official = body.official;
            github = body.github;
        } catch (e) {
            util.log('Something wrong with your network', 'error');
        }

        if (!program.github && Array.isArray(official)) {
            util.log('\n  Available official templates:\n', 'info');
            /*
            official.forEach(repo => {
              console.log(
            '  ' + chalk.yellow('♚') +
            '  ' + chalk.blue(repo.name) +
            ' - ' + repo.description);
            });
            */
            let tableHead = [
                {
                    value: 'Name',
                    width: 20,
                    color: 'blue'
                },
                {
                    value: 'Description',
                    width: 60,
                    align: 'left',
                    paddingLeft: 2,
                    key: 'description'
                }
            ];
            let rows = [];
            official.forEach(repo => {
                rows.push([repo.name, repo.description]);
            });

            let offical = ttyTable(tableHead, rows, {
                borderStyle: 2
            });
            util.log(`     e.g., ma init ${rows[0][0]} myproject`, 'info');
            util.log(offical.render(), 'info');
        }
        
        if (Array.isArray(github) && github.length) {
            util.log('  Available github projects:\n', 'info');

            let tableHead = [
                {
                    value: 'Repository',
                    width: 30,
                    color: 'blue',
                    key: 'repo'
                },
                {
                    value: 'Stars',
                    width: 8,
                    key: 'star'
                },
                {
                    value: 'Description',
                    width: 60,
                    align: 'left',
                    paddingLeft: 2,
                    key: 'description'
                },
                {
                    value: 'Last Updated',
                    width: 25,
                    key: 'last_update',
                    formatter: function (v) {
                        let date = new Date(v);
                        if (date.toString() === 'Invalid Date') {
                            return '----';
                        } else {
                            return ta.ago(v);
                        }
                    }
                }
            ];

            let map = tableHead.map(v => v.key);

            let showItems = [];
            let rows = [];
            let MAX_COUNT = program.github ? 0 : 5;
            if (MAX_COUNT && github.length > MAX_COUNT) {
                for (let i = 0, l = github.length; i < l; i++) {
                    if (i >= MAX_COUNT)
                        break;
                    showItems.push(github[i]);
                }
            } else {
                showItems = github;
            }
            showItems.forEach(repo => {
                let row = [];
                map.forEach((title, i) => {
                    row.push(repo[title] || '');
                });
                rows.push(row);
            });
            if (MAX_COUNT && github.length > MAX_COUNT) {
                rows.push(['....', '..', '....', '....']);
            }

            let githubTable = ttyTable(tableHead, rows, {
                borderStyle: 2
            });
            util.log(`     e.g., ma init ${rows[0][0]} myproject`, 'info');
            util.log(githubTable.render(), 'info');

            if (MAX_COUNT && github.length > MAX_COUNT) {
                util.log(`  use 'ma list --github' to see all github projects`, 'info');
            }
            if (program.github) {
                util.log(`  You can registe your project from here: https://github.com/efe-blue/ma_templates`, 'info');
            }
            console.log('\n');
        }
    });
}