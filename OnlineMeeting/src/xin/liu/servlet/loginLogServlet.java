package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.Meeting;
import xin.liu.loginLog;

/**
 * Servlet implementation class loginLogServlet
 */
@WebServlet("/loginLogServlet")
public class loginLogServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public loginLogServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//设置字符编码集
		response.addHeader("Access-Control-Allow-Origin","*");
        request.setCharacterEncoding("utf-8");
        //获取前台传来的数据请求，name为要查询的数据表
        int currentPage = Integer.parseInt(request.getParameter("currentPage"));
        String name = request.getParameter("userName");
        String loginTime = request.getParameter("loginTime");
        String endTime = request.getParameter("endTime");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        ArrayList<loginLog> logList = new ArrayList<loginLog>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			String sql = "SELECT * FROM loginlog where name like '%"+name+"%' "
	        		+ "limit "+((currentPage-1)*5)+","+(currentPage*5);
	        String sqlStr = "select count(*) from loginlog where name like '%"+name+"%'";
			if(loginTime!="" && endTime!=""){
				sql = "SELECT * FROM loginlog where name like '%"+name+"%' "
		        		+ "and loginTime between '"+loginTime+"' and '"+endTime+"' limit "+((currentPage-1)*5)+","+(currentPage*5);
		        sqlStr = "select count(*) from loginlog where name like '%"+name+"%' and loginTime between '"+loginTime+"' and '"+endTime+"'";
			}else if(loginTime!=""&&endTime==""){
				sql = "SELECT * FROM loginlog where name like '%"+name+"%' "
		        		+ "and loginTime >= '"+loginTime+"'limit "+((currentPage-1)*5)+","+(currentPage*5);
		        sqlStr = "select count(*) from loginlog where name like '%"+name+"%' and loginTime >= '"+loginTime+"'";
			}else if(loginTime==""&&endTime!=""){
				sql = "SELECT * FROM loginlog where name like '%"+name+"%' "
		        		+ "and loginTime <= '"+endTime+"' limit "+((currentPage-1)*5)+","+(currentPage*5);
		        sqlStr = "select count(*) from loginlog where name like '%"+name+"%' and loginTime <= '"+endTime+"'";
			}
	        
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement statement = conn.createStatement();
            ResultSet result = statement.executeQuery(sqlStr);
            int totalRecord=0,totalPage=0;
            if(result.next()){
            	totalRecord = result.getInt(1);
            	totalPage = totalRecord/5;
            	if(totalRecord%5!=0){
            		totalPage++;
            	}
            }
            
            Statement stmt = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	loginLog log = new loginLog();
	        	log.setUserName(rs.getString("name"));
	        	log.setLoginTime(sdf.format(rs.getTimestamp("loginTime")));
	        	log.setLoginIp(rs.getString("loginIp"));
	        	log.setTotalPage(totalPage);
	        	log.setTotalRecord(totalRecord);
	        	logList.add(log);
            }
	        
            //使用完数据库池释放
	        result.close();
	        statement.close();
            rs.close();
            stmt.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(logList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}

}
