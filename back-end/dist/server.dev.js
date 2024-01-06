"use strict";

var _express = _interopRequireDefault(require("express"));

var _mysql = _interopRequireDefault(require("mysql"));

var _cors = _interopRequireDefault(require("cors"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _memorystore = _interopRequireDefault(require("memorystore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//const express = require("express");
//const MemoryStore = require('memorystore')(session);
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
  } //saveUninitialized: false,
  //cookie: { expires: 60 * 60 * 24 }

}));

var db = _mysql["default"].createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ekatimesheet"
});
/* app.post('/login', (req, res) => 
{
  const sql = "select * from user where `email`=? and `password`=?";
  db.query(sql,[req.body.email,req.body.password],(err,data)=>
  {
    if(err)
    {
      return res.json("Error");
    }
    if(data.length>0)
    {
      if(err)
      {
        return res.json("Password Compare Error");
      }
      else
      {
        return res.json("Success");
      }
    }
    else
    {
      return res.json("Failed");
    }
  });
}); */


app.get('/employee_login', function (req, res) {
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
app.post('/employee_login', function (req, res) {
  var getUserSql = "select * from user where email = ?";
  db.query(getUserSql, [req.body.email], function (err, results) {
    if (err) {
      //console.error('Database query error:', err);
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
          req.session.user = results; //console.log(req.session.user);
          //console.log('Login successful');

          var userEmail = results[0].email; //res.send(results);

          return res.status(200).json({
            message: 'Login successful',
            user: {
              email: userEmail
            }
          });
        } else {
          //console.log('Passwords do not match.');
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
app.post('/employee_home/customer', function (req, res) {
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
app.post('/employee_home/project', function (req, res) {
  var customerId = req.body.customerId;
  var query = "select * from project where customer_id = ?";
  db.query(query, [customerId], function (err, results) {
    if (err) {
      //console.error('Error fetching projects from database:',err);
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
app.post('/employee_home/activity', function (req, res) {
  var query = "select * from activity";
  db.query(query, function (err, results) {
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
app.post('/employee_home/tag', function (req, res) {
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
app.post('/employee_home/timesheet', function (req, res) {
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
app.listen(8081, function () {
  console.log("server is running");
});