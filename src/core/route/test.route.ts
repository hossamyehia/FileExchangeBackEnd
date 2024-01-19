import { Router, Request, Response } from "express";
import { db } from "../config";
import * as fs from "fs";

import * as readline from "readline";
import events from "events";

const testRoutes = Router();

testRoutes.route("/").get(async (req: Request, res: Response, next: any) => {
  /*
  await db.transaction(async (trx) => {
    let queries: any[] = [];
    IDs.forEach((ehsa) => {
      queries.push(
        db("wehda").select("ehsa").where({ ehsa }).first().transacting(trx)
      );
    })
    return Promise.all(queries).then(trx.commit).catch(trx.rollback);
      
    
  }).then(function (values) {
    const NOT_FOUND = values.map(({ ehsa })=>{
        if(!IDs.includes(ehsa)) return ehsa;
    })

    res.json(NOT_FOUND);
  })
  .catch(function (error: | any) {
    res.json(error);
  });
  */

  /*
  fs.readFile("./logs/23-06-2023.log", "utf8", (err, file) => {
    res.send(file)
    //res.json({RUNNING: "RUNNGING", file})
  });
  */
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream("./logs/23-06-2023.log"),
      crlfDelay: Infinity,
    });

    let Lines: string[] = [];

    rl.on("line", (line) => {
      /**
       * Digits that isnot between ""
       */

      if (line.match(/'([^']+)'/g))
        line = line.replace(
          /'([^']+)'/g,
          "<span class='darkOrange'>$&</span>"
        );
        
      if (line.match(/"([^"]+)"/g))
        line = line.replace(
          /"([^"]+)"/g,
          "<span class='gray'>$&</span>"
        );

      if (/-?\d+(.\d+)?(?=(([^"]*"){2})*[^"]*$)/g.test(line))
        line = line.replace(
          /-?\d+(.\d+)?(?=(([^"]*"){2})*[^"]*$)/g,
          "<span class='blue'>$&</span>"
        );

      if (line.match(/Number:|Code:|Message:/g))
        line = line.replace(
          /Number:|Code:|Message:/g,
          "<span class='green'>$&</span>"
        );

      if (line.match(/SQL ERROR/g))
        line = line.replace(/SQL ERROR/g, "<span class='red'>$&</span>");

      Lines.push("<div>" + line + "</div>");
    });

    await events.once(rl, "close");

    res.send(
      `
            <style>
                body{
                    margin: 0 auto;
                    padding: 0;
                }
                .main{
                    padding: 1em;
                }
                .blue{
                    color: hsl(224, 80%, 50%);
                }
                .lightBlue{
                  color: hsl(216, 49%, 72%);
                }
                .darkOrange{
                    color: hsl(33, 100%, 50%);
                }
                .gray{
                  color: hsl(262, 10%, 59%); 
                }
                .yellow{
                  color: hsl(48, 98%, 51%); 
                }
                .bg-yellow{
                  color: white;
                  background-color: hsl(48, 98%, 51%); 
                }
                .lightBrown{
                  color: hsl(36deg, 75%, 70%);
                }
                .voilet{
                    color: #6f00ff;
                }
                .green{
                  color: hsl(178, 41%, 36%); 
                }
                .red{
                    color: red;
                }
                .lightRed{
                  color: hsl(10, 70%, 62%); 
                }
                .bgMain{
                    background-color: hsl(174, 38%, 95%);
                }
            </style>
            <div class='main bgMain'>
                ${Lines.join("")}
            </div>
        `
    );
  } catch (err) {
    res.json({ err });
  }
});
export default testRoutes;
