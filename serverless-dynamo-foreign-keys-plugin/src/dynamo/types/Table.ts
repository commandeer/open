import { ITable } from './ITable';
import { StreamSpecification } from './StreamSpecification';

export class Table implements ITable {
  streamSpecification?: StreamSpecification;
  latestStreamArn?: string;

  constructor(table: ITable) {
    if (table.streamSpecification) {
      this.streamSpecification = new StreamSpecification(table.streamSpecification);
    }
    this.latestStreamArn = table?.latestStreamArn;
  }
}
