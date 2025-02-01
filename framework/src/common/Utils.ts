
module lcc$nes {

export class Utils {
	/**
	 * ArrayBuffer 转 binary string
	 */
	static ab2bs(ab:ArrayBuffer){
		let binary = "";
		let bytes = new Uint8Array(ab);
		let length = bytes.byteLength;
		for (var i = 0; i < length; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return binary;
	}
}

}
