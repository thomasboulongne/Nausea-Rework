import * as contentful from 'contentful';

// Preview API
let host = 'preview.contentful.com';
let accessToken = '';

if(process.env.__PROD__) {
	// Content API
	host = 'cdn.contentful.com';
	accessToken = '';
}

export const contentfulClient = contentful.createClient({
	space: '',
	insecure: true,

	host: host,
	accessToken: accessToken
});
