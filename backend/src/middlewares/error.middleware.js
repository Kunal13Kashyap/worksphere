export const errorHandler = (err,req,res,next)=>{

    // just for testing, have to remove it later
    console.error(err);
    /* ---------------------------------------- */
    
    const errMessage = err.isOperational ? err.message : "Internal Server Error";
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: errMessage
    });
};