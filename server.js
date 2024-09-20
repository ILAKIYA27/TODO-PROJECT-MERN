//using express
const express=require('express');//exp function
const mongoose = require('mongoose');
const cors = require('cors');
//create an instance of express
//instance means this func returns an object
const app=express();
app.use(express.json())
app.use(cors())
//u r informing to postman that u r creating json code

//define a route
//helps to use api services through url like request and response
// app.get('/',(req,res)=>{
//     res.send("hello world!")
// })
//sample in-memory stoarge for todo items
//let todos=[]; //(all the examples are stored in one memory like array)

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('DB Connected!')
})
.catch((err) => {
    console.log(err)
    process.exit(1);
})
//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})
//creating model
const todoModel = mongoose.model('Todo',todoSchema);


//create a new todo item
app.post('/todos',async (req, res) => {
    const {title, description} = req.body;
//     const newTodo = {
//         id: todos.length + 1, //ensures id is unique
//         title,
//         description
//     };
//     todos.push(newTodo);
//     console.log(todos);
    try{
        const newTodo= new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
    

   
})
//Get all items
app.get('/todos',async (req,res) => {
    try{
       const todos = await todoModel.find();
       res.json(todos);
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    } 
  
})
//Update a todo item
app.put('/todos/:id',async (req, res) => {
    try{
        const {title, description} = req.body;
        const id=req.params.id;
        const UpdatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title , description},
            {new: true}
        )
        if(!UpdatedTodo){
            return res.status(404).json({message: "Todo not found"})
        }
        res.json(UpdatedTodo)
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
    
})
//Delete a todo item
app.delete('/todos/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message});
    }
    
});
//start the server
const port=8000;
app.listen(port,()=>{
console.log("server is listening " + port);
})