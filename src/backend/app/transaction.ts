export class Transaction{
    constructor(
        public sender: string, 
        public recepient: string,
        public amount: number
    ){}
}