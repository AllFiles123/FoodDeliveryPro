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

      deliveryCharge,


      customerName,

      customerPhone,


      deliveryType,

      zone,

      division,

      district,

      upazila,

      area,

      fullAddress,


      subtotal,

      vat,

      discount,


      paymentStatus,

      orderStatus


    } = req.body;





    if(

      !items ||

      !Array.isArray(items) ||

      items.length === 0

    ){

      return res.status(400).json({

        success:false,

        message:"Cart is empty"

      });

    }





    if(
      !customerName ||
      !customerPhone
    ){

      return res.status(400).json({

        success:false,

        message:"Customer information required"

      });

    }





    if(
      !paymentMethod
    ){

      return res.status(400).json({

        success:false,

        message:"Payment method required"

      });

    }





    if(
      !address &&
      !fullAddress
    ){

      return res.status(400).json({

        success:false,

        message:"Delivery address required"

      });

    }





    createOrder({

      userId:req.user.id,


      items,


      totalAmount,


      paymentMethod,


      address:
      address || fullAddress,


      deliveryCharge,


      customerName,


      customerPhone,


      deliveryType,


      zone,


      division,


      district,


      upazila,


      area,


      fullAddress,


      subtotal,


      vat,


      discount,


      paymentStatus,


      orderStatus


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
