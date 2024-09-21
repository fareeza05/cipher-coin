
export class Block {
    public nonce: number = 0;

    constructor(
        public index: number,
        public timestamp: Date,
        public data: any,
        public previousHash: string,
        public hash: string
    ){}
}