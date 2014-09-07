var expect = require('chai').expect;
var lob = require('../index.js');


describe('hashname', function(){

  it('should encode', function(){
    var json = {
      "type":"test",
      "foo":["bar"]
    };
    var body = new Buffer("any binary!");
    var bin = lob.encode(json, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(42);
  });

  it('should decode', function(){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var packet = lob.decode(bin);
    expect(packet).to.be.a('object');
    expect(packet.json.type).to.be.equal('test');
    expect(packet.body.length).to.be.equal(11);
  });

  it('should handle no head', function(){
    var body = new Buffer("any binary!");
    var bin = lob.encode(null, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(13);
    var packet = lob.decode(bin);
    expect(packet.head.length).to.be.equal(0);
    expect(packet.body.toString()).to.be.equal("any binary!");
  });

  it('should handle bin head', function(){
    var head = new Buffer("42","hex");
    var body = new Buffer("any binary!");
    var bin = lob.encode(head, body);
    expect(Buffer.isBuffer(bin)).to.be.equal(true);
    expect(bin.length).to.be.equal(14);
    var packet = lob.decode(bin);
    expect(packet.head.length).to.be.equal(1);
    expect(packet.head.toString("hex")).to.be.equal("42");
    expect(packet.body.toString()).to.be.equal("any binary!");
  });

  it('should verify', function(){
    var bin = new Buffer('001d7b2274797065223a2274657374222c22666f6f223a5b22626172225d7d616e792062696e61727921','hex');
    var packet = lob.decode(bin);
    expect(lob.isPacket(packet)).to.be.true;
    expect(lob.isPacket({})).to.be.false;
    expect(lob.isPacket({json:{},length:0,head:new Buffer(0),body:new Buffer(0)})).to.be.true;
    expect(lob.isPacket({json:{},head:new Buffer(0),body:new Buffer(0)})).to.be.false;
    expect(lob.isPacket({json:{},length:0,head:new Buffer(0),body:""})).to.be.false;
  });

  it('should packet', function(){
    var packet = lob.packet({a:0},new Buffer(2));
    expect(lob.isPacket(packet)).to.be.true;
    expect(packet.length).to.be.equal(11);
  });

})