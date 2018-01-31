const fs = require('graceful-fs');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const elasticlunr = require('elasticlunr');
const indexer = elasticlunr( function() {
    this.addField('text');
    this.setRef('id');
});

module.exports = class File {
	constructor(filePath, licensePatterns){
		this.filePath = filePath;
		this.text = '';
		this.licensePatterns = licensePatterns;
		this.ref = uuid();
	}

	read(){
		let self = this;
		return new Promise ( (resolve, reject) => {
			fs.readFile(this.filePath, 'utf-8' ,(err, data) => {
					if(err){
						reject(err);
					} else {
						self.text = data;
						indexer.addDoc({id : self.ref, text: self.text});
						resolve(data);
					}
			});
		});
	}

	getPotentialLicenses(){
		let list = [];
		for(let i = 0; i < this.licensePatterns.length; i++){
			let licensePattern = this.licensePatterns[i];
			if(licensePattern.patterns && Array.isArray(licensePattern.patterns)){
				for(let j = 0; j < licensePattern.patterns.length; j++){
					if(indexer.search(licensePattern.patterns[j], {}).length == 1){
							list.push(licensePattern.name);
							break;
					}

				}
			}
		}

		list.sort();

		return list;
	}
}