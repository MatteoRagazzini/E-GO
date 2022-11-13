exports.show_homepage = (req,res)=>{
    res.status(200).sendFile(appRoot + '/www/index.html');
};