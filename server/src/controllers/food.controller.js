import {
  createFood,
  getFoodsByRestaurantId,
  getFoodById,
} from "../models/food.model.js";



export async function createFoodController(req,res){

  try{


    const food =
      createFood(req.body);



    return res.status(201).json({

      success:true,

      message:"Food created successfully",

      food,

    });



  }catch(error){


    console.error(error);


    return res.status(500).json({

      success:false,

      message:"Failed to create food",

    });


  }

}




export async function getRestaurantFoods(req,res){

  try{


    const foods =
      getFoodsByRestaurantId(
        req.params.restaurantId
      );



    return res.json({

      success:true,

      foods,

    });



  }catch(error){


    console.error(error);


    return res.status(500).json({

      success:false,

      message:"Failed to get foods",

    });


  }

}





export async function getSingleFood(req,res){

  try{


    const food =
      getFoodById(
        req.params.id
      );



    if(!food){

      return res.status(404).json({

        success:false,

        message:"Food not found",

      });

    }



    return res.json({

      success:true,

      food,

    });



  }catch(error){


    console.error(error);


    return res.status(500).json({

      success:false,

      message:"Failed to get food",

    });


  }

}
