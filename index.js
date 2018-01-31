const chalk = require('chalk');
const warn = chalk.keyword('orange');
const error = chalk.bold.red;
const info = chalk.blue;
const Promise = require('bluebird');
const File = require('./lib/file');
const fs = require('graceful-fs');
const patterns = require('./lib/licenses');
const recursiveReadDir = require('recursive-readdir');
const satisfies = require('spdx-satisfies');
const validates = require('spdx-expression-validate');


module.exports = (dir, options) => {

	if (!dir) {
		console.log(warn('Director is not defined. Using current directory'));
		dir = '.';
	}

	const licensePatterns = options.licensePatterns || patterns;

	let whiteLicense = options.licenses.join(',');
	let SPDXLicense = `( ${options.licenses.filter(validates).join(' OR ')} )`;

	return new Promise((resolve, reject) => {
		let prunedFiles = [];
		let fileSourceArr = [];
		let potentialProblems = [];
		let ignoreFiles = options.ignoreFiles || [];
		recursiveReadDir(dir, ignoreFiles, (err, files) => {
			if (err) {
				console.error(error(`There was a problem getting the files ${err}`));
				reject(err);
			} else {
				return Promise.each(files, file => {
					let fileSource = new File(file, licensePatterns);
					fileSource.read()
						.then(() => {
							fileSouceArr.push(fileSource);
							return;
						});
				}).catch(err => {
					console.error(error(`There was a problem reading ${file} - ${err}`));
					reject(err);
				});

			}
		)
			.then(() => {
				return Promise.each(fileSourceArr, fileSource => {
					let potentialLicenses = fileSource.getPotentialLicenses();
					return Promise.each(potentialLicenses, license => {
						if ((!validates(license) || !validates(SPDXLicense) || !satisfies(license, SPDXLicense)) && whiteLicense.indexOf(license) === -1) {
							if (options.prune) {
								prunedFiles.push(file);
								console.log(info(`Removing ${file} because it does not satisfy ${SPDXLicense}`));
								fs.unlinkSync(files[i]);
							} else {
								console.warn(warn(`Potential problems with ${file} because ${license} does not satisfy ${SPDXLicense}`));
								potentialProblems.push(files);
							}
						}
					});
				})
					.then( () => {
						resolve({warn: potentialProblems, prunedFiles})
					});

			}
	})
}
)
;
}
;


