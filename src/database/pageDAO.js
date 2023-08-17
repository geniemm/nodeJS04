const oracledb = require("oracledb");
const dbConfig = require("../../config/db_config");
oracledb.outFormat = oracledb.OBJECT;
oracledb.autoCommit = true;

const daoRead = {
    list :  async (s, e) => {

        const sql = `select B.*from(select rownum rn , A.*from(
                     select * from paging order by num desc)A)B
                     where rn between ${s} and ${e}`;
        
    /*
    rownum: oracle에서 제공해주는 가상의 숫자를 부여하는 기능
    갯수그대로 넘버링해주는거라서 중간에 이빨빠진거없이 순차적으로 들어오기때문에 쓰기 좋다 ~~

    select A.*from(select * from paging order by num desc)A where num between 1 and 3;
    괄호안에 있는걸 A 라고 하겠다 그럼 A의 전체를 가져올껀데 1에서 3 사이에것만 가져와라~
    */
        const con = await oracledb.getConnection(dbConfig);
        const  result = await con.execute( sql );
        return result;
    },
    content : async (num) => {
        const con = await oracledb.getConnection(dbConfig);
        const sql =`select * from paging where num='${num}'`;
        const data = await con.execute(sql);
         return data;
    },
     totalContent : async () => {
        const con = await oracledb.getConnection(dbConfig);
        const sql = "select count(*) from paging";
    
        const totalContent = await con.execute( sql );
        return totalContent;
    }
}
const daoInsert = {
    write : async (body)=>{
        // script이용해서 alert 추가(등록성공/실패)
        const con = await oracledb.getConnection(dbConfig);
        const sql = 
        "insert into paging values(test_num.nextval,:title,sysdate,0)";
            let result;
             try{
                 result = await con.execute(sql, body);
             }catch(err){
             console.log(err)
             }
         }
    }

    const daoUpdate = { // 비동기방식으로 처리를 하다보니까 실행이 끝나던말던 무조건 실행하게?
         upHit : async ( num ) => {
        const con = await oracledb.getConnection(dbConfig);
         const sql = 
        `update paging set count=count+1 where num='${num}'`;
        await con.execute(sql);
         }
        }

module.exports = { daoRead,daoInsert ,daoUpdate};