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
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import net.sf.json.JSONObject;
import xin.liu.ConnectionPool;
import xin.liu.ConnectionPoolUtils;
import xin.liu.Meeting;
import xin.liu.User;

/**
 * Servlet implementation class createMeetingServlet
 */
@WebServlet("/createMeetingServlet")
public class createMeetingServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public createMeetingServlet() {
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
        String meetingStr = request.getParameter("meeting");
        String participantStr = request.getParameter("participants");
        //将前端传来的meetingStr、participantStr的JSON字符串转换为java对象然后再取值
        Gson gson = new Gson();
        Meeting meetingGson = gson.fromJson(meetingStr, new TypeToken<Meeting>(){}.getType());
        ArrayList<User> userGson = gson.fromJson(participantStr, new TypeToken<ArrayList<User>>(){}.getType());
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        String addResultFrontMeesage = "";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
	        // SQL语句
			//判断是否存在此用户
	        String sqlCount = "select * from meeting order by meetingID desc";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        Statement stmt = conn.createStatement();
	        Statement statement = conn.createStatement();
	        Statement stateInsert = conn.createStatement();
	        //先获取meetingID
        	ResultSet resultCount = stmt.executeQuery(sqlCount);
	        int meetingID = 0;
	        if(resultCount.next()){
	        	meetingID = resultCount.getInt(1);
	        	meetingID++;
            }
	        //开始添加会议
	        String sqlInsert = "insert into meeting values ('"+meetingID+"', '"+meetingGson.getMeetingName()+"', '"+meetingGson.getMeetingIntro()+"', "
	        		+ "'"+meetingGson.getStartTime()+"', '"+meetingGson.getEndTime()+"', '3', "
	        		+ "'"+meetingGson.getMeetingDomain()+"', '"+meetingGson.getMeetingTheme()+"', "
	        		+ "'"+meetingGson.getMeetingAddress()+"', '"+meetingGson.getMeetingKeyword()+"', '"+meetingGson.getHost()+"')";
	        stateInsert.executeUpdate(sqlInsert);
	        
	        //开始为会议添加人员
	        for(int i=0;i<userGson.size();i++){
	        	User user = userGson.get(i);
	        	String sqlInsert2 = "insert into user_meeting values ('"+user.getUserID()+"', '"+meetingID+"')";
	        	stateInsert.executeUpdate(sqlInsert2);
	        }
	        addResultFrontMeesage = "会议地址添加成功!";
	        
	        
	        /***************设置操作日志**************
    		 *1.获取姓名 
    		 *2.获取操作时间
    		 *3.获取参数
    		 *************************************/
	        String userName = meetingGson.getHost();
    		String operateTime = sdf.format(new Date());
    		String module = "会议管理";
    		String operate = "创建会议";
    		String parameter = "name="+userName;
    		String sql = "INSERT INTO businesslog VALUES ('"+userName+"', '"+operateTime+"', '"+module+"', '"+operate+"', '"+parameter+"')";
    		statement.executeUpdate(sql);
	        	          
	        //使用完数据库池释放
	        resultCount.close();
	        stmt.close();
	        statement.close();
	        stateInsert.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		//判断完后传数据给前端
		Gson gson1 = new Gson();
		String json = gson1.toJson(addResultFrontMeesage);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 
	}
}
