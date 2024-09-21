// Implementing Blockchain Class
const { v4: uuidv4 } = require('uuid');


class Block{
    constructor( 
        public index: number, 
        public timestamp: Date,
        public data: any,
        public previousHash: string,
        public hash: string,

    ){}
}

// Blockchain Class
class Blockchain {
    chain: Block[];

    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    private createGenesisBlock(): Block {
        return new Block(0, new Date(), "Genesis Block","0", this.calculateHash(0, new Date(), "Genesis Block", "0"));
    }

    private calculateHash(index: number, timestamp:Date, data:any, previousHash: string) : string {
        // What is happening here?
        return crypto.createHash('sha256').update(index + timestamp + JSON.stringify(data) + previousHash).digest('hex');
    }

    public addBlock(data: any) : void {
        const index = this.chain.length;
        const previousHash = this.chain[index-1].hash;
        const timestamp = new Date();
        const hash = this.calculateHash(index, timestamp, data, previousHash);
        const newBlock = new Block(index, timestamp, data, previousHash, hash);

        this.chain.push(newBlock);


    }

    public getChain() : Block[] {
        return this.chain;
    }

}