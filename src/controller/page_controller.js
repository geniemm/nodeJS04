const service = require("../service/page_service");
const views = {
    index : (req, res)=>{
        res.render("index");
    },
    list : async (req, res)=>{
        console.log("start : ", req.query.start); // start에 값이 들어오면 그 값의 페이지를 보여주겠다(페이지번호)
        const totalContent = await service.pageRead.totalContent();
        const data = 
        await service.pageRead.list(req.query.start, totalContent);
        res.render( "list", {list : data.list, totalContent, 
                            start : data.start, page:data.page} );
    },
    writeForm :(req,res)=>{
        res.render("write_form")
    },
    content : async (req,res)=>{
        const data = await service.pageRead.content(req.params.num);
        res.render("content",{data});
    }
}
const process = {
        write : async (req, res)=>{
        const msg = await service.pageInsert.write( req.body );
        res.redirect("/page/list");
        }
    }
    
module.exports = { views, process };