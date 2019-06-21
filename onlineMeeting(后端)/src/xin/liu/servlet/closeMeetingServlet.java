package xin.liu.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;

/**
 * Servlet implementation class closeMeetingServlet
 */
@WebServlet("/closeMeetingServlet")
public class closeMeetingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public closeMeetingServlet() {
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
		String editType = request.getParameter("editType");
		String meetingID = request.getParameter("meetingID");
	    //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
	    response.setCharacterEncoding("utf-8");
	    response.setContentType("text/html");
	    PrintWriter out = response.getWriter();
	    String addResultFrontMeesage = "";
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//查看编辑类型是结束会议还是删除会议
			String sqlEdit = "update meeting set meetingStatusID=2 where meetingID = '"+meetingID+"'";
			if(editType.equals("删除会议")){
				sqlEdit = "delete from meeting where meetingID = '"+meetingID+"'";
			}else if(editType.equals("开始会议")){
				sqlEdit = "update meeting set meetingStatusID=1 where meetingID = '"+meetingID+"'";
			}
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stmt = conn.createStatement();
	        stmt.executeUpdate(sqlEdit);
	        addResultFrontMeesage = editType+"成功!";
	        //使用完数据库池释放
	        stmt.close();
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
