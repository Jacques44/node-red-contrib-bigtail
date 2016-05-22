# node-red-contrib-bigtail

"Tail" for Big Nodes. This node captures several payloads and build a buffer of the last needed messages with or not size limit

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455823/d4666a48-205f-11e6-8a46-a508159a5475.png)

## Installation
```bash
npm install node-red-contrib-bigtail
```

## Principles for Big Nodes
 
See [biglib](https://www.npmjs.com/package/node-red-biglib) for details on Big Nodes.
`Big Lib` and subsequent `Big Nodes` are a family of nodes built for my own purpose. They are all designed to help me build a complete process for **production purposes**. For that I needed nodes able to:

* Flow **big volume** of data (memory control, work with buffers)
* Work with *a flow of blocks* (buffers) (multiple payload within a single job)
* Tell what *they are doing* with extended use of statuses (color/message)
* Use their *second output for flow control* (start/stop/running/status)
* *Reuse messages* in order to propagate _msgid, topic
* Depends on **state of the art** libraries for parsing (csv, xml, xlsxs, line, ...)
* Acts as **filters by default** (1 payload = 1 action) or **data generators** (block flow)

All functionnalities are built under a library named `biglib` and all `Big Nodes` rely on it

## Usages

Big Tail is a filter node for node-red to store data and send only the last elements needed. 
It waits first for a **control message** which all `big nodes` send on their second output. It looks like this:

```json
{ "control": { "state": "start" }}
```

It then, store messages, trashing all old ones that won't let him satisfy its parameters (number of messages and size in Kb)

When it receives a ending control message, it sends its output as a single message. An ending control message looks like:

```json
{ "control": { "state": "end" }}
```

If **no** control message is given, it acts as a pass-through sending all messages it receives.

It has two options:

* **number of payloads**. If set, the node will store only the **last** messages it receives
* **size in Kb**. If set, the node will store **no more** than the specified size

## Dependencies

[biglib](https://www.npmjs.com/package/node-red-biglib) library for building node-red flows that supports blocks, high volume

## Example flow files

  Try pasting in the flow file below that shows the node behaviour 

```json
[{"id":"819125ff.7e6ed8","type":"inject","z":"894b4f7b.76b4b","name":"trigger","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":true,"x":130,"y":540,"wires":[["d4918a0c.2b6e78"]]},{"id":"2ac3bdc8.d53c42","type":"bigtail","z":"894b4f7b.76b4b","name":"last 10","size":"10","add_cr":true,"size_kbyte":"","x":450,"y":500,"wires":[["57c9c569.a8363c"],[]]},{"id":"d4918a0c.2b6e78","type":"function","z":"894b4f7b.76b4b","name":"seeder","func":"node.send({ \"control\": { \"state\": \"start\"}});\nfor (i = 0; i < 100; i++) {\n    node.send({ \"payload\": \"This is line #\" + (i+1) });\n}\nnode.send({ \"control\": { \"state\": \"end\" }});","outputs":1,"noerr":0,"x":290,"y":540,"wires":[["2ac3bdc8.d53c42","a2b5eb7c.5d4a18"]]},{"id":"57c9c569.a8363c","type":"debug","z":"894b4f7b.76b4b","name":"","active":true,"console":"false","complete":"false","x":630,"y":500,"wires":[]},{"id":"69b31138.964cf","type":"comment","z":"894b4f7b.76b4b","name":"Big Tail sample","info":"","x":140,"y":480,"wires":[]},{"id":"a2b5eb7c.5d4a18","type":"bigtail","z":"894b4f7b.76b4b","name":"last 10","size":"","add_cr":true,"size_kbyte":"0.5","x":450,"y":580,"wires":[["84da5f92.7b25a"],[]]},{"id":"84da5f92.7b25a","type":"debug","z":"894b4f7b.76b4b","name":"","active":true,"console":"false","complete":"false","x":630,"y":580,"wires":[]}]
```

![alt tag](https://cloud.githubusercontent.com/assets/18165555/15455822/d1baad68-205f-11e6-99c4-5043d10c0cd7.png)

## Author

  - Jacques W

## License

This code is Open Source under an Apache 2 License.

You may not use this code except in compliance with the License. You may obtain an original copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. Please see the
License for the specific language governing permissions and limitations under the License.

## Feedback and Support

Please report any issues or suggestions via the [Github Issues list for this repository](https://github.com/Jacques44/node-red-contrib-bigline/issues).

For more information, feedback, or community support see the Node-Red Google groups forum at https://groups.google.com/forum/#!forum/node-red


