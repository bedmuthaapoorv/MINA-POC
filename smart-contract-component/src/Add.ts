import { Field, SmartContract, state, State, method} from 'snarkyjs';
import { Struct } from 'snarkyjs';
class Device extends Struct({
  UUID: Field,
  publicKey: Field
}){

}

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 * 
 * this file is where the smart contract resides
 * the Smart contract class is provided by MINA
 * everything stored in a smart contract must  ve stored as a field
 */
export class Add extends SmartContract {
  // this is how you define a field in a smart contract
  @state(Field) num = State<Field>();
  @state(Device) device=State<Device>();
  // this is the constructor where the fields are initialized
  init() {
    super.init();
    this.num.set(Field(0));
    this.device.set({
      UUID: Field(1),
      publicKey: Field(2)
    })
  }

  // this method is responsible for updating the fields in a SC
  @method update() { 
    const currentState = this.num.getAndAssertEquals();
    const newState = currentState.add(1);
    this.num.set(newState);
  }
}
