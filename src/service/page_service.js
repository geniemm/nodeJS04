const dao = require("../database/pageDAO");
const pageOperation = (start, totalCounter) =>{
    let page ={};
    const pageNum = 3; // 페이지당 보여줄 개수
    const num = (totalCounter % pageNum === 0)?0:1;

    page.totPage = parseInt(totalCounter/pageNum) +num;

    page.startNum = (start-1) * pageNum + 1;
    page.endNum = start * pageNum;
    return page;
}
//
const pageRead = {
    list : async ( start , totalC )=>{
        start = (start && start >= 1 )?Number(start):1;
        const page = pageOperation(start,totalC);
        /*
        if(start && start >= 1 ){
            start = Number(start);
        }else{
            start =1;
        }
        */
        const list = await dao.daoRead.list(page.startNum, page.endNum);
        console.log("service : ", list);
        
        data ={};
        data.page= page; //우리가 갖고있는 totalPage 총 페이지 수? and i ~~~
        data.start = start
        data.list = list.rows;
        console.log("data: ",data);

        return data;
    },
    content : async (num) =>{ 
        pageUpdate.upHit(num); // 숫자올라가는 기능
        // 위에 upHit가 동작중이던 말던 끝나던 말던
        // 아래 dao가 실행된다 > 비동기방식이기 때문이당
        // 그게 싫으면 await pageUpdate.upHit(num); 으로 바꿔줘야돼(동기)
            const data = await dao.daoRead.content(num);
            return data.rows[0];
        },
    totalContent : async () =>{
            const totalContent = await dao.daoRead.totalContent();
            console.log( totalContent );
             return totalContent.rows[0]['COUNT(*)'];
            }
        
}
const pageUpdate = {
    upHit :(num)=>{
        dao.daoUpdate.upHit(num);
    }
}
const pageInsert = {
    write : async ( body ) =>{
        const result = await dao.daoInsert.write( body );
    }
}
    
module.exports = { pageRead ,pageInsert }