# trim-uri

Trims a URI to the specified maximum length for display purposes. If you don't
like your logs being filled with super long URLs, fear no more. This module
handles trimming of long hostnames, paths, query strings and fragments. It
also handles relative paths and arbitrary URIs such as data: URIs.

## Install

```sh
npm install trim-uri --save
```

## Example

``js
var trimUri = require('trim-uri');

trimUri('http://super.long.annoying.hostname.com/foo/bar/baz/a/b/c/d/e.html', 50)

## Usage

#### `trimmedUri = trimUri(uri, [maxLength = 100, [separator = '…']])`

Trims the URL to the specified maximum length. The separator can be overriden
(for example to '...' or '⋯').

The order of priority for trimming is as follows:

 * Username and password, if specified
 * Hostname components beyond the first subdomain, if specified
 * Hash fragment and query string
 * URL path

Data URIs are handled specially (the content part is removed). Other URIs simply
have their rightmost part trimmed off.

## License

MIT, see [LICENSE](https://github.com/richardjharris/trim-uri/blob/master/LICENSE) for details.
