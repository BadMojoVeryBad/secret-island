import { injectable } from 'inversify';
import { Component } from '../../../framework/component';

@injectable()
export class Cutscenes extends Component {
    public init(): void {
        // Add all other cutscenes.
        this.addComponent('endLevel1Cutscene');
    }
}
