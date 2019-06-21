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
import xin.liu.User;

/**
 * Servlet implementation class mainbodyServlet
 */
@WebServlet("/mainbodyServlet")
public class mainbodyServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public mainbodyServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(request, response);
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
		String userID = request.getParameter("userID");
        //响应前台，传一个MAP，Vector这些。如果只传一个值只需要out.print();
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        ArrayList<Meeting> meetingList = new ArrayList<Meeting>();//存储很多对象，一个对象就是一行
		try{
			ConnectionPool  connPool=ConnectionPoolUtils.GetPoolInstance();//单例模式创建连接池对象
			// SQL语句
	        String sql = "SELECT * FROM user_meeting left join meeting on user_meeting.meetingID=meeting.meetingID "
	        		+ "left join meetingstatus on meeting.meetingStatusID = meetingstatus.meetingStatusID WHERE userID='"
							+userID+"'";
	        Connection conn = connPool.getConnection(); // 从连接库中获取一个可用的连接
	        //操作之前更新之前所有的会议、时间到了的要开始，时间结束了的要结束
	        Statement updateStmt = conn.createStatement();
	        /*现在时间在开始和结束之间且会议还未开始，那么应该开始了*/
	        updateStmt.executeUpdate("update meeting set meeting.meetingStatusID=1 where meeting.meetingStatusID=3 and sysdate() between meeting.startTime and meeting.endTime");
	        /*正在进行的会议如果现在时间大于了开始时间那么应该结束了*/
	        updateStmt.executeUpdate("update meeting set meeting.meetingStatusID=2 where meeting.meetingStatusID=1 and sysdate() > meeting.endTime;");
	        
	        Statement stmt = conn.createStatement();
            Statement statement = conn.createStatement();
	        ResultSet rs = stmt.executeQuery(sql);
            //获得结果后操作
	        while(rs.next()){
	        	Meeting meeting = new Meeting();
	        	meeting.setMeetingName(rs.getString("meetingName"));
	        	meeting.setMeetingIntro(rs.getString("meetingIntro"));
	        	meeting.setHost(rs.getString("host"));
	        	meeting.setStartTime(sdf.format(rs.getTimestamp("startTime")));
	        	meeting.setEndTime(sdf.format(rs.getTimestamp("endTime")));
	        	meeting.setMeetingStatus(rs.getString("meetingStatusName"));
	        	meeting.setMeetingID(rs.getInt("meetingID"));
	        	meetingList.add(meeting);
            }
	        
	        /***************设置操作日志**************
    		 *1.获取姓名 
    		 *2.获取操作时间
    		 *3.获取参数
    		 *************************************/
	        String userName = request.getParameter("userName");
    		String operateTime = sdf.format(new Date());
    		String module = "主页";
    		String operate = "查看个人会议";
    		String parameter = "userID="+userID;
    		sql = "INSERT INTO businesslog VALUES ('"+userName+"', '"+operateTime+"', '"+module+"', '"+operate+"', '"+parameter+"')";
    		statement.executeUpdate(sql);
	        
            //使用完数据库池释放
            rs.close();
            stmt.close();
            statement.close();
            connPool.returnConnection(conn);// 连接使用完后释放连接到连接池
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		//判断完后传数据给前端
		Gson gson = new Gson();
		String json = gson.toJson(meetingList);
        out.print(json);
        out.flush();//刷新流
        out.close();//关闭流 	
	}

}
