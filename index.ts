const { listen, copy, dial, write, Buffer } = Deno;

const addr: string = ":27015";

function toBytesInt32(num) {
  const buf = new ArrayBuffer(4);
  const view = new DataView(buf);
  view.setUint32(0, num, true);
  return buf;
}

function concatArrayBuffers (...bufs) {
  const length = bufs.reduce((length, { byteLength }) => length + byteLength, 0)

  const result = new Uint8Array(length);

  bufs.reduce((offset, buf) => {
    const currentBuf = new Uint8Array(buf);
    result.set(currentBuf, offset);
    return offset + buf.byteLength;
  }, 0)

  return result;
}

// (async () => {
//   const listener = listen("tcp", addr);
//   console.log("listening on", addr);
//   while (true) {
//     const conn = await listener.accept();
//     console.log('accepting connection')
//     copy(conn, conn);
//   }
// })();
//

class SignedIntegerLE32 {
  value: number

  constructor (value: number) {
    this.value = value;
  }

  convert() {
  }
}

class Packet {
  ID: number
  Type: number
  Body: string

  constructor (
    ID: number,
    Type: number,
    Body: string,
  ) {
    this.ID = ID;
    this.Type = Type;
    this.Body = Body;
  }

  static fromBuf (buf: Uint8Array): Packet {
    return new Packet(1, 1, 'helo');
  }

  toBuf () {
    const id = toBytesInt32(this.ID)
    const type = toBytesInt32(this.Type)
    const body = this.Body && this.Body.length
      ? new TextEncoder().encode(this.Body)
      : new Uint8Array(0);

    const buf = concatArrayBuffers(id, type, body, new Uint8Array(0))

    return buf
  }
}


(async () => {
  // const conn = await dial('tcp', addr);

  const auth = new Packet(322, 3, 'ahCeegheuZaiy2O')

  const buf = auth.toBuf();
  console.log(buf)

  // conn.write(buf.bytes());

  // const readBuf = new Uint8Array(100);
  // await conn.read(readBuf);
  // console.log(new TextDecoder().decode(readBuf));



})();
