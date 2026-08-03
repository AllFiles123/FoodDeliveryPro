import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import env from "../config/env.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const databaseFolder = path.join(
  __dirname,
  "../../database"
);


const databaseFile = path.join(
  databaseFolder,
  env.dbName
);


let db;



async function connectDatabase() {


  const SQL = await initSqlJs();



  if (!fs.existsSync(databaseFolder)) {

    fs.mkdirSync(databaseFolder, {
      recursive:true,
    });

  }




  if (fs.existsSync(databaseFile)) {


    const fileBuffer =
      fs.readFileSync(databaseFile);


    db =
      new SQL.Database(fileBuffer);


  } else {


    db =
      new SQL.Database();


  }



  console.log("✅ SQLite Connected");

  console.log(
    `📂 Database: ${databaseFile}`
  );



  runMigrations();



  saveDatabase();



  return db;

}




function runMigrations(){


  if(!db) return;



  /*
    Orders Table Upgrade
    Existing Data Safe
  */


  const columns = db.exec(`

    PRAGMA table_info(orders)

  `);



  if(columns.length){


    const existingColumns =
      columns[0].values.map(
        row=>row[1]
      );



    const newColumns = {


      customerName:
      "TEXT DEFAULT ''",


      customerPhone:
      "TEXT DEFAULT ''",


      division:
      "TEXT DEFAULT ''",


      district:
      "TEXT DEFAULT ''",


      upazila:
      "TEXT DEFAULT ''",


      area:
      "TEXT DEFAULT ''",


      fullAddress:
      "TEXT DEFAULT ''",


      subtotal:
      "REAL DEFAULT 0",


      vat:
      "REAL DEFAULT 0",


      paymentStatus:
      "TEXT DEFAULT 'Pending'",


      orderStatus:
      "TEXT DEFAULT 'Pending'",


      updatedAt:
      "DATETIME DEFAULT CURRENT_TIMESTAMP"


    };



    Object.entries(newColumns)
      .forEach(
        ([column,type])=>{


          if(
            !existingColumns.includes(column)
          ){


            db.run(`

              ALTER TABLE orders

              ADD COLUMN ${column}

              ${type}

            `);


            console.log(
              `Migration Added: ${column}`
            );


          }


        }

      );


  }


}






function getDatabase() {

  return db;

}





function saveDatabase() {


  if(!db) return;



  const data =
    db.export();



  fs.writeFileSync(

    databaseFile,

    Buffer.from(data)

  );


}





export {

  connectDatabase,

  getDatabase,

  saveDatabase,

};


export default getDatabase;
