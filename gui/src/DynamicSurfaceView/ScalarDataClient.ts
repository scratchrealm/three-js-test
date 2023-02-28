import { getFileData } from "@figurl/interface"

const chunkSize = 1000 * 1000 * 1 // 1MB chunks. Is this a good choice?

class ScalarDataClient {
    #chunks: {[chunkIndex: number]: ArrayBuffer} = {}
    #fetchingChunks = new Set<number>()
    constructor(private scalarDataUri: string, private o: {numFrames: number, scalarDataType: 'uint8' | 'float32', numVertices: number}) {

    }
    async getFrame(index: number): Promise<Uint8Array | Float32Array | undefined> {
        const frameByteSize = this.o.scalarDataType === 'uint8' ? this.o.numVertices : this.o.numVertices * 4
        const d = await this._fetchData(index * frameByteSize, (index + 1) * frameByteSize)
        if (!d) return undefined
        if (this.o.scalarDataType === 'uint8') {
            return new Uint8Array(d)
        }
        else {
            return new Float32Array(d)
        }
    }
    public get numFrames() {
        return this.o.numFrames
    }
    async _fetchData(b1: number, b2: number): Promise<ArrayBuffer | undefined> {
        const i1 = Math.floor(b1 / chunkSize)
        const i2 = Math.floor(b2 / chunkSize)
        const pieces: ArrayBuffer[] = []
        for (let i = i1; i <= i2; i++) {
            let ch = await this._fetchChunk(i)
            if (!ch) return undefined
            if (i === i2) {
                ch = ch.slice(0, b2 - i * chunkSize)
            }
            if (i === i1) {
                ch = ch.slice(b1 - i * chunkSize)
            }
            pieces.push(ch)
        }
        // trigger getting the next chunk in advance (buffering)
        this._fetchChunk(i2 + 1)
        return concatenateArrayBuffers(pieces)
    }
    async _fetchChunk(i: number): Promise<ArrayBuffer | undefined> {
        if (this.#chunks[i]) return this.#chunks[i]
        const frameByteSize = this.o.scalarDataType === 'uint8' ? this.o.numVertices : this.o.numVertices * 4
        const expectedFileSize = frameByteSize * this.o.numVertices
        if (i * chunkSize >= expectedFileSize) return undefined
        if (this.#fetchingChunks.has(i)) {
            while (this.#fetchingChunks.has(i)) {
                await sleepMsec(100)
            }
            return this.#chunks[i]
        }
        this.#fetchingChunks.add(i)
        try {
            const i1 = chunkSize * i
            const i2 = chunkSize * (i + 1)
            const content = await getFileData(this.scalarDataUri, () => {}, {startByte: i1, endByte: i2, responseType: 'binary'})
            this.#chunks[i] = content
            return this.#chunks[i]
        }
        catch(err) {
            console.error('Error fetching chunk', err)
            return undefined
        }
        finally {
            this.#fetchingChunks.delete(i)
        }
    }
}

export const concatenateArrayBuffers = (buffers: ArrayBuffer[]) => {
    if (buffers.length === 0) return new ArrayBuffer(0)
    if (buffers.length === 1) return buffers[0]
    const totalSize = buffers.reduce((prev, buffer) => (prev + buffer.byteLength), 0)
    const ret = new Uint8Array(totalSize)
    let pos = 0
    for (const buf of buffers) {
        ret.set(new Uint8Array(buf), pos)
        pos += buf.byteLength
    }
    return ret.buffer
}

async function sleepMsec(msec: number) {
    return new Promise(resolve => {
        setTimeout(resolve, msec)
    })
}

export default ScalarDataClient