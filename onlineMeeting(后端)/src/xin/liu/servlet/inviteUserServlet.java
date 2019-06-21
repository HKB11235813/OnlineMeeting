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
import com.google.gson.reflect.TypeToken;

import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.Question;
import xin.liu.User;

/**
 * Servlet implementation class inviteUserServlet
 */
@WebServlet("/inviteUserServlet")
public class inviteUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public inviteUserServlet() {
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
        int meetingID = Integer.parseInt(request.getParameter("meetingID"));
        String inviteUserStr = request.getParameter("inviteUser");
        //将前端传来的meetingStr、participantStr的JSON字符串转换为java对象然后再取值
        Gson gson = new Gson();
        ArrayList<User> userGson = gson.fromJson(inviteUserStr, new TypeToken<ArrayList<User>>(){}.getType());
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stateInsert = conn.createStatement();
	        
	        //开始为会议添加新参会人员
	        for(int i=0;i<userGson.size();i++){
	        	User user = userGson.get(i);
	        	String sqlInsert2 = "insert into user_meeting values ('"+user.getUserID()+"', '"+meetingID+"')";
	        	stateInsert.executeUpdate(sqlInsert2);
	        }
	        //使用完数据库池释放
	        stateInsert.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
