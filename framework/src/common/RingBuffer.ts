
module lcc$nes {

/**
 * 环形缓冲区
 */
export class RingBuffer  {
	
	private _elements:any[] = null;
	private _first:number = 0;
	private _last:number = 0;
	private _size:number = 0;
	private _evictedCb:Function = null;

	/**
	 * Initializes a new empty `RingBuffer` with the given `capacity`, when no
	 * value is provided uses the default capacity (50).
	 *
	 * If provided, `evictedCb` gets run with any evicted elements.
	 *
	 * @param {Number}
	 * @param {Function}
	 * @return {RingBuffer}
	 * @api public
	 */
	constructor(capacity:number, evictedCb?:Function){
		this._elements = new Array(capacity || 50);
		this._first = 0;
		this._last = 0;
		this._size = 0;
		this._evictedCb = evictedCb;
	}

	/**
	 * Returns the capacity of the ring buffer.
	 *
	 * @return {Number}
	 * @api public
	 */
	public capacity(){
		return this._elements.length;
	}

	/**
	 * Returns the size of the queue.
	 *
	 * @return {Number}
	 * @api public
	 */
	public size(){
		return this._size;
	}

	/**
	 * Returns whether the ring buffer is empty or not.
	 *
	 * @return {Boolean}
	 * @api public
	 */
	public isEmpty(){
		return this.size() === 0;
	}

	/**
	 * Returns whether the ring buffer is full or not.
	 *
	 * @return {Boolean}
	 * @api public
	 */
	public isFull(){
		return this.size() === this.capacity();
	}

	/**
	 * Peeks at the top element of the queue.
	 *
	 * @return {Object}
	 * @throws {Error} when the ring buffer is empty.
	 * @api public
	 */
	public peek(){
		if (this.isEmpty()) throw new Error('RingBuffer is empty');
		return this._elements[this._first];
	}

	/**
	 * Peeks at multiple elements in the queue.
	 *
	 * @return {Array}
	 * @throws {Error} when there are not enough elements in the buffer.
	 * @api public
	 */
	public peekN(count:number){
		if (count > this._size) throw new Error('Not enough elements in RingBuffer');

		let end = Math.min(this._first + count, this.capacity());
		let firstHalf = this._elements.slice(this._first, end);
		if (end < this.capacity()) {
		  	return firstHalf;
		}
		let secondHalf = this._elements.slice(0, count - firstHalf.length);
		return firstHalf.concat(secondHalf);
	}

	/**
	 * Dequeues the top element of the queue.
	 *
	 * @return {Object}
	 * @throws {Error} when the ring buffer is empty.
	 * @api public
	 */
	public deq(){
		let element = this.peek();

		this._size--;
		this._first = (this._first + 1) % this.capacity();
	  
		return element;
	}

	/**
	 * Dequeues multiple elements of the queue.
	 *
	 * @return {Array}
	 * @throws {Error} when there are not enough elements in the buffer.
	 * @api public
	 */
	public deqN(count:number){
		let elements = this.peekN(count);

		this._size -= count;
		this._first = (this._first + count) % this.capacity();
	  
		return elements;
	}

	/**
	 * Enqueues the `element` at the end of the ring buffer and returns its new size.
	 *
	 * @param {Object} element
	 * @return {Number}
	 * @api public
	 */
	public enq(element:any){
		this._last = (this._first + this.size()) % this.capacity();
		let full = this.isFull()
		if (full && this._evictedCb) {
		  this._evictedCb(this._elements[this._last]);
		}
		this._elements[this._last] = element;
	  
		if (full) {
		  this._first = (this._first + 1) % this.capacity();
		} else {
		  this._size++;
		}
		
		return this.size();
	}
}

}
