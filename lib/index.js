import Midi from "./midi";
import OPZ from "opzjs";

const midi = new Midi();
const log = document.getElementById("log");

const handler = (event) => {
  const data = OPZ.decode(event.data);

  if (data.velocity > 0 ) {
    print(`${data.action} : ${data.track} : ${data.velocity} : ${JSON.stringify(data.value)}`);
  }
};

const print = (msg) => {
  const item = document.createElement("li");
  item.appendChild(document.createTextNode(msg));
  log.prepend(item);
}

midi.setup();
setTimeout( () => {
  if (midi.devices.length > 0) {
    for (let deviceId in midi.devices) {
      confirm = midi.selectDevice(deviceId, handler);
      print(confirm);
    }
  } else {
    print("Couldn't detect any midi devices (check browser support)");
  }
}, 200);
