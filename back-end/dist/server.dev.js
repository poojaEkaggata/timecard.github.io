"use strict";

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

//import http from 'http';
//import { Server } from 'socket.io';
var app = (0, _express["default"])(); //const server = http.createServer(app);
//const io = new Server(server);
// io.on('connection', (socket) => 
// {
//   console.log('Admin connected');
//   socket.on('disconnect', () => {
//     console.log('Admin disconnected');
//   });
// });

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
  resave: false,
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
app.use(_passport["default"].session());
/* passport.serializeUser((user, done) => 
{
  done(null, user.id);
});

passport.deserializeUser((id, done) => 
{
  User.findById(id, (err, user) => {
      done(err, user);
  });
}); */

var db = _mysql["default"].createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ekatimesheet"
});

db.connect(function (err) {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Your Ekatimesheet DB Connected Successfully');
  }
});
app.get('/login', function (req, res) {
  var userId = req.session.userId;

  if (req.session.user) {
    res.send({
      loggedIn: true,
      user: req.session.user,
      userId: userId
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});
app.post('/login', function (req, res) {
  var getUserSql = "select * from user where email = ?";
  db.query(getUserSql, [req.body.email], function (err, results) {
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
          var userId = results[0].user_id;
          return res.status(200).json({
            message: 'Login successful',
            user: {
              email: userEmail,
              user_id: userId
            },
            userEmail: userEmail,
            userId: userId
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
app.post('/home/user', function (req, res) {
  var sql = "select name from user";
  db.query(sql, function (err, result) {
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
  db.query(sql, function (err, result) {
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
  db.query(sql, function (err, result) {
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
  db.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting customer"
      });
    }

    var newCustomerId = result.insertId;
    var updateCustomerIdSql = "update customer set customer_id=? where id=?";
    var updateValues = [newCustomerId, newCustomerId];
    db.query(updateCustomerIdSql, updateValues, function (updateErr, updateResult) {
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
  db.query(sql, function (err, result) {
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
  db.query(insertCustomerSql, values, function (err, result) {
    if (err) {
      return res.json({
        error: "Error inserting project"
      });
    }

    var newCustomerId = result.insertId;
    var updateCustomerIdSql = "update project set project_id=? where id=?";
    var updateValues = [newCustomerId, newCustomerId];
    db.query(updateCustomerIdSql, updateValues, function (updateErr, updateResult) {
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
  db.query(sql, function (err, result) {
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
  db.query(insertCustomerSql, values, function (err, result) {
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
  db.query(sql, function (err, result) {
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
  db.query(insertCustomerSql, values, function (err, result) {
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
  db.query(sql, function (err, result) {
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
  db.query(sql, function (err, result) {
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
      db.query(insertUserSql, values, function (err, result) {
        if (err) {
          return res.json({
            error: "Error inserting user"
          });
        }

        var newUserId = result.insertId;
        var updateUserIdSql = "update user set user_id=? where id=?";
        var updateValues = [newUserId, newUserId];
        db.query(updateUserIdSql, updateValues, function (updateErr, updateResult) {
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
  db.query(sql, function (err, result) {
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
  db.query(query, [customerId], function (err, results) {
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
  db.query(query, function (err, results) {
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
app.post('/home/tag', function (req, res) {
  var sql = "select * from tags";
  db.query(sql, function (err, result) {
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
  db.query(sql, [userId, selectedFromDate, selectedStartTime, duration, selectedEndTime, newSelectedCustomerNameValue, stringifiedProjects, selectedActivityValue, description, selectedTagValue], function (err, result) {
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
  db.query(sql, [name, email, title, language, timezone, staff_number, supervisor, team, role, id], function (err, result) {
    if (err) {
      res.status(500).json({
        error: 'Error updating user details'
      });
      return;
    } else {
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

var fetchUserTimesheetRecords = function fetchUserTimesheetRecords(userId, selectedYear, selectedMonth, selectedWeek) {
  return new Promise(function (resolve, reject) {
    // Construct the start and end date for the selected month
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0); // Format the dates to match your database date format

    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    var formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
    var formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    var weekCondition = ' AND fromdate >= ? AND fromdate <= ?';
    var fullQuery = selectedWeek ? query + weekCondition : query;
    var queryParameters = selectedWeek ? [userId, formattedStartDate, formattedEndDate, formattedStartOfWeek, formattedEndOfWeek] : [userId, formattedStartDate, formattedEndDate]; //db.query(query, [userId,formattedStartDate,formattedEndDate], (error, result) => 

    db.query(fullQuery, queryParameters, function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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
  var userId, selectedYear, selectedMonth, selectedWeek, records, excelData;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.params.userId;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          selectedWeek = req.query.week;
          _context2.next = 7;
          return regeneratorRuntime.awrap(fetchUserTimesheetRecords(userId, selectedYear, selectedMonth, selectedWeek));

        case 7:
          records = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 10:
          excelData = _context2.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
});

var fetchUserMonthlyTimesheetRecordsForOneUser = function fetchUserMonthlyTimesheetRecordsForOneUser(userId, selectedYear, selectedMonth) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    db.query(query, [userId, formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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

app.get('/home/user/:userId/one_user_monthly_records', function _callee2(req, res) {
  var userId, selectedYear, selectedMonth, records, excelData;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.params.userId;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          _context3.next = 6;
          return regeneratorRuntime.awrap(fetchUserMonthlyTimesheetRecordsForOneUser(userId, selectedYear, selectedMonth));

        case 6:
          records = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 9:
          excelData = _context3.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
});

var fetchUserYearlyTimesheetRecords = function fetchUserYearlyTimesheetRecords(userId, selectedYear) {
  return new Promise(function (resolve, reject) {
    // Construct the start and end date for the selected year
    var startDate = new Date(selectedYear, 0, 1); // January 1st of the selected year

    var endDate = new Date(selectedYear, 11, 31); // December 31st of the selected year
    // Format the dates to match your database date format

    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    db.query(query, [userId, formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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

app.get('/home/user/:userId/yearly_report_of_one_user', function _callee3(req, res) {
  var userId, selectedYear, records, excelData;
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.params.userId;
          selectedYear = req.query.year;
          _context4.next = 5;
          return regeneratorRuntime.awrap(fetchUserYearlyTimesheetRecords(userId, selectedYear));

        case 5:
          records = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 8:
          excelData = _context4.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
});

var fetchAllUserWeeklyTimesheetRecords = function fetchAllUserWeeklyTimesheetRecords(selectedYear, selectedMonth, selectedWeek) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    var formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
    var formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE fromdate >= ? AND fromdate <= ?';
    var weekCondition = ' AND fromdate >= ? AND fromdate <= ?';
    var fullQuery = selectedWeek ? query + weekCondition : query;
    var queryParameters = selectedWeek ? [formattedStartDate, formattedEndDate, formattedStartOfWeek, formattedEndOfWeek] : [formattedStartDate, formattedEndDate];
    db.query(fullQuery, queryParameters, function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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

app.get('/home/user/all_user_weekly_records', function _callee4(req, res) {
  var selectedYear, selectedMonth, selectedWeek, records, excelData;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          selectedWeek = req.query.week;
          _context5.next = 6;
          return regeneratorRuntime.awrap(fetchAllUserWeeklyTimesheetRecords(selectedYear, selectedMonth, selectedWeek));

        case 6:
          records = _context5.sent;
          _context5.next = 9;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 9:
          excelData = _context5.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
});

var fetchAllUserTimesheetRecords = function fetchAllUserTimesheetRecords(selectedYear, selectedMonth) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE fromdate >= ? AND fromdate <= ?';
    db.query(query, [formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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

app.get('/home/user/all_user_monthly_records', function _callee5(req, res) {
  var selectedYear, selectedMonth, records, excelData;
  return regeneratorRuntime.async(function _callee5$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          _context6.next = 5;
          return regeneratorRuntime.awrap(fetchAllUserTimesheetRecords(selectedYear, selectedMonth));

        case 5:
          records = _context6.sent;
          _context6.next = 8;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 8:
          excelData = _context6.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context6.next = 17;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
});

var fetchAllUserTimesheetRecordsForYear = function fetchAllUserTimesheetRecordsForYear(selectedYear) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, 0, 1);
    var endDate = new Date(selectedYear, 11, 31);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE fromdate >= ? AND fromdate <= ?';
    db.query(query, [formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
        //console.error('Error fetching user timesheet records:', error);
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

app.get('/home/user/all_user_yearly_records', function _callee6(req, res) {
  var selectedYear, records, excelData;
  return regeneratorRuntime.async(function _callee6$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          selectedYear = req.query.year;
          _context7.next = 4;
          return regeneratorRuntime.awrap(fetchAllUserTimesheetRecordsForYear(selectedYear));

        case 4:
          records = _context7.sent;
          _context7.next = 7;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 7:
          excelData = _context7.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context7.next = 16;
          break;

        case 13:
          _context7.prev = 13;
          _context7.t0 = _context7["catch"](0);
          //console.error('Error fetching or processing user records:', error);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
app.post('/user_home/customer', function (req, res) {
  var sql = "select * from customer";
  db.query(sql, function (err, result) {
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
  db.query(query, [customerId], function (err, results) {
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
app.post('/user_home/projectlist', function (req, res) {
  var customerId = req.body.customerId;
  var query = 'SELECT name FROM project WHERE customer_id = ?';
  db.query(query, [customerId], function (err, results) {
    if (err) {
      console.error('Error fetching projects:', err);
      res.status(500).json({
        error: 'Error fetching projects'
      });
      return;
    } else {
      var projectNames = results.map(function (project) {
        return project.name;
      });
      res.json({
        projects: projectNames
      });
    }
  });
});
app.post('/user_home/activity', function (req, res) {
  var query = "select * from activity";
  db.query(query, function (err, results) {
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
  db.query(sql, function (err, result) {
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
app.get('/user_home/userid', function (req, res) {
  if (req.session && req.session.user) {
    var userId = req.session.user[0].user_id;
    req.session.userId = userId;
    res.json({
      loggedIn: true,
      userId: userId
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});
app.post('/user_home/save_tag', function (req, res) {
  var name = req.body.name;
  var sql = 'insert into tags(name)values(?)';
  db.query(sql, [name], function (err, result) {
    if (err) {
      res.status(500).json({
        error: 'Error Saving Tag'
      });
    } else {
      res.status(200).json({
        message: 'Tag Saved Successfully.'
      });
    }
  });
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
  db.query(sql, [userId, selectedFromDate, selectedStartTime, duration, selectedEndTime, newSelectedCustomerNameValue, stringifiedProjects, selectedActivityValue, description, selectedTagValue], function (err, result) {
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
app.get('/home/userstatus', function (req, res) {
  if (req.session && req.session.user) {
    res.send({
      loggedIn: true
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});

var getRandomColor = function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

app.get('/home/timesheet_data', function (req, res) {
  var user_id = 1;
  var query = "SELECT fromdate,duration FROM timesheet WHERE user_id = ?";
  db.query(query, [user_id], function (err, results) {
    if (err) {
      res.status(500).json({
        error: 'Internal Server Error'
      });
    } else {
      var durationData = results.map(function (entry) {
        return {
          fromdate: new Date(entry.fromdate).toLocaleDateString(),
          duration: entry.duration,
          color: getRandomColor()
        };
      });
      res.json(durationData);
    }
  });
});
app.get('/login/user_home/userid', function (req, res) {
  if (req.session && req.session.user) {
    var userId = req.session.user[0].user_id;
    res.json({
      loggedIn: true,
      userId: userId
    });
  } else {
    res.send({
      loggedIn: false
    });
  }
});
app.get('/user_home/timesheet_data', function (req, res) {
  var userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      error: 'Unauthorized'
    });
    return;
  } else {
    var query = "SELECT fromdate,duration FROM timesheet WHERE user_id = ?";
    db.query(query, [userId], function (err, results) {
      if (err) {
        res.status(500).json({
          error: 'Internal Server Error'
        });
      } else {
        var durationData = results.map(function (entry) {
          return {
            fromdate: new Date(entry.fromdate).toLocaleDateString(),
            duration: entry.duration,
            color: getRandomColor()
          };
        });
        res.json(durationData);
      }
    });
  }
});

var fetchOneLoggedInUserTimesheetRecordsForYearMonthWeek = function fetchOneLoggedInUserTimesheetRecordsForYearMonthWeek(userId, selectedYear, selectedMonth, selectedWeek) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var startOfWeek = new Date(startDate);
    startOfWeek.setDate(startOfWeek.getDate() + (selectedWeek - 1) * 7);
    var endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    var formattedStartOfWeek = startOfWeek.toISOString().split('T')[0];
    var formattedEndOfWeek = endOfWeek.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    var weekCondition = ' AND fromdate >= ? AND fromdate <= ?';
    var fullQuery = selectedWeek ? query + weekCondition : query;
    var queryParameters = selectedWeek ? [userId, formattedStartDate, formattedEndDate, formattedStartOfWeek, formattedEndOfWeek] : [userId, formattedStartDate, formattedEndDate];
    db.query(fullQuery, queryParameters, function (error, result) {
      if (error) {
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

app.get('/user_home/user/:userId/records', function _callee7(req, res) {
  var userId, _userId, selectedYear, selectedMonth, selectedWeek, records, excelData;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userId = req.session.userId;

          if (userId) {
            _context8.next = 6;
            break;
          }

          res.status(401).json({
            error: 'Unauthorized'
          });
          return _context8.abrupt("return");

        case 6:
          _context8.prev = 6;
          _userId = req.session.userId;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          selectedWeek = req.query.week;
          _context8.next = 13;
          return regeneratorRuntime.awrap(fetchOneLoggedInUserTimesheetRecordsForYearMonthWeek(_userId, selectedYear, selectedMonth, selectedWeek));

        case 13:
          records = _context8.sent;
          _context8.next = 16;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 16:
          excelData = _context8.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context8.next = 25;
          break;

        case 22:
          _context8.prev = 22;
          _context8.t0 = _context8["catch"](6);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 25:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[6, 22]]);
});

var fetchUserMonthlyTimesheetRecordsForLoggedInOneUser = function fetchUserMonthlyTimesheetRecordsForLoggedInOneUser(userId, selectedYear, selectedMonth) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, selectedMonth - 1, 1);
    var endDate = new Date(selectedYear, selectedMonth, 0);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    db.query(query, [userId, formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
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

app.get('/user_home/user/:userId/one_user_monthly_records', function _callee8(req, res) {
  var userId, _userId2, selectedYear, selectedMonth, records, excelData;

  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          userId = req.session.userId;

          if (userId) {
            _context9.next = 6;
            break;
          }

          res.status(401).json({
            error: 'Unauthorized'
          });
          return _context9.abrupt("return");

        case 6:
          _context9.prev = 6;
          _userId2 = req.session.userId;
          selectedYear = req.query.year;
          selectedMonth = req.query.month;
          _context9.next = 12;
          return regeneratorRuntime.awrap(fetchUserMonthlyTimesheetRecordsForLoggedInOneUser(_userId2, selectedYear, selectedMonth));

        case 12:
          records = _context9.sent;
          _context9.next = 15;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 15:
          excelData = _context9.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context9.next = 24;
          break;

        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](6);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 24:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[6, 21]]);
});

var fetchLoggedInUserYearlyTimesheetRecords = function fetchLoggedInUserYearlyTimesheetRecords(userId, selectedYear) {
  return new Promise(function (resolve, reject) {
    var startDate = new Date(selectedYear, 0, 1);
    var endDate = new Date(selectedYear, 11, 31);
    var formattedStartDate = startDate.toISOString().split('T')[0];
    var formattedEndDate = endDate.toISOString().split('T')[0];
    var query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    db.query(query, [userId, formattedStartDate, formattedEndDate], function (error, result) {
      if (error) {
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

app.get('/user_home/user/:userId/yearly_report_of_one_user', function _callee9(req, res) {
  var userId, _userId3, selectedYear, records, excelData;

  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          userId = req.session.userId;

          if (userId) {
            _context10.next = 6;
            break;
          }

          res.status(401).json({
            error: 'Unauthorized'
          });
          return _context10.abrupt("return");

        case 6:
          _context10.prev = 6;
          _userId3 = req.session.userId;
          selectedYear = req.query.year;
          _context10.next = 11;
          return regeneratorRuntime.awrap(fetchLoggedInUserYearlyTimesheetRecords(_userId3, selectedYear));

        case 11:
          records = _context10.sent;
          _context10.next = 14;
          return regeneratorRuntime.awrap(createExcelFile(records));

        case 14:
          excelData = _context10.sent;
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
          res.end(excelData);
          _context10.next = 23;
          break;

        case 20:
          _context10.prev = 20;
          _context10.t0 = _context10["catch"](6);
          res.status(500).json({
            error: 'Error fetching or processing user records'
          });

        case 23:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[6, 20]]);
});
app.get('/user_home/all_timesheet_data/:userId', function (req, res) {
  var userId = req.session.userId;

  if (!userId) {
    res.status(401).json({
      error: 'Unauthorized'
    });
    return;
  } else {
    var query = "SELECT * FROM timesheet WHERE user_id = ?";
    db.query(query, [userId], function (err, results) {
      if (err) {
        res.status(500).json({
          error: 'Internal Server Error'
        });
      } else {
        res.json(results);
      }
    });
  }
});
app.post('/user_home/update_timesheet/:userId/:recordId', function (req, res) {
  try {
    var userId = req.params.userId;
    var recordId = req.params.recordId;
    var _req$body5 = req.body,
        fromdate = _req$body5.fromdate,
        fromtime = _req$body5.fromtime,
        endtime = _req$body5.endtime,
        duration = _req$body5.duration,
        customer = _req$body5.customer,
        projects = _req$body5.projects,
        activity = _req$body5.activity,
        description = _req$body5.description,
        tag = _req$body5.tag;
    var updateUserTimesheetSqlData = "UPDATE timesheet SET fromdate = ?, fromtime = ?, endtime = ?, duration = ?, customer = ?, projects = ?, activity = ?, description = ?, tag = ? WHERE user_id = ? AND id = ?";
    var updateTimesheetValues = [fromdate, fromtime, endtime, duration, customer, projects, activity, description, tag, userId, recordId];
    db.query(updateUserTimesheetSqlData, updateTimesheetValues, function (updateErr, updateResult) {
      if (updateErr) {
        return res.status(500).json({
          success: false,
          error: "Error updating timesheet"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Timesheet updated successfully.'
        }); //io.emit('timesheetUpdated', { userId: req.params.userId, recordId: req.params.recordId });
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating timesheet.'
    });
  }
});
app.get('/user_home/user/:userId/project_records', function _callee10(req, res) {
  var userId, query;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          try {
            userId = req.params.userId;
            query = "SELECT projects FROM timesheet WHERE user_id = ?";
            db.query(query, [userId], function (err, results) {
              if (err) {
                res.status(500).json({
                  error: 'Internal Server Error'
                });
              } else {
                res.json(results);
              }
            });
          } catch (error) {
            res.status(500).json({
              error: 'Error fetching or processing user project records'
            });
          }

        case 1:
        case "end":
          return _context11.stop();
      }
    }
  });
});
app.get('/user_home/user/:userId/activity_records', function _callee11(req, res) {
  var userId, query;
  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          try {
            userId = req.params.userId;
            query = "SELECT activity FROM timesheet WHERE user_id = ?";
            db.query(query, [userId], function (err, results) {
              if (err) {
                res.status(500).json({
                  error: 'Internal Server Error'
                });
              } else {
                res.json(results);
              }
            });
          } catch (error) {
            res.status(500).json({
              error: 'Error fetching or processing user activity records'
            });
          }

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
});
app.listen(8081, function () {
  console.log("server is running on port http://localhost:8081");
});