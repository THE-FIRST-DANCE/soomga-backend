import fs from 'fs';

class Obj2Csv {
  /**
   * Converts an array of objects to a CSV file.
   *
   * @param objList - The array of objects to convert.
   * @param headerOrder - The order of headers in the CSV file.
   * @param outputPath - The path where the CSV file will be saved.
   */
  static convert(objList: any[], headerOrder: string[], outputPath: string) {
    const header = headerOrder.join(',') + '\n';
    let records = '';

    for (let i = 0; i < objList.length; i++) {
      let values = [];
      for (let j = 0; j < headerOrder.length; j++) {
        values.push(objList[i][headerOrder[j]]);
      }
      records += values.join(',') + '\n';
    }

    const result = header + records;

    fs.writeFileSync(outputPath, result, 'utf8');
  }
}

export default Obj2Csv;
