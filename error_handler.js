const invalidPathError = (req, res, next) => {
    res.status(404).send({message: "Path not found"})
}

const psqlError = (err, req, res, next)=>{
    switch (err.code) {
      case "23502": 
        res.status(400).send({message: 'Bad request'})
        break;
      case "23503": 
        res.status(400).send({message: 'Bad request'})
        break;
      case "22P02": 
        res.status(400).send({message: 'Bad request'})
        break;
    
      default:
        break;
    }
    next(err)
}

const generalError = (err, req, res, next)=>{
    if (err.status && err.message){
      res.status(err.status).send({message: err.message})
    }
    next(err)
}

module.exports = {invalidPathError, psqlError, generalError}