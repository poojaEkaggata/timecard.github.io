"use strict";

var _pg = _interopRequireDefault(require("pg"));

var _express = _interopRequireDefault(require("express"));

var _mysql = _interopRequireDefault(require("mysql"));

var _cors = _interopRequireDefault(require("cors"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _memorystore = _interopRequireDefault(require("memorystore"));

var _passport = _interopRequireDefault(require("passport"));

var _exceljs = _interopRequireDefault(require("exceljs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//const { Pool } = require('pg');
var Pool = _pg["default"].Pool;
var pool = new Pool({
  //connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  user: 'default',
  host: 'ep-small-boat-15115189-pooler.us-east-1.postgres.vercel-storage.com',
  database: 'verceldb',
  password: 'Cokgqd2sj1uI',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});
pool.connect(function (err) {
  if (err) throw err;
  console.log("Connect to postgreSQL database successfully.");
});
var app = (0, _express["default"])();
var MemoryStore = (0, _memorystore["default"])(_expressSession["default"]);
app.use(_express["default"].json());
app.use((0, _cors["default"])({
  origin: ["http://localhost:3000"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use((0, _cookieParser["default"])());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));
app.use(_bodyParser["default"].json());
app.use((0, _expressSession["default"])({
  key: "userId",
  secret: "subscribe",
  resave: true,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true
  } //cookie: { expires: 60 * 60 * 24 }

}));
app.use(_passport["default"].initialize());
app.use(_passport["default"].session()); //const db = mysql.createConnection({host:"localhost",user:"root",password:"",database:"ekatimesheet"});

app.get('/login', function (req, res) {
  if (req.session.user) {
    res.send({
      loggedIn: true,
      user: req.session.user
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});
app.post('/login', function (req, res) {
  var getUserSql = "select * from user where email = ?";
  pool.query(getUserSql, [req.body.email], function (err, results) {
    if (err) {
      return res.status(500).json({
        message: 'Error retrieving user'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    if (results.length > 0) {
      var inputedPassword = req.body.password;
      var storedHashedPassword = results[0].password;

      _bcrypt["default"].compare(inputedPassword, storedHashedPassword, function (error, response) {
        if (response) {
          req.session.user = results;
          var userEmail = results[0].email;
          return res.status(200).json({
            message: 'Login successful',
            user: {
              email: userEmail
            }
          });
        } else {
          return res.status(401).json({
            message: 'Incorrect password'
          });
        }
      });
    } else {
      return res.status(401).json({
        message: 'User does not exist!'
      });
    }
  });
});
app.get('/home/userinfo', function (req, res) {
  if (req.session && req.session.user) {
    console.log("Log in true");
    console.log(req.session.user);
    res.send({
      loggedIn: true,
      user: req.session.user
    });
  } else {
    console.log("Log in false");
    console.log(req.session.user);
    res.send({
      loggedIn: false
    });
  }
});
app.post('/home/user', function (req, res) {
  var sql = "select name from user";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Supervisor Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting supervisor.",
        Result: result
      });
    }
  });
});
app.post('/home/team', function (req, res) {
  var sql = "select name from customer";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Team Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting team.",
        Result: result
      });
    }
  });
});
app.post('/home/customer', function (req, res) {
  var sql = "select * from customer";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Customer Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting customer.",
        Result: result
      });
    }
  });
});
app.post('/home/customer/add_new_customer', function (req, res) {
  var name = req.body.name;
  var insertCustomerSql = "insert into customer (name) values (?)";
  var values = [name];
  pool.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting customer"
      });
    }

    var newCustomerId = result.insertId;
    var updateCustomerIdSql = "update customer set customer_id=? where id=?";
    var updateValues = [newCustomerId, newCustomerId];
    pool.query(updateCustomerIdSql, updateValues, function (updateErr, updateResult) {
      if (updateErr) {
        return res.json({
          error: "Error updating customer_id!"
        });
      } else {
        return res.json({
          message: "Customer created successfully."
        });
      }
    });
  });
});
app.post('/home/get_project', function (req, res) {
  var sql = "select * from project";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Project Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting project.",
        Result: result
      });
    }
  });
});
app.post('/home/project/add_new_project', function (req, res) {
  var name = req.body.name;
  var insertCustomerSql = "insert into project (name) values (?)";
  var values = [name];
  pool.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting project"
      });
    }

    var newCustomerId = result.insertId;
    var updateCustomerIdSql = "update project set project_id=? where id=?";
    var updateValues = [newCustomerId, newCustomerId];
    pool.query(updateCustomerIdSql, updateValues, function (updateErr, updateResult) {
      if (updateErr) {
        return res.json({
          error: "Error updating project_id!"
        });
      } else {
        return res.json({
          message: "Project created successfully."
        });
      }
    });
  });
});
app.post('/home/get_activity', function (req, res) {
  var sql = "select * from activity";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Activity Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting activity.",
        Result: result
      });
    }
  });
});
app.post('/home/activity/add_new_activity', function (req, res) {
  var name = req.body.name;
  var insertCustomerSql = "insert into activity (name) values (?)";
  var values = [name];
  pool.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting activity"
      });
    } else {
      return res.json({
        message: "Activity created successfully."
      });
    }
  });
});
app.post('/home/get_tag', function (req, res) {
  var sql = "select * from tags";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Tag Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting tag.",
        Result: result
      });
    }
  });
});
app.post('/home/tag/add_new_tag', function (req, res) {
  var name = req.body.name;
  var insertCustomerSql = "insert into tags (name) values (?)";
  var values = [name];
  pool.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting tag"
      });
    } else {
      return res.json({
        message: "Tag created successfully."
      });
    }
  });
});
app.post('/home/get_all_users', function (req, res) {
  var sql = "select * from user";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get User Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting user.",
        Result: result
      });
    }
  });
});
app.post('/home/role', function (req, res) {
  var sql = "select name from role";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Role Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting role.",
        Result: result
      });
    }
  });
});
app.post('/home', function (req, res) {
  var salt = 10;
  var _req$body = req.body,
      name = _req$body.name,
      email = _req$body.email,
      password = _req$body.password,
      title = _req$body.title,
      language = _req$body.language,
      timezone = _req$body.timezone,
      staff_number = _req$body.staff_number,
      supervisor = _req$body.supervisor,
      team = _req$body.team,
      role = _req$body.role;
  var insertUserSql = "insert into user (name,email,password,title,language,timezone,staff_number,supervisor,team,role) values (?,?,?,?,?,?,?,?,?,?)";

  _bcrypt["default"].hash(password.toString(), salt, function (err, hashedPassword) {
    if (err) {
      return res.json({
        Error: "Error for hashing password"
      });
    } else {
      var values = [name, email, hashedPassword, title, language, timezone, staff_number, supervisor, team, role];
      pool.query(insertUserSql, values, function (err, result) {
        if (err) {
          return res.json({
            error: "Error inserting user"
          });
        }

        var newUserId = result.insertId;
        var updateUserIdSql = "update user set user_id=? where id=?";
        var updateValues = [newUserId, newUserId];
        pool.query(updateUserIdSql, updateValues, function (updateErr, updateResult) {
          if (updateErr) {
            return res.json({
              error: "Error updating user_id!"
            });
          } else {
            return res.json({
              message: "User created successfully."
            });
          }
        });
      });
    }
  });
});
app.post('/home/customer', function (req, res) {
  var sql = "select * from customer";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Customer Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting customer.",
        Result: result
      });
    }
  });
});
app.post('/home/project', function (req, res) {
  var customerId = req.body.customerId;
  var query = "select * from project where customer_id = ?";
  pool.query(query, [customerId], function (err, results) {
    if (err) {
      res.status(500).json({
        error: 'Error fetching projects'
      });
      return;
    }

    if (results.length > 0) {
      res.json({
        projects: results
      });
    } else {
      res.json({
        projects: []
      });
    }
  });
});
app.post('/home/activity', function (req, res) {
  var query = "select * from activity";
  pool.query(query, function (err, results) {
    if (err) {
      //console.error('Error fetching activities from database:',err);
      res.status(500).json({
        error: 'Error fetching activities'
      });
      return;
    }

    if (results.length > 0) {
      res.json({
        Result: results
      });
    } else {
      res.json({
        Result: []
      });
    }
  });
});
app.post('/home/tag', function (req, res) {
  var sql = "select * from tags";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Tag Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting Tag.",
        Result: result
      });
    }
  });
});
app.post('/home/timesheet', function (req, res) {
  var _req$body2 = req.body,
      userId = _req$body2.userId,
      selectedFromDate = _req$body2.selectedFromDate,
      selectedStartTime = _req$body2.selectedStartTime,
      duration = _req$body2.duration,
      selectedEndTime = _req$body2.selectedEndTime,
      newSelectedCustomerNameValue = _req$body2.newSelectedCustomerNameValue,
      stringifiedProjects = _req$body2.stringifiedProjects,
      selectedActivityValue = _req$body2.selectedActivityValue,
      description = _req$body2.description,
      selectedTagValue = _req$body2.selectedTagValue;
  var sql = 'insert into timesheet(user_id,fromdate,fromtime,duration,endtime,customer,projects,activity,description,tag)values(?,?,?,?,?,?,?,?,?,?)';
  pool.query(sql, [userId, selectedFromDate, selectedStartTime, duration, selectedEndTime, newSelectedCustomerNameValue, stringifiedProjects, selectedActivityValue, description, selectedTagValue], function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: 'Error Saving Data'
      });
    } else {
      res.status(200).json({
        message: 'Timesheet Saved Successfully.'
      });
    }
  });
});
app.post('/home/update_user', function (req, res) {
  var _req$body3 = req.body,
      id = _req$body3.id,
      name = _req$body3.name,
      email = _req$body3.email,
      title = _req$body3.title,
      language = _req$body3.language,
      timezone = _req$body3.timezone,
      staff_number = _req$body3.staff_number,
      supervisor = _req$body3.supervisor,
      team = _req$body3.team,
      role = _req$body3.role;
  var sql = 'UPDATE user SET name = ?, email = ?, title = ?, language = ?, timezone = ?,  staff_number = ?, supervisor = ?, team = ?, role = ? WHERE id = ?';
  pool.query(sql, [name, email, title, language, timezone, staff_number, supervisor, team, role, id], function (err, result) {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({
        error: 'Error updating user details'
      });
      return;
    } else {
      console.log('User updated successfully');
      res.status(200).json({
        message: 'User updated successfully'
      });
    }
  });
});

var createExcelFile = function createExcelFile(records) {
  var workbook, worksheet, buffer;
  return regeneratorRuntime.async(function createExcelFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          workbook = new _exceljs["default"].Workbook();
          worksheet = workbook.addWorksheet('User-Timesheet-Data-1');
          worksheet.addRow(['From Date', 'From Time', 'Duration', 'End Time', 'Customer', 'Projects', 'Activities', 'Description', 'Tag']);
          records.forEach(function (record) {
            worksheet.addRow([record.fromdate, record.fromtime, record.duration, record.endtime, record.customer, record.projects, record.activity, record.description, record.tag]);
          });
          worksheet.getColumn(1).width = 15;
          worksheet.getColumn(2).width = 15;
          worksheet.getColumn(3).width = 15;
          worksheet.getColumn(4).width = 15;
          worksheet.getColumn(5).width = 30;
          worksheet.getColumn(6).width = 30;
          worksheet.getColumn(7).width = 15;
          worksheet.getColumn(8).width = 15;
          worksheet.getColumn(9).width = 15;
          _context.next = 15;
          return regeneratorRuntime.awrap(workbook.xlsx.writeBuffer());

        case 15:
          buffer = _context.sent;
          return _context.abrupt("return", buffer);

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};

var fetchUserTimesheetRecords = function fetchUserTimesheetRecords(userId) {
  return new Promise(function (resolve, reject) {
    var query = 'select * from timesheet WHERE user_id = ?';
    pool.query(query, [userId], function (error, result) {
      if (error) {
        console.error('Error fetching user timesheet records:', error);
        reject(error);
      } else {
        var records = result.map(function (item) {
          return {
            fromdate: item.fromdate,
            fromtime: item.fromtime,
            duration: item.duration,
            endtime: item.endtime,
            customer: item.customer,
            projects: item.projects,
            activity: item.activity,
            description: item.description,
            tag: item.tag
          };
        });
        resolve(records);
      }
    });
  });
};

app.get('/home/user/:userId/records', function _callee(req, res) {
  var userId, records, excelData;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(fetchUserTimesheetRecords(userId));

        case 4:
          records = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 7:
          excelData = _context2.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching or processing user records:', _context2.t0);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
app.post('/user_home/customer', function (req, res) {
  var sql = "select * from customer";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Customer Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting customer.",
        Result: result
      });
    }
  });
});
app.post('/user_home/project', function (req, res) {
  var customerId = req.body.customerId;
  var query = "select * from project where customer_id = ?";
  pool.query(query, [customerId], function (err, results) {
    if (err) {
      res.status(500).json({
        error: 'Error fetching projects'
      });
      return;
    }

    if (results.length > 0) {
      res.json({
        projects: results
      });
    } else {
      res.json({
        projects: []
      });
    }
  });
});
app.post('/user_home/activity', function (req, res) {
  var query = "select * from activity";
  pool.query(query, function (err, results) {
    if (err) {
      res.status(500).json({
        error: 'Error fetching activities'
      });
      return;
    }

    if (results.length > 0) {
      res.json({
        Result: results
      });
    } else {
      res.json({
        Result: []
      });
    }
  });
});
app.post('/user_home/tag', function (req, res) {
  var sql = "select * from tags";
  pool.query(sql, function (err, result) {
    if (err) {
      return res.json({
        Error: "Get Tag Error!"
      });
    } else {
      return res.json({
        Status: "Succcess in getting Tag.",
        Result: result
      });
    }
  });
});
app.get('/user_home/userinfo', function (req, res) {
  if (req.session && req.session.user) {
    console.log("Log in true");
    console.log(req.session.user);
    res.send({
      loggedIn: true,
      user: req.session.user
    });
  } else {
    console.log("Log in false");
    console.log(req.session.user);
    res.send({
      loggedIn: false
    });
  }
});
app.get('/user_home/userid', function (req, res) {
  if (req.session && req.session.user) {
    var userId = req.session.user[0].user_id;
    console.log("Log in true");
    console.log(req.session.user);
    console.log(userId);
    res.json({
      loggedIn: true,
      userId: userId
    });
  } else {
    console.log("Log in false & User ID not found");
    res.send({
      loggedIn: false
    });
  }
});
app.post('/user_home/timesheet', function (req, res) {
  var _req$body4 = req.body,
      userId = _req$body4.userId,
      selectedFromDate = _req$body4.selectedFromDate,
      selectedStartTime = _req$body4.selectedStartTime,
      duration = _req$body4.duration,
      selectedEndTime = _req$body4.selectedEndTime,
      newSelectedCustomerNameValue = _req$body4.newSelectedCustomerNameValue,
      stringifiedProjects = _req$body4.stringifiedProjects,
      selectedActivityValue = _req$body4.selectedActivityValue,
      description = _req$body4.description,
      selectedTagValue = _req$body4.selectedTagValue;
  var sql = 'insert into timesheet(user_id,fromdate,fromtime,duration,endtime,customer,projects,activity,description,tag)values(?,?,?,?,?,?,?,?,?,?)';
  pool.query(sql, [userId, selectedFromDate, selectedStartTime, duration, selectedEndTime, newSelectedCustomerNameValue, stringifiedProjects, selectedActivityValue, description, selectedTagValue], function (err, result) {
    if (err) {
      res.status(500).json({
        error: 'Error Saving Data'
      });
    } else {
      res.status(200).json({
        message: 'Timesheet Saved Successfully.'
      });
    }
  });
});
app.listen(process.env.PORT, function () {
  return console.log("Server is running on port 8081");
});