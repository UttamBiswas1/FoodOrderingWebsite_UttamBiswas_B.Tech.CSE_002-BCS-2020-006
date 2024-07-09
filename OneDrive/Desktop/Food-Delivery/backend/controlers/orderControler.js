import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);

//placing order form forntend 

const placeOrder=async(req,res)=>{
  const forntend_url="http://localhost:5173";
  try {
    const newOrder=new orderModel({
      userId:req.body.userId,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address
    })
    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});//clening cart data
    
    const line_items=req.body.items.map((item)=>({
      price_data:{
        currency:"inr",
        product_data:{
          name:item.name
        },
        unit_amount:item.price*100
      },
      quantity:item.quantity

    }))
    line_items.push({
      price_data:{
        currency:"inr",
        product_data:{
          name:"Delivery Charges"
        },
        unit_amount:2*100
      },
      quantity:1
    })

    const session=await stripe.checkout.sessions.create({
      line_items:line_items,
      mode:'payment',
      success_url:`${forntend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:`${forntend_url}/verify?success=false&orderId=${newOrder._id}`
    })
    res.json({success:true,session_url:session.url})
  } catch (error) {
    console.log(error);
    res.json({success:false,messsge:"There is an Error"});

  }
}

//varification for payment is true or false
const verifyOrder=async(req,res)=>{
const {orderId,success}=req.body;
try {
  if (success=="true") {
    await orderModel.findByIdAndUpdate(orderId,{payment:true});
    res.json({success:true,messsge:"Paid"})
  }
  else{
  await orderModel.findByIdAndDelete(orderId);
  res.json({success:false,messsge:"Not Paid"})
  }
  
} catch (error) {
  console.log("Errorrrr");
  res.json({success:false,messsge:"There is an Error"});
}
}

//User Orders for fronted

const userOrders=async(req,res)=>{
  try {
    const orders=await orderModel.find({userId:req.body.userId});
    res.json({success:true,data:orders});
  } catch (error) {
    console.log("Error");
    res.json({success:false,messsge:"There is an error"});
  }
}

export {placeOrder,verifyOrder,userOrders};