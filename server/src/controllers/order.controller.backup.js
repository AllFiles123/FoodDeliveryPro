import {
  createOrder,
  getOrdersByUser,
} from "../models/order.model.js";



export async function placeOrder(req,res){


  try{


    const {

      items,

      totalAmount,

      paymentMethod,

      address,

      deliveryCharge

    } = req.body;




    if(
      !items ||
      !totalAmount ||
      !paymentMethod ||
      !address
    ){

      return res.status(400).json({

        success:false,

        message:"All order fields are required"

      });

    }




    createOrder({

      userId:req.user.id,

      items,

      totalAmount,

      paymentMethod,

      address,

      deliveryCharge

    });





    return res.status(201).json({

      success:true,

      message:"Order placed successfully"

    });



  }catch(error){


    console.error(error);


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


    console.error(error);


    return res.status(500).json({

      success:false,

      message:"Failed to load orders"

    });


  }


}
