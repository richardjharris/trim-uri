var should = require('chai').should();
var trimUri = require('./index.js');

describe('trimUri', function() {
    it('should trim long subdomains', function() {
        trimUri("http://a.b.c.d.e.f.g.google.com/abc", 21).should.equal("http://…g.google.com…");
        trimUri("http://a.b.c.d.e.f.g.google.com/a", 23).should.equal("http://f.g.google.com/a");
        trimUri("http://a.b.c.d.e.f.g.google.com/abc", 19).should.equal("http://…g.google.c…");
        trimUri("http://a.b.c.d.e.f.g.google.com/a", 10).should.equal("http://…g…");
        trimUri("http://a.b.c.d.e.f.g.google.com/a", 10, "...").should.equal("http://...");
    });

    it('should trim hash and query', function() {
        const uri = 'http://example.com/foo/bar/baz?a=b&c=d#SomeLongChapter';
        trimUri(uri, 50).should.equal('http://example.com/foo/bar/baz?a=b&c=d#SomeLongCh…');
        trimUri(uri, 40).should.equal('http://example.com/foo/bar/baz?a=b&c=d#…');
        trimUri(uri, 38).should.equal('http://example.com/foo/bar/baz?a=b&c=…');

        trimUri(uri, 32).should.equal('http://example.com/foo/bar/baz?…');
        trimUri(uri, 31).should.equal('http://example.com/foo/bar/baz…');
    });

    it('should trim path stupidly', function() {
        const uri = 'https://foo.com/dir1/dir2/some-other-dirs/this-thing/12345678.html';
        trimUri(uri, 50).should.equal('https://foo.com/dir1/dir2/some-other-dirs/this-th…');
    });
    xit('should trim path intelligently', function() {
        const uri = 'https://foo.com/dir1/dir2/some-other-dirs/this-thing/12345678.html';
        trimUri(uri, 50).should.equal('https://foo.com/dir1/…/this-thing/12345678.html');
    });

    it('should not trim query if separator is longer than it', function() {
        const uri = 'http://example.com/foo/bar/baz?a=b';
        trimUri(uri, 34, '...').should.equal(uri);
        trimUri(uri, 33, '...').should.equal('http://example.com/foo/bar/baz...');
    });

    it('should trim auth', function() {
        trimUri('https://foo:bar@example.com/foo/bar', 29).should.equal('https://…@example.com/foo/bar');
        trimUri('https://foo:bar@example.com/foo/bar', 27).should.equal('https://…@example.com/foo/…');

        // No point trimming 'bar' here
        trimUri('https://bar@example.com/foo/bar', 27, '...').should.equal('https://bar@example.com/...');
    });

    it('should handle data: uris', function() {
        trimUri('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D', 30)
            .should.equal('data:text/plain;base64');
        trimUri('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D', 10)
            .should.equal('data:text…');
        trimUri('data:text/plain,foo', 30).should.equal('data:text/plain');
        trimUri('data:invalid', 30).should.equal('data:invalid');
    });
});
