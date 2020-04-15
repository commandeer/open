import { ITable } from './ITable';
import { StreamSpecification } from './StreamSpecification';

export class Table implements ITable {
  streamSpecification?: StreamSpecification;

  constructor(table: ITable) {
    if (table.streamSpecification) {
      this.streamSpecification = new StreamSpecification(table.streamSpecification);
    }
  }
}
