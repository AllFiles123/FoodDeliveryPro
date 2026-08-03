import {
  createOrder,
  getOrdersByUser,
} from "../models/order.model.js";



export async function placeOrder(req,res){


  try{


    const {

      customerName,

      customerPhone,

      division,

      district,

      upazila,

      area,

      fullAddress,

      address,

      items,

      subtotal,

      vat,

      totalAmount,

      paymentMethod,

      paymentStatus,

      deliveryCharge,

      orderStatus


    } = req.body;



    const finalAddress =
      fullAddress || address;



    if(

      !items ||

      !totalAmount ||

      !paymentMethod ||

      !finalAddress

    ){

      return res.status(400).json({

        success:false,

        message:"Required order information missing"

      });

    }




    createOrder({

      userId:req.user.id,

      customerName,

      customerPhone,

      division,

      district,

      upazila,

      area,

      fullAddress:finalAddress,

      items,

      subtotal,

      vat,

      totalAmount,

      paymentMethod,

      paymentStatus,

      deliveryCharge,

      orderStatus

    });





    return res.status(201).json({

      success:true,

      message:"Order placed successfully"

    });



  }catch(error){


    console.error(
      "Order Error:",
      error
    );



    return res.status(500).json({

      success:false,

      message:"Order failed"

    });


  }


}





export async function myOrders(req,res){


  try{


    const orders =

      getOrdersByUser(

        req.user.id

      );



    return res.json({

      success:true,

      orders

    });



  }catch(error){


    console.error(

      "Orders Load Error:",

      error

    );



    return res.status(500).json({

      success:false,

      message:"Failed to load orders"

    });


  }


}
