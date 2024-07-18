//const express= require("express");
import express from 'express'
import mongoose from 'mongoose';
import User from './UserDetails.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app=express();
app.use(express.json());

const mongoUrl="mongodb+srv://dbAdmin:dbAdmin321@cluster0.ls0b32b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET ="hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("Database Connected");
})
.catch((error)=>{
    console.error("Database connection error",error);
});
app.get("/",(req, res)=>{
    res.send({status:"Started"});
});


app.post('/register', async(req,res)=>{
    const {name, email, mobile, password}=req.body;

    try{
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).send({ data: "User already exists" });
        }
            const encryptedPassword = await bcrypt.hash(password, 10);



        await User.create({
            name:name,
            email: email,
            mobile: mobile,
            password: encryptedPassword,

    });

        res.send({status:"ok", data:"User Created"});
    }
    catch (error){
        console.error("Error during registration",error);
        res.status(500).send({ status: "error", data: error.message });
    }
});

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.send({ data: "User doesn't exist" });
        }

        if (await bcrypt.compare(password, existingUser.password)) {
            const token = jwt.sign({ email: existingUser.email }, JWT_SECRET);

            res.send({
                status: "ok",
                data: token,
                userType: existingUser.userType, // Ensure this field exists in your schema
            });
        } else {
            res.status(401).send({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).send({ status: "error", data: error.message });
    }
});
  





const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Node.js server started on port ${PORT}.`);
});