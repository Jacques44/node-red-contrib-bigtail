/*
  Copyright (c) 2016 Jacques W.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  This a Big Node!

  /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
 
   Big Nodes principles:
 
   #1 can handle big data
   #2 send status messages on a second output (start, end, running, error)
   #3 visually tell what they are doing (blue: ready/running, green: ok/done, error)

   Any issues? https://github.com/Jacques44
 
  /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

*/

module.exports = function(RED) {

  "use strict";

  var biglib = require('node-red-biglib');
  var stream = require('stream');

   // Definition of which options are known for spawning a command (ie node configutation to BigExec.spawn function)
  var tail_options = {
    "size": 0,
    "add_cr": false
  }  

  function BigTail(config) {

    RED.nodes.createNode(this, config);    

    var tail = function(my_config) {    

      var buffer = [];
      var size = config.size || 0;
      if (size < 0) size = 0;
      var add_cr = config.add_cr ? "\n" : "";

      // Create a buffer stream of n payloads
      var outstream = new stream.Transform( { objectMode: true });
      outstream._transform = function(data, encoding, done) {

        buffer.push(data + add_cr);
        if (size > 0 && buffer.length > size) buffer.shift();

        done();
      };

      outstream._flush = function(done) {
        if (buffer.length == 0) return done();
        this.push(buffer.join(''));
        done();
      };

      return outstream;

    }

    // new instance of biglib for this node
    var bignode = new biglib({ 
      config: config, node: this,   // biglib needs to know the node configuration and the node itself (for statuses and sends)
      status: 'filesize',           // define the kind of informations displayed while running
      parser_config: tail_options,  // the parser configuration (ie the known options the parser will understand)
      parser: tail                  // the parser 
    });

    // biglib changes the configuration to add some properties
    config = bignode.config();

    this.on('input', bignode.main.bind(bignode));

  }

  RED.nodes.registerType("bigtail", BigTail);
}


