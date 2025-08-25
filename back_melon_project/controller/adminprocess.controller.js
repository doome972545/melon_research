const connection = require("../config/db");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const result = await connection.query(
        "SELECT u.id, u.firstName, u.lastName, u.fullName,u.update_data,u.profile_info, u.phone, u.status,u.create_At, COUNT(m.user_id) AS melon_count, SUM(m.cost) AS total_cost, SUM(CASE WHEN m.status = 'start' THEN m.cost ELSE 0 END) AS total_cost_start,COUNT(CASE WHEN m.status = 'start' THEN 1 END) AS active_melon_count ,COUNT(CASE WHEN m.status = 'end' THEN 1 END) AS inactive_melon_count  FROM users u LEFT JOIN melon_greenhouse m ON u.id = m.user_id WHERE u.status != 'admin' GROUP BY u.id, u.firstName, u.lastName, u.fullName, u.phone, u.status, u.create_At; ",
        (err, result) => {
          if (err) throw console.log(err.message);
          const ids = result.map((user) => user.id);
          // console.log(ids)
          const user_id = ids.map((id) => id.toString());
          return res.status(200).json(result);
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  getUserAllhouse: async (req, res) => {
    const data = await req.body;
    try {
      await connection.query(
        "SELECT hg.*,pt.planting_name FROM melon_greenhouse hg JOIN planting_type pt ON hg.planting_type_id = pt.planting_id WHERE user_id = ? ORDER BY hg.create_at ASC",
        [data.user_id],
        (err, result, field) => {
          if (err) {
            console.log(err);
            return res.status(400).send(err.message);
          }
          return res.status(200).json({ data: result });
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  getUserActivities: async (req, res) => {
    const data = await req.body;
    try {
      connection.query(
        "SELECT acc.* , act.activity_name FROM activities_costs acc JOIN activities act ON acc.activities_id = act.activity_id WHERE user_id = ? AND house_id = ?  ORDER BY acc.activities_id",
        [data.user_id, data.house_id],
        (err, result, field) => {
          if (err) throw console.log(err);
          // console.log(result)
          return res.status(200).json(result);
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  getListCostsAdmin: (req, res) => {
    const data = req.body;
    try {
      // Query สำหรับการดึงข้อมูล list
      connection.query(
        "SELECT mc.*, li.list_name FROM melon_costs_fv mc JOIN list li ON mc.list_id = li.list_id WHERE user_id = ? AND house_id = ? AND activities_id = ?",
        [
          data.user_id,
          data.selectActivities.house_id,
          data.selectActivities.activities_id,
        ],
        (err, listResult) => {
          if (err) {
            console.log(err.message);
            return res.status(500).send("Error in retrieving list");
          }

          // Query สำหรับการดึงข้อมูล total cost
          connection.query(
            "SELECT SUM(cost) AS total_cost FROM melon_costs_fv WHERE user_id = ? AND house_id = ? AND activities_id = ?",
            [
              data.user_id,
              data.selectActivities.house_id,
              data.selectActivities.activities_id,
            ],
            (err, costResult) => {
              if (err) {
                console.log(err.message);
                return res.status(500).send("Error in calculating total cost");
              }

              // ส่งข้อมูลกลับไปที่ client
              return res.status(200).json({
                list: listResult,
                total_cost: costResult[0].total_cost,
              });
            }
          );
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  approveUser: async (req, res) => {
    const data = await req.body;
    try {
      await connection.query(
        "UPDATE users SET status = ? WHERE id = ?",
        ["farmer", data.id],
        (err, result) => {
          if (err) return res.status(500).send("Internal Server Error");
          return res.status(200).send("delete from users");
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  get_data_chart: async (req, res) => {
    const data = await req.body;
    try {
      let sql = `
                    SELECT 
                        list.list_name, 
                        COALESCE(SUM(chart.cost), 0) AS total_cost,
                        GROUP_CONCAT(DISTINCT costs.cost_id) AS cost_ids  -- รวม cost_id โดยใช้ DISTINCT เพื่อไม่ให้ซ้ำ
                    FROM 
                        costs
                    LEFT JOIN 
                        chart ON chart.cost_id = costs.cost_id 
                        AND MONTH(chart.created_at) IN (${data.months
                          .map(() => "?")
                          .join(",")}) 
                        AND YEAR(chart.created_at) = ?
                    LEFT JOIN 
                        list ON list.list_id = costs.list_id 
                    WHERE 
                        costs.canShow = 1   
                    GROUP BY 
                        list.list_name  -- กลุ่มตามชื่อรายการ
                    HAVING 
                        total_cost > 0;`;

      const queryParams = [...data.months, data.year]; // สร้าง array ของ parameters สำหรับ SQL

      connection.query(sql, queryParams, (err, result) => {
        if (err) {
          console.error(err.message); // แสดงข้อผิดพลาดที่เกิดขึ้น
          return res.status(500).json({ error: "Internal Server Error" }); // ส่ง error response
        }
        res.status(200).json(result); // ส่งผลลัพธ์กลับไปที่ client
      });
      // connection.query(
      //     "SELECT chart.cost AS cost, list.list_name FROM costs  JOIN chart ON chart.cost_id = costs.cost_id AND MONTH(chart.created_at) = ? AND YEAR(chart.created_at) = ? LEFT JOIN list ON list.list_id = costs.list_id WHERE costs.canShow = true;",
      //     // [data.month, data.year],
      //     [10, 2024],
      //     (err, result) => {
      //         if (err) {
      //             console.error(err.message);  // แสดงข้อผิดพลาดที่เกิดขึ้น
      //             return res.status(500).json({ error: 'Internal Server Error' });  // ส่ง error response
      //         }
      //         console.log(result);  // แสดงผลลัพธ์ที่ได้จาก query
      //         res.json(result);  // ส่งผลลัพธ์กลับไปที่ client
      //     }
      // );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  get_costs: async (req, res) => {
    try {
      const sql = `
                        SELECT c.*, a.*,l.*
                        FROM costs c
                        INNER JOIN activities a ON c.activities_id = a.activity_id
                        JOIN list l ON c.list_id = l.list_id
                        `;
      connection.query(sql, (err, result) => {
        if (err) {
          console.error(err.message); // แสดงข้อผิดพลาดที่เกิดขึ้น
          return res.status(500).json({ error: "Internal Server Error" }); // ส่ง error response
        }
        res.status(200).json(result);
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  edit_costs: async (req, res) => {
    const data = await req.body;
    try {
      if (!data.list_id || !data.list_name || !data.cost_id) {
        return res.status(400).send("Missing required fields");
      }
      const listSql = `UPDATE list SET list_name = ? WHERE list_id = ?`;
      const costsSql = `
            UPDATE costs 
            SET cost_sand = ?, cost_clay = ?, cost_pots = ?, cost_bags = ?, canShow = ?
            WHERE cost_id = ?
            `;
      await connection.query(listSql, [data.list_name, data.list_id]);
      await connection.query(
        costsSql,
        [
          data.cost_sand ?? null, // หากเป็น null ก็ให้ใส่ค่า null
          data.cost_clay ?? null,
          data.cost_pots ?? null,
          data.cost_bags ?? null,
          data.canShow,
          data.cost_id,
        ],
        (err, result) => {
          if (err) throw err;
          return res.status(200).send("Data updated successfully");
        }
      );
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
  create_costs: async (req, res) => {
    const data = await req.body;
    try {
      const insertListSql = `INSERT INTO list (list_name) VALUES (?)`;
      const listSql = `SELECT list_id FROM list WHERE list_name = ?`;
      const insertCosts = `
            INSERT INTO costs ( activities_id , list_id , cost_clay , cost_sand , cost_bags , cost_pots,canShow) VALUES (?,?,?,?,?,?,?)
            `;
      await connection.query(insertListSql, [data.list_name], (err, result) => {
        connection.query(listSql, [data.list_name], (err, resultselect) => {
          const list_id = resultselect[0].list_id;
          connection.query(
            insertCosts,
            [
              data.activity_id,
              list_id,
              data.cost_sand ?? null, // หากเป็น null ก็ให้ใส่ค่า null
              data.cost_clay ?? null,
              data.cost_pots ?? null,
              data.cost_bags ?? null,
              data.canShow,
            ],
            (err, resultInsert) => {
              if (err) throw err.message;
              return res
                .status(200)
                .json({ message: "บันทึกข้อมูลเรียบร้อยแล้ว" });
            }
          );
        });
      });
    } catch (e) {
      console.log(e.message);
      return res.status(500).send("Internal Server Error");
    }
  },
};
