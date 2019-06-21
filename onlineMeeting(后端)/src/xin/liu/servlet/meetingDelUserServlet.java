package xin.liu.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;

/**
 * Servlet implementation class meetingDelUserServlet
 */
@WebServlet("/meetingDelUserServlet")
public class meetingDelUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public meetingDelUserServlet() {
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
		String meetingID = request.getParameter("meetingID");
		String userID = request.getParameter("userID");
	    //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
	    response.setCharacterEncoding("utf-8");
	    response.setContentType("text/html");
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        String sqlDel = "delete from user_meeting where userID = '"+userID+"' and meetingID = '"+meetingID+"'";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stmt = conn.createStatement();
	        stmt.executeUpdate(sqlDel);
	        //使用完数据库池释放
	        stmt.close();
	        connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
