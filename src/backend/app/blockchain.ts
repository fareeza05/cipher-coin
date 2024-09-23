import {Block} from './block';
import crypto from 'crypto';
import {broadcastLatest} from './p2p';

const genesisBlock: Block = new Block(0, 1465154705, 'my genesis block', '', '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7');
let blockchain: Block[] = [genesisBlock];

export class Blockchain{

    calculateHash(index: number, timestamp: number, data: string, previousHash: string): string {
        var hashInput: string = index.toString() + timestamp.toString() + data + previousHash;
        return crypto.createHash('sha256').update(hashInput).digest('hex')
    }

    getLatestBlock(): Block {
        return blockchain[blockchain.length-1];

    }

    getBlockChain(): Block[] {
        return blockchain;
    }

    generateNextBlock(blockData: string) : Block {
        const previousBlock: Block = this.getLatestBlock();
        const nextIndex: number = previousBlock.index + 1;
        const nextTimeStamp: number = new Date().getTime() / 1000;
        const nextHash: string = this.calculateHash(nextIndex, nextTimeStamp, blockData, previousBlock.hash);
        const newBlock: Block = new Block(nextIndex, nextTimeStamp, blockData, previousBlock.hash, nextHash);
        this.addBlock(newBlock);
        broadcastLatest();
        return newBlock;
    }

    calculateBlockHash(block: Block): string {
        return this.calculateHash(block.index, block.timestamp,block.data, block.previousHash);

    }

    addBlock(newBlock: Block) {
        if(this.isValidBlock(newBlock, this.getLatestBlock())) {
            blockchain.push(newBlock);
        }

    }

    isValidBlockStructure(block: Block): boolean {
        return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
    
    }

    isValidBlock(newBlock: Block, prevBlock: Block): boolean {
        if(!this.isValidBlockStructure(newBlock)) {
            console.log('Invalid structure');
            return false;
        }
        if (prevBlock.index +1 !== newBlock.index){
            console.log('invalid index');
            return false;
        } else if (prevBlock.hash != newBlock.previousHash) {
            console.log('invalid previous hash');
            return false;
        } else if (this.calculateBlockHash(newBlock) !== newBlock.hash) {
            console.log('invalid hash for current block');
            return false
        }
        return true;

    }

    isValidGenesis(block: Block): boolean {
        return JSON.stringify(block) == JSON.stringify(genesisBlock);
    }

    isValidChain(blockchain : Block[]): boolean {
        if (!this.isValidGenesis(blockchain[0])){
            return false;
        }

        for(let i =1; i<blockchain.length; i++){
            if(!this.isValidBlock(blockchain[i], blockchain[i-1])){
                return false;
            }
        }

        return true;
    }

    addBlockToChain(newBlock: Block): boolean{
        if(this.isValidBlock(newBlock, this.getLatestBlock())){
            blockchain.push(newBlock);
            return true;
        }

        return false;
    }

    replaceChain(newBlocks: Block[]){
        if(this.isValidChain(newBlocks) && newBlocks.length > this.getBlockChain().length){
            console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
            blockchain = newBlocks;
            broadcastLatest();
        } else {
            console.log('Received block invalid');
        }
        
    }
}