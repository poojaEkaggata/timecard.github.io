import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import memorystore  from "memorystore";
import passport from "passport";
import exceljs from 'exceljs';

const app = express();

const MemoryStore = memorystore(session);

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["POST","GET"],
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(session({
  key: "userId",
  secret: "subscribe",
  resave: true,
  saveUninitialized: true,
  store: new MemoryStore({checkPeriod:86400000}),
  cookie: 
  {
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    httpOnly: true,
  }
  //cookie: { expires: 60 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = mysql.createConnection({host:"localhost",user:"root",password:"",database:"ekatimesheet"});

app.get('/login', (req, res) => 
{
  if(req.session.user)
  {
    res.send({loggedIn: true,user: req.session.user});
  }
  else
  {
    res.send({loggedIn: false});
  }
});

app.post('/login', (req, res) => 
{
  const getUserSql="select * from user where email = ?";
  db.query(getUserSql,[req.body.email],(err, results)=> 
  {
    if(err) 
    {
      return res.status(500).json({ message: 'Error retrieving user' });
    }
    if(results.length === 0) 
    {
      return res.status(401).json({ message: 'User not found' });
    }
    if(results.length > 0) 
    {
      const inputedPassword = req.body.password;
      const storedHashedPassword = results[0].password;
      bcrypt.compare(inputedPassword,storedHashedPassword,(error,response)=>
      {
        if(response)
        {
          req.session.user = results;
          const userEmail = results[0].email;
          return res.status(200).json({ message: 'Login successful', user: { email: userEmail } });
        }
        else
        {
          return res.status(401).json({ message: 'Incorrect password' });
        }
      });
    }
    else
    {
      return res.status(401).json({ message: 'User does not exist!' });
    }
  });
});

app.get('/home/userinfo', (req, res) => 
{
  if(req.session && req.session.user) 
  {
    console.log("Log in true");
    console.log(req.session.user);
    res.send({ loggedIn: true, user: req.session.user });
  } 
  else 
  {
    console.log("Log in false");
    console.log(req.session.user);
    res.send({ loggedIn: false });
  }
});

app.post('/home/user',(req,res)=> 
{
    const sql="select name from user";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
            return res.json({Error:"Get Supervisor Error!"});
        }
        else
        {
            return res.json({Status:"Succcess in getting supervisor.",Result:result});
        }
    })
});

app.post('/home/team',(req,res)=> 
{
    const sql="select name from customer";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
            return res.json({Error:"Get Team Error!"});
        }
        else
        {
            return res.json({Status:"Succcess in getting team.",Result:result});
        }
    })
});

app.post('/home/customer',(req,res)=> 
{
  const sql="select * from customer";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get Customer Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting customer.",Result:result});
    }
  })
});

app.post('/home/customer/add_new_customer',(req,res)=>
{
  const{name}=req.body;
  const insertCustomerSql="insert into customer (name) values (?)";
  const values=[name];
  db.query(insertCustomerSql,values,(err,result)=> 
  {
    if(err) 
    {
      return res.json({error:"Error inserting customer"});
    }
    const newCustomerId=result.insertId;
    const updateCustomerIdSql="update customer set customer_id=? where id=?";
    const updateValues=[newCustomerId,newCustomerId];
    db.query(updateCustomerIdSql,updateValues,(updateErr,updateResult)=> 
    {
      if(updateErr) 
      {
        return res.json({error:"Error updating customer_id!"});
      }
      else
      {
        return res.json({message:"Customer created successfully."});
      }
    });
  });
});

app.post('/home/get_project',(req,res)=> 
{
  const sql="select * from project";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get Project Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting project.",Result:result});
    }
  })
});

app.post('/home/project/add_new_project',(req,res)=>
{
  const{name}=req.body;
  const insertCustomerSql="insert into project (name) values (?)";
  const values=[name];
  db.query(insertCustomerSql,values,(err,result)=> 
  {
    if(err) 
    {
      return res.json({error:"Error inserting project"});
    }
    const newCustomerId=result.insertId;
    const updateCustomerIdSql="update project set project_id=? where id=?";
    const updateValues=[newCustomerId,newCustomerId];
    db.query(updateCustomerIdSql,updateValues,(updateErr,updateResult)=> 
    {
      if(updateErr) 
      {
        return res.json({error:"Error updating project_id!"});
      }
      else
      {
        return res.json({message:"Project created successfully."});
      }
    });
  });
});

app.post('/home/get_activity',(req,res)=> 
{
  const sql="select * from activity";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get Activity Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting activity.",Result:result});
    }
  })
});

app.post('/home/activity/add_new_activity',(req,res)=>
{
  const{name}=req.body;
  const insertCustomerSql="insert into activity (name) values (?)";
  const values=[name];
  db.query(insertCustomerSql,values,(err,result)=> 
  {
    if(err) 
    {
      return res.json({error:"Error inserting activity"});
    }
    else
    {
      return res.json({message:"Activity created successfully."});
    }
  });
});

app.post('/home/get_tag',(req,res)=> 
{
  const sql="select * from tags";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get Tag Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting tag.",Result:result});
    }
  })
});

app.post('/home/tag/add_new_tag',(req,res)=>
{
  const{name}=req.body;
  const insertCustomerSql="insert into tags (name) values (?)";
  const values=[name];
  db.query(insertCustomerSql,values,(err,result)=> 
  {
    if(err) 
    {
      return res.json({error:"Error inserting tag"});
    }
    else
    {
      return res.json({message:"Tag created successfully."});
    }
  });
});

app.post('/home/get_all_users',(req,res)=> 
{
  const sql="select * from user";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get User Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting user.",Result:result});
    }
  })
});

app.post('/home/role',(req,res)=> 
{
    const sql="select name from role";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
            return res.json({Error:"Get Role Error!"});
        }
        else
        {
            return res.json({Status:"Succcess in getting role.",Result:result});
        }
    })
});

app.post('/home', (req, res) => 
{
  const salt = 10;
  const {name,email,password,title,language,timezone,staff_number,supervisor,team,role}=req.body;
  const insertUserSql="insert into user (name,email,password,title,language,timezone,staff_number,supervisor,team,role) values (?,?,?,?,?,?,?,?,?,?)";
  bcrypt.hash(password.toString(),salt,(err,hashedPassword)=>
  {
    if(err)
    {
      return res.json({Error:"Error for hashing password"})
    }
    else
    {
      const values=[name,email,hashedPassword,title,language,timezone,staff_number,supervisor,team,role];
      db.query(insertUserSql,values,(err,result)=> 
      {
        if(err) 
        {
          return res.json({error:"Error inserting user"});
        }
        const newUserId=result.insertId;
        const updateUserIdSql="update user set user_id=? where id=?";
        const updateValues=[newUserId,newUserId];
        db.query(updateUserIdSql,updateValues,(updateErr,updateResult)=> 
        {
          if(updateErr) 
          {
            return res.json({error:"Error updating user_id!"});
          }
          else
          {
            return res.json({message:"User created successfully."});
          }
        });
      });
    }
  });
});

app.post('/home/customer',(req,res)=> 
{
    const sql="select * from customer";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
            return res.json({Error:"Get Customer Error!"});
        }
        else
        {
            return res.json({Status:"Succcess in getting customer.",Result:result});
        }
    })
});

app.post('/home/project',(req,res)=> 
{
    const {customerId}=req.body;
    const query=`select * from project where customer_id = ?`;
    db.query(query,[customerId],(err,results)=> 
    {
      if(err) 
      {
        res.status(500).json({error:'Error fetching projects'});
        return;
      }
      if(results.length>0) 
      {
        res.json({projects:results});
      } 
      else 
      {
        res.json({projects:[]});
      }
    });
});

app.post('/home/activity',(req,res)=> 
{
    const query="select * from activity";
    db.query(query,(err,results)=> 
    {
      if(err) 
      {
        res.status(500).json({error:'Error fetching activities'});
        return;
      }
      if(results.length>0) 
      {
        res.json({Result:results});
      } 
      else 
      {
        res.json({Result:[]});
      }
    });
});

app.post('/home/tag',(req,res)=> 
{
    const sql="select * from tags";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
          return res.json({Error:"Get Tag Error!"});
        }
        else
        {
          return res.json({Status:"Succcess in getting Tag.",Result:result});
        }
    })
});

app.post('/home/timesheet',(req,res)=> 
{
    const{userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue}=req.body;
    const sql='insert into timesheet(user_id,fromdate,fromtime,duration,endtime,customer,projects,activity,description,tag)values(?,?,?,?,?,?,?,?,?,?)';
    db.query(sql,[userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue],(err,result)=> 
    {
      if(err) 
      {
        console.log(err);
        res.status(500).json({error:'Error Saving Data'});
      } 
      else 
      {
        res.status(200).json({message:'Timesheet Saved Successfully.'});
      }
    });
});

app.post('/home/update_user', (req, res) => 
{
  const { id, name, email, title, language, timezone, staff_number, supervisor, team, role } = req.body;
  const sql = 'UPDATE user SET name = ?, email = ?, title = ?, language = ?, timezone = ?,  staff_number = ?, supervisor = ?, team = ?, role = ? WHERE id = ?';
  db.query(sql, [name, email, title, language, timezone, staff_number, supervisor, team, role, id], (err, result) => 
  {
    if (err)
    {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Error updating user details' });
      return;
    }
    else
    {
      console.log('User updated successfully');
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});

const createExcelFile = async (records) => 
{
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('User-Timesheet-Data-1');
  worksheet.addRow(['From Date','From Time','Duration','End Time','Customer','Projects','Activities','Description','Tag']);
  records.forEach((record) => 
  {
    worksheet.addRow([record.fromdate,record.fromtime,record.duration,record.endtime,record.customer,record.projects,record.activity,record.description,record.tag]);
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
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

const fetchUserTimesheetRecords = (userId, selectedYear, selectedMonth) => 
{
  return new Promise((resolve, reject) => 
  {
    // Construct the start and end date for the selected month
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 0);

    // Format the dates to match your database date format
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    const query = 'select * from timesheet WHERE user_id = ? AND fromdate >= ? AND fromdate <= ?';
    db.query(query, [userId,formattedStartDate,formattedEndDate], (error, result) => 
    {
      if (error) 
      {
        console.error('Error fetching user timesheet records:', error);
        reject(error);
      } 
      else 
      {
        const records = result.map((item) => ({
          fromdate: item.fromdate,
          fromtime: item.fromtime,
          duration: item.duration,
          endtime: item.endtime,
          customer: item.customer,
          projects: item.projects,
          activity: item.activity,
          description: item.description,
          tag: item.tag
        }));
        resolve(records);
      }
    });
  });
};

app.get('/home/user/:userId/records', async (req, res) => 
{
  try 
  {
    const userId = req.params.userId;
    const selectedYear = req.query.year;
    const selectedMonth = req.query.month;
    const records = await fetchUserTimesheetRecords(userId,selectedYear,selectedMonth);
    const excelData = await createExcelFile(records);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=user_timesheet_records.xlsx');
    res.end(excelData);
  } 
  catch(error) 
  {
    console.error('Error fetching or processing user records:', error);
    res.status(500).json({ error: 'Error fetching or processing user records' });
  }
});

app.post('/user_home/customer',(req,res)=> 
{
  const sql="select * from customer";
  db.query(sql,(err,result)=>
  {
    if(err)
    {
      return res.json({Error:"Get Customer Error!"});
    }
    else
    {
      return res.json({Status:"Succcess in getting customer.",Result:result});
    }
  })
});

app.post('/user_home/project',(req,res)=> 
{
    const {customerId}=req.body;
    const query=`select * from project where customer_id = ?`;
    db.query(query,[customerId],(err,results)=> 
    {
      if(err) 
      {
        res.status(500).json({error:'Error fetching projects'});
        return;
      }
      if(results.length>0) 
      {
        res.json({projects:results});
      } 
      else 
      {
        res.json({projects:[]});
      }
    });
});

app.post('/user_home/activity',(req,res)=> 
{
    const query="select * from activity";
    db.query(query,(err,results)=> 
    {
      if(err) 
      {
        res.status(500).json({error:'Error fetching activities'});
        return;
      }
      if(results.length>0) 
      {
        res.json({Result:results});
      } 
      else 
      {
        res.json({Result:[]});
      }
    });
});

app.post('/user_home/tag',(req,res)=> 
{
    const sql="select * from tags";
    db.query(sql,(err,result)=>
    {
        if(err)
        {
          return res.json({Error:"Get Tag Error!"});
        }
        else
        {
          return res.json({Status:"Succcess in getting Tag.",Result:result});
        }
    })
});

app.get('/user_home/userinfo', (req, res) => 
{
  if (req.session && req.session.user) 
  {
    console.log("Log in true");
    console.log(req.session.user);
    res.send({ loggedIn: true, user: req.session.user });
  } 
  else 
  {
    console.log("Log in false");
    console.log(req.session.user);
    res.send({ loggedIn: false });
  }
});

app.get('/user_home/userid', (req, res) => 
{
  if (req.session && req.session.user) 
  {
    const userId = req.session.user[0].user_id;
    console.log("Log in true");
    console.log(req.session.user);
    console.log(userId);
    res.json({loggedIn: true,userId});
  } 
  else 
  {
    console.log("Log in false & User ID not found");
    res.send({ loggedIn: false });
  }
});

app.post('/user_home/timesheet',(req,res)=> 
{
    const{userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue}=req.body;
    const sql='insert into timesheet(user_id,fromdate,fromtime,duration,endtime,customer,projects,activity,description,tag)values(?,?,?,?,?,?,?,?,?,?)';
    db.query(sql,[userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue],(err,result)=> 
    {
      if(err) 
      {
        res.status(500).json({error:'Error Saving Data'});
      } 
      else 
      {
        res.status(200).json({message:'Timesheet Saved Successfully.'});
      }
    });
});

app.get('/home/userstatus', (req, res) => 
{
  if (req.session && req.session.user) 
  {
    //console.log("Log in true");
    res.send({ loggedIn: true });
  } 
  else 
  {
    //console.log("Log in false");
    res.send({ loggedIn: false });
  }
});

app.get('/home/timesheet_data', (req, res) => 
{
  const user_id = 1;
  const query = `SELECT duration FROM timesheet WHERE user_id = ?`;
  db.query(query, [user_id], (err, duration) => 
  {
    if (err) 
    {
      console.error('Error fetching timesheet data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } 
    else 
    {
      res.json(duration);
    }
  });
});

app.listen(8081,()=>
{
  console.log("server is running on port http://localhost:8081");
});
