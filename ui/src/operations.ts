import Ledger from '@daml/ledger';
import { ContractId, Party } from '@daml/types';

class Operations {
    private ledger: Ledger;
    constructor(ledger: Ledger) {
        this.ledger = ledger;
    }
}



export default Operations;