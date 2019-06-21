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
import xin.liu.Domain;

/**
 * Servlet implementation class addUserServlet
 */
@WebServlet("/addUserServlet")
public class addUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public addUserServlet() {
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
		String name = request.getParameter("addname");
		String username = request.getParameter("addUsername");
		String password = request.getParameter("addPassword");
		String tellphone = request.getParameter("addTellphone");
		String email = request.getParameter("addEmail");
		int roleID =  Integer.parseInt(request.getParameter("addRole"));
		int domainID = Integer.parseInt(request.getParameter("addDomain"));
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String addResultFrontMeesage = "";
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        String sqlCount = "select * from user order by userID desc";
	        String sqlQuery = "select * from user where username='"+username+"'";
	        
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
            Statement stmt = conn.createStatement();
            Statement statement = conn.createStatement();
            Statement stateInsert = conn.createStatement();
            ResultSet resultQuery = stmt.executeQuery(sqlQuery);
            if(resultQuery.next()){
            	addResultFrontMeesage = "此用户存在,无法重复添加用户!";
            }else{
            	//若此用户名不存在则正常添加用户,先获取userID
            	ResultSet resultCount = statement.executeQuery(sqlCount);
    	        int userID = 0;
    	        if(resultCount.next()){
    	        	userID = resultCount.getInt(1);
    	        	userID++;
                }
    	        String createTime = sdf.format(new Date());
    	        String sqlInsert = "insert into user values ('"+userID+"', '"+name+"', '"+username+"', "
    	        		+ "'"+password+"', '"+domainID+"', '"+roleID+"', '"+tellphone+"', '"+email+"', '"+1+"', "
    	        		+ "'"+createTime+"', '"+2+"', '2000-11-11', '四川师范大学', '蔡徐坤打球无所置疑，全宇宙最帅', '四川省成都市')";
    	        stateInsert.executeUpdate(sqlInsert);
    	        addResultFrontMeesage = "用户添加成功!";
    	        //使用完数据库池释放
    	        resultCount.close();
            }
            //使用完数据库池释放
            statement.close();
            resultQuery.close();
            stmt.close();
            stateInsert.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(addResultFrontMeesage);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}
}
