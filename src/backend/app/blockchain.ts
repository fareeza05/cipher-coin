// Imports
const { v4: uuidv4 } = require('uuid');
import * as crypto from 'crypto';


/**
 * This is the Block class
 * @constructor This intializes properties
 * @index This is the position of the block in the blockchain
 * @timestamp This is the time the block was created
 * @data This is the actual data we want to store
 * @previousHash This is the hash of the previous block to maintain chain
 * @hash This is the hash of the current block
 */
class Block{
    constructor( 
        public index: number, 
        public timestamp: Date,
        public data: any,
        public previousHash: string,
        public hash: string,

    ){}
}

/**
 * This is the blockchain class
 * @Properties Chain: An array that stores all the blocks in the blockchain
 * @Constructor Initializes blockchain by creating genesis block
 * @createGenesisBlock Creates first block with index 0, timestamp, data, and prev hash of 0
 * @calculateHash Uses crypto library (built-in) to create a sha256 hash
 * @addBlock Adds new block to blockchain
 * @getChain Returns current state of blockchain, allowing user to see all blocks
 * 
 */
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
        return crypto.createHash('sha256').update(index.toString() + timestamp.toISOString() + JSON.stringify(data) + previousHash).digest('hex');
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