import express from "express";
import mysql from "mysql";
import cors from "cors";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import memorystore  from "memorystore";
import passport from "passport";
//const express = require("express");
//const MemoryStore = require('memorystore')(session);

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
  //saveUninitialized: false,
  //cookie: { expires: 60 * 60 * 24 }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = mysql.createConnection({host:"localhost",user:"root",password:"",database:"ekatimesheet"});

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
      //console.error('Database query error:', err);
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
          //console.log(req.session.user);
          //console.log('Login successful');
          const userEmail = results[0].email;
          //res.send(results);
          return res.status(200).json({ message: 'Login successful', user: { email: userEmail } });
        }
        else
        {
          //console.log('Passwords do not match.');
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

/* app.use(passport.initialize());
app.use(passport.session());

app.get('/home/userid', (req, res) => 
{
  if (req.isAuthenticated()) 
  {
    const userId = req.user.id;
    res.json({ userId });
  } 
  else 
  {
    res.status(401).json({ message: 'Unauthorized' });
  }
}); */

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

app.get('/home/customer/customer_id', (req, res) => 
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
  /* const{name}=req.body;
  const sql='insert into customer(name)values(?)';
  db.query(sql,[name],(err,result)=> 
  {
    if(err) 
    {
      console.log(err);
      res.status(500).json({error:'Error Saving Data'});
    } 
    else 
    {
      res.status(200).json({message:'Customer Saved Successfully.'});
    }
  }); */
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
        //console.error('Error fetching projects from database:',err);
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
        //console.error('Error fetching activities from database:',err);
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
        //console.error('Error fetching projects from database:',err);
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
        //console.error('Error fetching activities from database:',err);
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

/* app.post('/login', passport.authenticate('local', 
{
  successRedirect: '/user_home',
  failureRedirect: '/', 
  failureFlash: true
})); */

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
  /* if (req.isAuthenticated()) 
  {
    const userId = req.user.id;
    res.json({ userId });
  } 
  else 
  {
    res.status(401).json({ message: 'Unauthorized' });
  } */
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

app.listen(8081,()=>
{
  console.log("server is running");
});