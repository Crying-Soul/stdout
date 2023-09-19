module.exports = class DigitalLib {
  constructor() {
    this.xlsx = require("xlsx");
    this.excel = require("excel4node");
    this.path = require("path");
    this.fs = require("fs");
    this.parseOpts = { header: "A", raw: false };
    this.filesRoutes = [];
    this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  getLetterSlice(c1 = "A", c2 = "Z") {
    const a = this.alphabet.split("");
    return a.slice(a.indexOf(c1), a.indexOf(c2) + 1);
  }

  getAllFileRoutes(directory) {
    this.fs.readdirSync(directory).forEach((file) => {
      const absolute = this.path.join(directory, file);
      if (this.fs.statSync(absolute).isDirectory())
        return this.getAllFileRoutes(absolute);
      else return this.filesRoutes.push(absolute);
    });
  }
  getExcelRow(jsonData, row = "A") {
    const excelRow = [];
    jsonData.forEach((el, i) => {
      if (row in el) {
        excelRow.push({ row: i, data: el[row] });
      }
    });
    return excelRow;
  }
  getJsonFromExcelAll(fileRoute, opts = this.parseOpts) {
    let workbook = this.xlsx.read(fileRoute, {
      type: "binary",
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    let sheet_name_list = workbook.SheetNames;
    let json = [];
    sheet_name_list.forEach((sheet_name, index) => {
      json.push({
        name: sheet_name,
        index: index,
        json: this.xlsx.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list[0]],
          opts
        ),
      });
    });
  }
  getJsonFromExcelFirst(fileRoute, opts = this.parseOpts) {
    let workbook = this.xlsx.readFile(fileRoute);
    let sheet_name_list = workbook.SheetNames;
    return this.xlsx.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]],
      opts
    );
  }
  sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}
  getJsonFromExcelFirstTable(fileRoute, opts = this.parseOpts) {
    let rawJson = this.getJsonFromExcelFirst(fileRoute, opts);
    let last = "A";
    rawJson.forEach((row) => {
      console.log(row);
      if (
        this.alphabet.indexOf(Object.keys(row)[Object.keys(row).length - 1]) >
        this.alphabet.indexOf(last)
      ) {
        last = Object.keys(row)[Object.keys(row).length - 1];
      }
    });

    const newJson = [];

    rawJson.forEach((row) => {
      this.alphabet.split("").forEach((s) => {
        let keys = Object.keys(row);

        // if (this.alphabet.indexOf(last) > this.alphabet.indexOf(s) ){

        //   }
        if (!keys.includes(s) && this.alphabet.indexOf(last) >= this.alphabet.indexOf(s)) {
          // console.log(s, keys
          row[s] = null;
        }
      });
      newJson.push(this.sortOnKeys(row))
      // row.sort();
    });

    console.log(newJson);
  }
  createFile(path, filename, data, encoding = "utf8") {
    try {
      if (!this.fs.existsSync(`${path}/${filename}`)){
          this.fs.writeFileSync(`${path}/${filename}`, data);
      }
      return true;
    } catch (e) {
      console.log("Cannot write file ", e);
      return false;
    }
  }
};
